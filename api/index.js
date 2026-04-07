import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  // Only allow if no users exist (initial setup)
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return res.status(403).json({ error: 'Registration is disabled.' });
    }

    const { username, password, name } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, name }
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, name: user.name, dailyGoal: user.dailyGoal } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Strict requirement: Joy / 1234
  if (username !== 'Joy' || password !== '1234') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    let user = await prisma.user.findUnique({ where: { username: 'Joy' } });
    
    // If Joy doesn't exist yet (first login), create the user
    if (!user) {
      const hashedPassword = await bcrypt.hash('1234', 10);
      user = await prisma.user.create({
        data: { 
          username: 'Joy', 
          password: hashedPassword,
          name: 'Joy'
        }
      });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, name: user.name, dailyGoal: user.dailyGoal } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- WATER LOGS ROUTES ---
app.get('/api/water-logs', authenticate, async (req, res) => {
  try {
    const logs = await prisma.waterLog.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/water-logs', authenticate, async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: 'Amount is required' });

  try {
    const log = await prisma.waterLog.create({
      data: {
        amount,
        userId: req.user.id,
      }
    });
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/water-logs/weekly', authenticate, async (req, res) => {
  try {
    const logs = await prisma.waterLog.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- ALERT ROUTES ---
app.get('/api/alerts', authenticate, async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/alerts/:id/dismiss', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const alert = await prisma.alert.update({
      where: { id, userId: req.user.id },
      data: { status: 'dismissed' }
    });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/alerts/scan', authenticate, async (req, res) => {
  try {
    const activeAlerts = await prisma.alert.findMany({
      where: { userId: req.user.id, status: 'active' }
    });

    if (activeAlerts.length === 0) {
      const alert = await prisma.alert.create({
        data: {
          userId: req.user.id,
          type: 'leak',
          title: 'Possible Leak Detected',
          description: 'Unusual water flow detected between 2:00–4:00 AM. Usage was 3x higher than normal for this period.',
          location: 'Kitchen area',
        }
      });
      return res.json({ result: 'leak_detected', alert });
    }

    res.json({ result: 'no_leaks_found' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- INSIGHTS ROUTES ---
app.get('/api/insights', authenticate, async (req, res) => {
  try {
    const logs = await prisma.waterLog.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'asc' }
    });

    const monthlyUsage = {};
    logs.forEach(log => {
      const month = log.date.toLocaleString('default', { month: 'short' });
      monthlyUsage[month] = (monthlyUsage[month] || 0) + log.amount;
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();
    const last4Months = [];
    for (let i = 3; i >= 0; i--) {
      const idx = (currentMonthIndex - i + 12) % 12;
      const m = months[idx];
      last4Months.push({ m, val: monthlyUsage[m] || 0 });
    }

    const totalUsage = logs.reduce((acc, log) => acc + log.amount, 0);

    res.json({
      trends: {
        monthly: {
          labels: last4Months.map(i => i.m),
          data: last4Months.map(i => i.val)
        },
        quarterly: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          data: [12800, 14200, 11600, 13680]
        }
      },
      breakdown: [
        { label: "Shower", value: 42, liters: `${Math.round(totalUsage * 0.42)} L` },
        { label: "Kitchen", value: 28, liters: `${Math.round(totalUsage * 0.28)} L` },
        { label: "Laundry", value: 18, liters: `${Math.round(totalUsage * 0.18)} L` },
        { label: "Other", value: 12, liters: `${Math.round(totalUsage * 0.12)} L` },
      ],
      recommendations: [
        "Reduce shower time by 2 minutes to save ~20 L/day",
        "Run washing machine with full loads only",
        "Fix the dripping kitchen faucet",
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- BILLING ROUTES ---
app.get('/api/billing', authenticate, async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const monthLogs = await prisma.waterLog.findMany({
      where: {
        userId: req.user.id,
        date: { gte: startOfMonth }
      }
    });

    const totalLiters = monthLogs.reduce((acc, log) => acc + log.amount, 0);
    const ratePerLiter = 0.012;
    const consumptionCost = totalLiters * ratePerLiter;
    const sewageCost = consumptionCost * 0.15;
    const serviceFee = 2.50;
    const totalBill = consumptionCost + sewageCost + serviceFee;

    res.json({
      estimatedBill: {
        total: totalBill.toFixed(2),
        consumption: consumptionCost.toFixed(2),
        sewage: sewageCost.toFixed(2),
        serviceFee: serviceFee.toFixed(2),
        liters: totalLiters
      },
      history: [
        { month: "March 2025", amount: "$53.00" },
        { month: "February 2025", amount: "$49.80" },
        { month: "January 2025", amount: "$44.20" },
      ],
      savings: [
        { action: "Fix kitchen leak", saving: "$8.40/mo" },
        { action: "Shorter showers (2 min less)", saving: "$4.20/mo" },
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- USER SETTINGS ROUTES ---
app.get('/api/user/settings', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        units: true,
        currency: true,
        leakAlerts: true,
        dailySummary: true,
        weeklySummary: true,
        billReminders: true,
        savingTips: true,
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/user/settings', authenticate, async (req, res) => {
  const data = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(data.units !== undefined && { units: data.units }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.leakAlerts !== undefined && { leakAlerts: data.leakAlerts }),
        ...(data.dailySummary !== undefined && { dailySummary: data.dailySummary }),
        ...(data.weeklySummary !== undefined && { weeklySummary: data.weeklySummary }),
        ...(data.billReminders !== undefined && { billReminders: data.billReminders }),
        ...(data.savingTips !== undefined && { savingTips: data.savingTips }),
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default app;

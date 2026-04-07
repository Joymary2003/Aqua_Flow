import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, ArrowDown, Target } from "lucide-react";
import CircularProgress from "@/components/ui/CircularProgress";
import MiniBarChart from "@/components/ui/MiniBarChart";
import WaterFlowAnimation from "@/components/ui/WaterFlowAnimation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DashboardScreen = () => {
  const [showLastWeek, setShowLastWeek] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Weekly logs from backend
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["waterLogs", "weekly"],
    queryFn: () => apiFetch("/water-logs/weekly"),
  });

  // Goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: (newGoal: number) =>
      apiFetch("/user/goal", {
        method: "PUT",
        body: JSON.stringify({ dailyGoal: newGoal }),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["userGoal"], data.dailyGoal);
      toast.success(`Daily goal updated to ${data.dailyGoal} L`);
    },
  });

  const dailyGoal = user?.dailyGoal || 150;

  // Process data from backend (Simplified mock projection for the chart)
  const thisWeekData = [0, 0, 0, 0, 0, 0, 0];
  let todayTotal = 0;
  
  if (!isLoading && logs.length > 0) {
    logs.forEach((log: any) => {
      const d = new Date(log.date);
      const dayIndex = (d.getDay() + 6) % 7; // Monday = 0
      thisWeekData[dayIndex] += log.amount;
      
      // If it's today
      if (d.toDateString() === new Date().toDateString()) {
        todayTotal += log.amount;
      }
    });
  }

  // Add water mutation
  const addWaterMutation = useMutation({
    mutationFn: (amount: number) =>
      apiFetch("/water-logs", {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waterLogs"] });
      toast.success("Water log added!");
    },
  });

  const lastWeekData = [135, 112, 128, 140, 118, 95, 110];
  const chartData = showLastWeek ? lastWeekData : thisWeekData;
  const totalThisWeek = thisWeekData.reduce((a, b) => a + b, 0);

  const adjustGoal = (delta: number) => {
    const newGoal = Math.max(50, dailyGoal + delta);
    updateGoalMutation.mutate(newGoal);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 px-5 pt-4 pb-4"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Good morning, {user?.name || "User"}</p>
          <h1 className="text-xl font-bold text-foreground">Water Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <WaterFlowAnimation />
        </div>
      </motion.div>

      {/* Today's Usage with adjustable goal */}
      <motion.div variants={item} className="glass-card p-6 flex flex-col items-center glow-accent" whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
        <CircularProgress value={todayTotal} max={dailyGoal} label="Today's usage" unit="liters" />
        <div className="flex items-center gap-1.5 mt-3">
          <AnimatedIcon icon={ArrowDown} size={14} className="text-success" />
          <span className="text-xs text-success font-medium">12% less than yesterday</span>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => adjustGoal(-10)}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="text-foreground text-sm font-bold">−</span>
          </button>
          <div className="flex items-center gap-1.5 flex-col">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <AnimatedIcon icon={Target} size={12} className="text-muted-foreground" />
              Goal: {dailyGoal} L
            </span>
            <button 
              onClick={() => addWaterMutation.mutate(25)}
              className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full mt-1 active:scale-95 transition-transform"
            >
              + Add 25L
            </button>
          </div>
          <button
            onClick={() => adjustGoal(10)}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="text-foreground text-sm font-bold">+</span>
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <button
          onClick={() => toast("Weekly average is calculated from the last 7 days of usage.")}
          className="glass-card p-4 text-left active:scale-[0.98] transition-transform"
        >
          <p className="text-xs text-muted-foreground mb-1">Weekly Avg</p>
          <p className="text-lg font-bold text-foreground">{Math.round(totalThisWeek / 7)} L</p>
          <div className="flex items-center gap-1 mt-1">
            <AnimatedIcon icon={TrendingDown} size={12} className="text-success" />
            <span className="text-[10px] text-success font-medium">-8% vs last week</span>
          </div>
        </button>
        <button
          onClick={() => toast("You're on track to stay under your monthly goal! 🎯")}
          className="glass-card p-4 text-left active:scale-[0.98] transition-transform"
        >
          <p className="text-xs text-muted-foreground mb-1">Monthly Total</p>
          <p className="text-lg font-bold text-foreground">{totalThisWeek + 2100} L</p>
          <p className="text-[10px] text-muted-foreground mt-1">Goal: {dailyGoal * 30} L</p>
        </button>
      </motion.div>

      {/* Weekly Chart with toggle */}
      <motion.div variants={item} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            {showLastWeek ? "Last Week" : "This Week"}
          </h2>
          <button
            onClick={() => setShowLastWeek(!showLastWeek)}
            className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded-full active:scale-[0.97] transition-transform"
          >
            {showLastWeek ? "Show this week" : "Compare last week"} →
          </button>
        </div>
        <MiniBarChart
          data={chartData}
          labels={weekLabels}
          accentIndex={showLastWeek ? undefined : 6}
        />
        <p className="text-[10px] text-muted-foreground text-center mt-3">{showLastWeek ? lastWeekData.reduce((a, b) => a + b, 0) : totalThisWeek} L total</p>
      </motion.div>
    </motion.div>
  );
};

export default DashboardScreen;

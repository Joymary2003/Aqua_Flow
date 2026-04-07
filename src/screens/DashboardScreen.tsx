import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Droplets, 
  TrendingUp, 
  AlertTriangle, 
  History, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import CircularProgress from "@/components/ui/CircularProgress";
import MiniBarChart from "@/components/ui/MiniBarChart";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const DashboardScreen = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");

  const { data: logs = [] } = useQuery({
    queryKey: ["waterLogs", "recent"],
    queryFn: () => apiFetch("/water-logs"),
    enabled: isAuthenticated
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => apiFetch("/alerts"),
    enabled: isAuthenticated
  });

  const dailyGoal = user?.dailyGoal || 150;
  const todayUsage = isAuthenticated ? logs.filter((l: any) => new Date(l.date).toDateString() === new Date().toDateString()).reduce((acc: number, l: any) => acc + l.amount, 0) : 42;
  
  const handleAddWater = () => {
    if (!isAuthenticated) {
      toast.error("Please Sign In to track your water usage");
      return;
    }
    toast.info("Logging feature coming soon to this dashboard!");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 px-5 pb-10"
    >
      {/* Welcome Section */}
      <motion.div variants={item} className="mt-2">
        <h2 className="text-sm font-medium text-blue-600/70 mb-1">Welcome back,</h2>
        <h1 className="text-3xl font-bold text-foreground">
          {user?.name || "Guest User"} 💧
        </h1>
      </motion.div>

      {/* Primary Usage Card - Large Blue Gradient */}
      <motion.div 
        variants={item}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 to-blue-400 p-8 text-white shadow-xl shadow-blue-500/20"
      >
        <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4">
          <Droplets size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-40 h-40 mb-4 scale-110">
            <CircularProgress 
              value={todayUsage} 
              max={dailyGoal} 
              label="" 
              unit="" 
              size={160}
              strokeWidth={12}
              color="white"
            />
          </div>
          <div className="text-center">
            <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-1">Today's Consumption</p>
            <h3 className="text-5xl font-black">{todayUsage}<span className="text-2xl font-normal ml-1 opacity-80">L</span></h3>
            <p className="text-white/60 text-xs mt-2 italic">Goal: {dailyGoal} Liters</p>
          </div>
        </div>

        <button 
          onClick={handleAddWater}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors active:scale-95"
        >
          <Plus size={24} className="text-white" />
        </button>
      </motion.div>

      {/* Summary Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-[24px] bg-gradient-to-b from-white/10 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <TrendingUp size={16} />
            </div>
            <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5">
              <ArrowDownRight size={10} /> 5%
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Monthly Avg</p>
          <p className="text-xl font-bold">124 <span className="text-xs font-normal opacity-60">L/day</span></p>
        </div>

        <div className="glass-card p-5 rounded-[24px]">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Calendar size={16} />
            </div>
            <span className="text-[10px] font-bold text-blue-500 flex items-center gap-0.5">
              <ArrowUpRight size={10} /> 12%
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Total Month</p>
          <p className="text-xl font-bold">3,720 <span className="text-xs font-normal opacity-60">L</span></p>
        </div>
      </motion.div>

      {/* Analytics Section */}
      <motion.div variants={item} className="glass-card p-6 rounded-[28px] relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-500" size={18} />
            <h2 className="font-bold text-sm">Usage Analytics</h2>
          </div>
          <div className="flex bg-secondary/50 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab("daily")}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'daily' ? 'bg-white shadow-sm text-blue-600' : 'text-muted-foreground'}`}
            >
              Daily
            </button>
            <button 
              onClick={() => setActiveTab("monthly")}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'monthly' ? 'bg-white shadow-sm text-blue-600' : 'text-muted-foreground'}`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-48 pt-4">
          <MiniBarChart 
            data={activeTab === 'daily' ? [65, 45, 75, 55, 80, 42, 60] : [120, 110, 130, 105]} 
            labels={activeTab === 'daily' ? ["M", "T", "W", "T", "F", "S", "S"] : ["W1", "W2", "W3", "W4"]}
          />
        </div>
      </motion.div>

      {/* Alerts Section */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={18} />
            <h2 className="font-bold text-sm">Active Alerts</h2>
          </div>
          <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            {isAuthenticated ? alerts.length : 1} Issue
          </span>
        </div>
        
        <div className="glass-card p-4 rounded-2xl border-l-4 border-amber-500 bg-amber-50/30">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Droplets className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Possible Leak Detected</p>
              <p className="text-xs text-muted-foreground mt-0.5">Continuous flow for 4 hours in the Kitchen area.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <History className="text-blue-500" size={18} />
          <h2 className="font-bold text-sm">Recent Activity</h2>
        </div>

        <div className="glass-card border-none bg-gradient-to-b from-white/10 to-transparent p-1">
          {isAuthenticated && logs.length > 0 ? (
            logs.slice(0, 3).map((log: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-border/10 last:border-0 hover:bg-blue-500/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Droplets size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold capitalize">{log.type || "Water Log"}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-blue-600">+{log.amount} L</p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Droplets size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold">Shower (Guest)</p>
                  <p className="text-[10px] text-muted-foreground">10:30 AM</p>
                </div>
              </div>
              <p className="text-sm font-black text-blue-600">+42 L</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardScreen;

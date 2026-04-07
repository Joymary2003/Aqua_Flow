import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, ChevronDown } from "lucide-react";
import MiniBarChart from "@/components/ui/MiniBarChart";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
};

const InsightsScreen = () => {
  const [period, setPeriod] = useState<"monthly" | "quarterly">("monthly");

  const { data: insights, isLoading } = useQuery({
    queryKey: ["insights"],
    queryFn: () => apiFetch("/insights"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground animate-pulse">Loading insights...</p>
      </div>
    );
  }

  const chartData = period === "monthly" ? insights?.trends.monthly : insights?.trends.quarterly;
  const categories = insights?.breakdown || [];
  const recommendations = insights?.recommendations || [];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 px-5 pt-4 pb-4"
    >
      <motion.div variants={item}>
        <h1 className="text-xl font-bold text-foreground">Usage Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your patterns</p>
      </motion.div>

      {/* Highlight Card */}
      <motion.div variants={item} className="glass-card p-5 glow-accent" whileHover={{ scale: 1.01 }}>
        <div className="flex items-center gap-2 mb-2">
          <AnimatedIcon icon={TrendingUp} size={16} className="text-warning" pulse />
          <span className="text-xs font-semibold text-warning">Attention</span>
        </div>
        <p className="text-sm text-foreground font-medium leading-relaxed">
          You used <span className="text-primary font-bold">18% more water</span> this week compared to last week.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Peak usage on Wednesday — consider shorter showers.
        </p>
      </motion.div>

      {/* Trend Chart with Toggle */}
      <motion.div variants={item} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            {period === "monthly" ? "Monthly" : "Quarterly"} Trends
          </h2>
          <motion.button
            onClick={() => setPeriod(period === "monthly" ? "quarterly" : "monthly")}
            className="flex items-center gap-1.5 text-muted-foreground bg-secondary px-2.5 py-1 rounded-full"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatedIcon icon={Calendar} size={12} className="text-muted-foreground" />
            <span className="text-[10px]">{period === "monthly" ? "Monthly" : "Quarterly"}</span>
            <ChevronDown size={10} />
          </motion.button>
        </div>
        <MiniBarChart data={chartData?.data || []} labels={chartData?.labels || []} accentIndex={(chartData?.data?.length || 1) - 1} />
      </motion.div>

      {/* Breakdown */}
      <motion.div variants={item} className="glass-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Usage Breakdown</h2>
        <div className="space-y-3">
          {categories.map((cat: any, i: number) => (
            <motion.button
              key={i}
              onClick={() => toast(`${cat.label}: ${cat.value}% of your total usage (${cat.liters})`)}
              className="w-full text-left"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-foreground font-medium">{cat.label}</span>
                <span className="text-[10px] text-muted-foreground">{cat.liters}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.value}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  style={{ opacity: 1 - i * 0.15 }}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={item} className="glass-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Recommendations</h2>
        <div className="space-y-2.5">
          {recommendations.map((rec: string, i: number) => (
            <motion.button
              key={i}
              onClick={() => toast.success(`Added to your goals: "${rec}"`)}
              className="flex items-start gap-2.5 w-full text-left"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              <p className="text-xs text-muted-foreground leading-relaxed">{rec}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InsightsScreen;

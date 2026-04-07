import { useState } from "react";
import { motion } from "framer-motion";
import { Receipt, TrendingDown, Wallet, PiggyBank, ChevronDown, Check } from "lucide-react";
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

const BillEstimationScreen = () => {
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [appliedSavings, setAppliedSavings] = useState<number[]>([]);

  const { data: billing, isLoading } = useQuery({
    queryKey: ["billing"],
    queryFn: () => apiFetch("/billing"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground animate-pulse">Calculating estimation...</p>
      </div>
    );
  }

  const savings = billing?.savings || [];
  const history = billing?.history || [];
  const billData = billing?.estimatedBill;

  const toggleSaving = (i: number) => {
    if (appliedSavings.includes(i)) {
      setAppliedSavings(appliedSavings.filter((s) => s !== i));
    } else {
      setAppliedSavings([...appliedSavings, i]);
      toast.success(`Goal set: ${savings[i].action}`);
    }
  };

  const visibleHistory = showAllHistory ? history : history.slice(0, 3);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 px-5 pt-4 pb-4"
    >
      <motion.div variants={item}>
        <h1 className="text-xl font-bold text-foreground">Bill Estimation</h1>
        <p className="text-sm text-muted-foreground mt-1">Predicted costs this month ({billData?.liters} L so far)</p>
      </motion.div>

      {/* Predicted Bill */}
      <motion.div
        variants={item}
        className="glass-card p-6 text-center glow-accent"
        whileHover={{ scale: 1.01 }}
      >
        <motion.div
          className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatedIcon icon={Receipt} size={22} className="text-primary" bounce />
        </motion.div>
        <p className="text-xs text-muted-foreground mb-1">Estimated Monthly Bill</p>
        <motion.p
          className="text-4xl font-bold text-gradient-aqua"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          ${billData?.total}
        </motion.p>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <AnimatedIcon icon={TrendingDown} size={14} className="text-success" pulse />
          <span className="text-xs text-success font-medium">$5.80 less than last month</span>
        </div>
      </motion.div>

      {/* Cost Breakdown */}
      <motion.div variants={item} className="glass-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Cost Breakdown</h2>
        <div className="space-y-3">
          {[
            { label: "Water consumption", cost: `$${billData?.consumption}`, pct: "82%" },
            { label: "Sewage charges", cost: `$${billData?.sewage}`, pct: "13%" },
            { label: "Service fee", cost: `$${billData?.serviceFee}`, pct: "5%" },
          ].map((row, i) => (
            <motion.button
              key={i}
              onClick={() => toast(`${row.label}: ${row.cost} (${row.pct} of your total bill)`)}
              className="w-full flex items-center justify-between py-2 border-b border-border/30 last:border-0"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-left">
                <p className="text-sm text-foreground">{row.label}</p>
                <p className="text-[10px] text-muted-foreground">{row.pct} of total</p>
              </div>
              <span className="text-sm font-semibold text-foreground">{row.cost}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Savings */}
      <motion.div variants={item} className="glass-card p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <AnimatedIcon icon={PiggyBank} size={16} className="text-primary" bounce />
          <h2 className="text-sm font-semibold text-foreground">Potential Savings</h2>
        </div>
        <div className="space-y-3">
          {savings.map((s: any, i: number) => {
            const applied = appliedSavings.includes(i);
            return (
              <motion.button
                key={i}
                onClick={() => toggleSaving(i)}
                className={`w-full flex items-center justify-between ${
                  applied ? "opacity-60" : ""
                }`}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      applied ? "bg-success border-success" : "border-muted-foreground"
                    }`}
                    animate={applied ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {applied && <Check size={10} className="text-background" />}
                  </motion.div>
                  <span className={`text-xs ${applied ? "line-through text-muted-foreground" : "text-muted-foreground"}`}>
                    {s.action}
                  </span>
                </div>
                <span className="text-xs text-primary font-semibold">{s.saving}</span>
              </motion.button>
            );
          })}
          <div className="pt-2 border-t border-border/30 flex items-center justify-between">
            <span className="text-xs text-foreground font-medium">Total potential savings</span>
            <span className="text-sm text-primary font-bold">$15.40/mo</span>
          </div>
        </div>
      </motion.div>

      {/* History */}
      <motion.div variants={item} className="glass-card p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <AnimatedIcon icon={Wallet} size={16} className="text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Bill History</h2>
        </div>
        <div className="space-y-2">
          {visibleHistory.map((b: any, i: number) => (
            <motion.div
              key={b.month}
              initial={i >= 3 ? { opacity: 0, height: 0 } : false}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center justify-between py-1.5"
            >
              <span className="text-xs text-muted-foreground">{b.month}</span>
              <span className="text-xs text-foreground font-medium">{b.amount}</span>
            </motion.div>
          ))}
        </div>
        <motion.button
          onClick={() => setShowAllHistory(!showAllHistory)}
          className="w-full mt-3 flex items-center justify-center gap-1 text-xs text-primary font-medium"
          whileTap={{ scale: 0.95 }}
        >
          {showAllHistory ? "Show less" : "Show more"}
          <motion.div animate={{ rotate: showAllHistory ? 180 : 0 }}>
            <ChevronDown size={12} />
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default BillEstimationScreen;

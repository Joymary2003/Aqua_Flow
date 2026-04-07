import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Droplets, ArrowRight, ShieldCheck, Check, X } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
};

const LeakDetectionScreen = () => {
  const queryClient = useQueryClient();
  const [completedActions, setCompletedActions] = useState<number[]>([]);

  // Fetch alerts
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => apiFetch("/alerts"),
  });

  // Dismiss alert mutation
  const dismissAlertMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/alerts/${id}/dismiss`, {
        method: "PUT",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast("Alert dismissed", { description: "We'll keep monitoring for issues." });
    },
  });

  // Manual scan mutation
  const runScanMutation = useMutation({
    mutationFn: () =>
      apiFetch("/alerts/scan", {
        method: "POST",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      if (data.result === "leak_detected") {
        toast.warning("Possible issue found! Check your alerts.");
      } else {
        toast.success("Scan complete — no leaks detected! ✅");
      }
    },
  });

  const actions = [
    { text: "Check kitchen pipes and connections", icon: Droplets },
    { text: "Inspect faucets for dripping", icon: Droplets },
    { text: "Turn off main valve if leak persists", icon: AlertTriangle },
  ];

  const toggleAction = (i: number) => {
    if (completedActions.includes(i)) {
      setCompletedActions(completedActions.filter((a) => a !== i));
    } else {
      setCompletedActions([...completedActions, i]);
      toast.success(`Marked as done: ${actions[i].text}`);
    }
  };

  const activeAlert = alerts.find((a: any) => a.status === "active");
  const history = alerts.filter((a: any) => a.status === "dismissed").slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground animate-pulse">Initializing sensors...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 px-5 pt-4 pb-4"
    >
      <motion.div variants={item}>
        <h1 className="text-xl font-bold text-foreground">Leak Detection</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time monitoring</p>
      </motion.div>

      {/* Active Alert */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            variants={item}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="glass-card p-5 border-warning/30"
            style={{ boxShadow: "0 0 24px hsl(38 92% 60% / 0.12)" }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center flex-shrink-0"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <AnimatedIcon icon={AlertTriangle} size={20} className="text-warning" pulse />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{activeAlert.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {activeAlert.description}
                </p>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="text-[10px] text-warning font-medium bg-warning/10 px-2 py-0.5 rounded-full">
                    {activeAlert.location || "System"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">• {new Date(activeAlert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <button
                  onClick={() => dismissAlertMutation.mutate(activeAlert.id)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={12} />
                  Dismiss alert
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeAlert && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 flex items-center gap-3 glow-accent"
        >
          <AnimatedIcon icon={ShieldCheck} size={20} className="text-success" pulse />
          <div>
            <h3 className="text-sm font-semibold text-foreground">All Clear</h3>
            <p className="text-xs text-muted-foreground">No active alerts. System is monitoring normally.</p>
          </div>
        </motion.div>
      )}

      {/* Suggested Actions */}
      <motion.div variants={item} className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground mb-3">Suggested Actions</h2>
        {actions.map((action, i) => {
          const done = completedActions.includes(i);
          return (
            <motion.button
              key={i}
              onClick={() => toggleAction(i)}
              className={`w-full glass-card p-4 flex items-center gap-3 text-left transition-all ${
                done ? "opacity-60" : ""
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                done ? "bg-success/15" : "bg-secondary"
              }`}>
                {done ? (
                  <Check size={14} className="text-success" />
                ) : (
                  <AnimatedIcon icon={action.icon} size={14} className="text-primary" />
                )}
              </div>
              <span className={`text-sm flex-1 ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {action.text}
              </span>
              {!done && <ArrowRight size={14} className="text-muted-foreground" />}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Status History */}
      <motion.div variants={item} className="glass-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Status</h2>
        <div className="space-y-3">
          {history.length > 0 ? history.map((entry: any, i: number) => (
            <motion.div
              key={entry.id}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  className="w-2 h-2 rounded-full bg-warning"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <span className="text-sm text-foreground">{entry.title} (Resolved)</span>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
            </motion.div>
          )) : (
            <p className="text-xs text-muted-foreground">No recent alerts recorded.</p>
          )}
        </div>
      </motion.div>

      {/* Scan Button */}
      <motion.div variants={item}>
        <motion.button
          onClick={() => runScanMutation.mutate()}
          disabled={runScanMutation.isPending}
          className="w-full glass-card p-4 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px hsl(var(--primary) / 0.2)" }}
          whileTap={{ scale: 0.97 }}
        >
          <AnimatedIcon icon={ShieldCheck} size={16} className={`${runScanMutation.isPending ? "animate-spin" : "text-primary"}`} />
          <span className="text-sm text-primary font-medium">
            {runScanMutation.isPending ? "Scanning..." : "Run Manual Scan"}
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LeakDetectionScreen;

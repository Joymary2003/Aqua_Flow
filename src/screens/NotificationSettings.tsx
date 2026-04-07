import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, AlertTriangle, BarChart3, Droplets, ChevronLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface NotificationSettingsProps {
  onBack: () => void;
}

const NotificationSettings = ({ onBack }: NotificationSettingsProps) => {
  const [permissions, setPermissions] = useState<"default" | "granted" | "denied">("default");
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ["userSettings"],
    queryFn: () => apiFetch("/user/settings"),
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) =>
      apiFetch("/user/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
  });

  const settings = {
    leakAlerts: currentSettings?.leakAlerts ?? true,
    dailySummary: currentSettings?.dailySummary ?? true,
    weeklySummary: currentSettings?.weeklySummary ?? false,
    billReminders: currentSettings?.billReminders ?? true,
    savingTips: currentSettings?.savingTips ?? false,
  };

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermissions(result);
      if (result === "granted") {
        new Notification("AquaFlow", {
          body: "Notifications enabled! You'll receive leak alerts and usage summaries.",
          icon: "/placeholder.svg",
        });
      }
    }
  };

  const toggle = (key: keyof typeof settings) => {
    updateSettingsMutation.mutate({ [key]: !settings[key] });
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const notifItems = [
    { key: "leakAlerts" as const, icon: AlertTriangle, label: "Leak Alerts", desc: "Instant alerts for unusual water flow", critical: true },
    { key: "dailySummary" as const, icon: Droplets, label: "Daily Summary", desc: "Your daily water usage recap at 8 PM" },
    { key: "weeklySummary" as const, icon: BarChart3, label: "Weekly Report", desc: "Detailed weekly insights every Sunday" },
    { key: "billReminders" as const, icon: Bell, label: "Bill Reminders", desc: "Upcoming bill payment alerts" },
    { key: "savingTips" as const, icon: Droplets, label: "Saving Tips", desc: "Personalized water-saving suggestions" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground animate-pulse">Loading notification settings...</p>
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
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
        >
          <ChevronLeft size={18} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">Manage your alerts</p>
        </div>
      </motion.div>

      {/* Permission Banner */}
      {permissions !== "granted" && (
        <motion.div variants={item} className="glass-card p-5 glow-accent">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              {permissions === "denied" ? (
                <BellOff size={20} className="text-destructive" />
              ) : (
                <Bell size={20} className="text-primary" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">
                {permissions === "denied"
                  ? "Notifications Blocked"
                  : "Enable Notifications"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {permissions === "denied"
                  ? "Please enable notifications in your browser settings to receive leak alerts."
                  : "Get instant leak alerts and daily usage summaries to stay on top of your water usage."}
              </p>
              {permissions !== "denied" && (
                <button
                  onClick={requestPermission}
                  className="mt-3 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold transition-all active:scale-[0.97]"
                >
                  Allow Notifications
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Notification Toggles */}
      <motion.div variants={item} className="glass-card overflow-hidden">
        {notifItems.map((n, i) => (
          <div
            key={n.key}
            className="flex items-center gap-3.5 p-4 border-b border-border/20 last:border-0"
          >
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <n.icon
                size={16}
                className={n.critical ? "text-warning" : "text-muted-foreground"}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground font-medium">{n.label}</p>
                {n.critical && (
                  <span className="text-[9px] font-semibold text-warning bg-warning/10 px-1.5 py-0.5 rounded-full">
                    Critical
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">{n.desc}</p>
            </div>
            <button
              onClick={() => toggle(n.key)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                settings[n.key] ? "bg-primary" : "bg-secondary"
              }`}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-foreground"
                animate={{ x: settings[n.key] ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ backgroundColor: settings[n.key] ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))" }}
              />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Quiet Hours */}
      <motion.div variants={item} className="glass-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-1">Quiet Hours</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Non-critical notifications are paused during quiet hours.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-foreground font-medium">10:00 PM — 7:00 AM</span>
          <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">Active</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationSettings;

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Shield, Eye, EyeOff, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

interface PrivacySettingsProps {
  onBack: () => void;
}

const PrivacySettings = ({ onBack }: PrivacySettingsProps) => {
  const [settings, setSettings] = useState({
    shareAnonymousData: true,
    showUsageToNeighbors: false,
    locationTracking: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
    toast.success("Privacy setting updated");
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  const privacyItems = [
    { key: "shareAnonymousData" as const, label: "Anonymous Usage Data", desc: "Help improve AquaFlow with anonymized data" },
    { key: "showUsageToNeighbors" as const, label: "Community Comparison", desc: "Allow your usage to appear in neighborhood averages" },
    { key: "locationTracking" as const, label: "Location Services", desc: "Used to detect your water provider and rates" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 px-5 pt-4 pb-4">
      <motion.div variants={item} className="flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ChevronLeft size={18} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Privacy</h1>
          <p className="text-sm text-muted-foreground">Data & permissions</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card overflow-hidden">
        {privacyItems.map((p) => (
          <div key={p.key} className="flex items-center gap-3.5 p-4 border-b border-border/20 last:border-0">
            <div className="flex-1">
              <p className="text-sm text-foreground font-medium">{p.label}</p>
              <p className="text-[10px] text-muted-foreground">{p.desc}</p>
            </div>
            <button
              onClick={() => toggle(p.key)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                settings[p.key] ? "bg-primary" : "bg-secondary"
              }`}
            >
              <motion.div
                className="w-5 h-5 rounded-full"
                animate={{ x: settings[p.key] ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ backgroundColor: settings[p.key] ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))" }}
              />
            </button>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="space-y-3">
        <button
          onClick={() => toast.success("Your data export has been started. You'll receive an email shortly.")}
          className="w-full glass-card p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <Download size={16} className="text-primary" />
          <span className="text-sm text-foreground font-medium">Export My Data</span>
        </button>
        <button
          onClick={() => toast.error("Account deletion requires email confirmation. Check your inbox.")}
          className="w-full glass-card p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <Trash2 size={16} className="text-destructive" />
          <span className="text-sm text-destructive font-medium">Delete Account</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PrivacySettings;

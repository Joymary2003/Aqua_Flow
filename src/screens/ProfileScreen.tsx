import { motion } from "framer-motion";
import { User as UserIcon, Bell, Ruler, ChevronRight, LogOut, Shield, HelpCircle, Palette } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface ProfileScreenProps {
  onNotificationTap?: () => void;
  onUnitsTap?: () => void;
  onPrivacyTap?: () => void;
  onHelpTap?: () => void;
  onSignOut?: () => void;
}

const ProfileScreen = ({ onNotificationTap, onUnitsTap, onPrivacyTap, onHelpTap, onSignOut }: ProfileScreenProps) => {
  const { user } = useAuth();
  
  const { data: insights } = useQuery({
    queryKey: ["insights"],
    queryFn: () => apiFetch("/insights"),
  });

  const { data: billing } = useQuery({
    queryKey: ["billing"],
    queryFn: () => apiFetch("/billing"),
  });

  const totalThisMonth = billing?.estimatedBill?.liters || 0;
  const avgDaily = insights?.trends?.monthly?.data?.slice(-1)[0] || 0; // Simplified avg
  const saved = "$15.40"; // Simplified for now

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 px-5 pt-4 pb-4"
    >
      <motion.div variants={item}>
        <h1 className="text-xl font-bold text-foreground">Profile & Settings</h1>
      </motion.div>

      {/* User Card */}
      <motion.div variants={item} className="glass-card p-5 flex items-center gap-4" whileHover={{ scale: 1.01 }}>
        <motion.div
          className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center"
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <AnimatedIcon icon={UserIcon} size={24} className="text-primary" bounce />
        </motion.div>
        <div>
          <h2 className="text-base font-semibold text-foreground">{user?.name || "User"}</h2>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <p className="text-[10px] text-primary font-medium mt-1">Premium Plan</p>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {[
          { label: "Avg Daily", value: `${avgDaily} L` },
          { label: "This Month", value: `${totalThisMonth} L` },
          { label: "Saved", value: saved },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="glass-card p-3 text-center"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <p className="text-sm font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Theme Toggle */}
      <motion.div variants={item} className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-secondary items-center justify-center hidden sm:flex">
            <AnimatedIcon icon={Palette} size={16} className="text-muted-foreground" spin />
          </div>
          <div>
            <p className="text-sm text-foreground font-medium">Appearance</p>
            <p className="text-[10px] text-muted-foreground">Dark / Light mode</p>
          </div>
        </div>
        <ThemeToggle />
      </motion.div>

      {/* Settings */}
      <motion.div variants={item} className="glass-card overflow-hidden">
        {[
          { icon: Bell, label: "Notifications", desc: "Alerts & reminders", action: onNotificationTap },
          { icon: Ruler, label: "Units", desc: "Liters / Gallons", action: onUnitsTap },
          { icon: Shield, label: "Privacy", desc: "Data & permissions", action: onPrivacyTap },
          { icon: HelpCircle, label: "Help & Support", desc: "FAQ & contact", action: onHelpTap },
        ].map((setting, i) => (
          <motion.button
            key={i}
            onClick={setting.action}
            className="w-full flex items-center gap-3.5 p-4 border-b border-border/20 last:border-0 text-left active:bg-secondary/30 transition-colors"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <AnimatedIcon icon={setting.icon} size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground font-medium">{setting.label}</p>
              <p className="text-[10px] text-muted-foreground">{setting.desc}</p>
            </div>
            <ChevronRight size={14} className="text-muted-foreground" />
          </motion.button>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.div variants={item}>
        <motion.button
          onClick={onSignOut}
          className="w-full glass-card p-4 flex items-center justify-center gap-2 text-destructive"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <AnimatedIcon icon={LogOut} size={16} className="text-destructive" />
          <span className="text-sm font-medium">Sign Out</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ProfileScreen;

import { Droplets, AlertTriangle, BarChart3, Receipt, Lightbulb, User } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedIcon from "@/components/ui/AnimatedIcon";

interface BottomNavProps {
  active: string;
  onNavigate: (screen: string) => void;
}

const navItems = [
  { id: "dashboard", icon: Droplets, label: "Home" },
  { id: "leaks", icon: AlertTriangle, label: "Leaks" },
  { id: "insights", icon: BarChart3, label: "Insights" },
  { id: "bills", icon: Receipt, label: "Bills" },
  { id: "tips", icon: Lightbulb, label: "Tips" },
  { id: "profile", icon: User, label: "Profile" },
];

const BottomNav = ({ active, onNavigate }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card-strong rounded-none border-t border-glass-border/20 border-x-0 border-b-0">
      <div className="flex items-center justify-around px-2 pt-2 pb-6 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors"
              whileTap={{ scale: 0.85 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-8 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={isActive ? { y: [0, -2, 0] } : { y: 0 }}
                transition={isActive ? { duration: 0.4, ease: "easeOut" } : {}}
              >
                <AnimatedIcon
                  icon={item.icon}
                  size={20}
                  className={isActive ? "text-primary" : "text-muted-foreground"}
                />
              </motion.div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

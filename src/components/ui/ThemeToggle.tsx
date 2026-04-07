import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("aquaflow-theme");
    return saved !== "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("light");
      localStorage.setItem("aquaflow-theme", "dark");
    } else {
      root.classList.add("light");
      localStorage.setItem("aquaflow-theme", "light");
    }
  }, [isDark]);

  // Apply saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("aquaflow-theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
    }
  }, []);

  return (
    <motion.button
      onClick={() => setIsDark(!isDark)}
      className="relative w-14 h-7 rounded-full bg-secondary border border-border overflow-hidden"
      whileTap={{ scale: 0.95 }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDark
            ? "linear-gradient(135deg, hsl(220 40% 15%), hsl(240 30% 20%))"
            : "linear-gradient(135deg, hsl(45 100% 85%), hsl(200 80% 90%))",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Sliding thumb */}
      <motion.div
        className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
        animate={{
          x: isDark ? 2 : 30,
          backgroundColor: isDark ? "hsl(220 30% 25%)" : "hsl(45 100% 65%)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 0 : 360 }}
          transition={{ duration: 0.5 }}
        >
          {isDark ? (
            <Moon size={12} className="text-primary" />
          ) : (
            <Sun size={12} className="text-amber-900" />
          )}
        </motion.div>
      </motion.div>

      {/* Stars for dark mode */}
      {isDark && (
        <>
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-foreground/40"
            style={{ top: 5, right: 8 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-0.5 h-0.5 rounded-full bg-foreground/30"
            style={{ top: 14, right: 14 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}
    </motion.button>
  );
};

export default ThemeToggle;

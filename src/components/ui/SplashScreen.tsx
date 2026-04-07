import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"ripple" | "logo" | "exit">("ripple");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 600);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => onComplete(), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Ripple rings */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary/20"
              initial={{ width: 0, height: 0, opacity: 0.6 }}
              animate={{
                width: [0, 400 + i * 100],
                height: [0, 400 + i * 100],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Central glow */}
          <motion.div
            className="absolute w-40 h-40 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            }}
            animate={{ scale: [0.8, 1.5, 1], opacity: [0, 0.8, 0.4] }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Water drop SVG */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M12 2C12 2 5 10 5 15C5 18.866 8.134 22 12 22C15.866 22 19 18.866 19 15C19 10 12 2 12 2Z"
                fill="hsl(var(--primary))"
                fillOpacity={0.9}
              />
              <path
                d="M10 16C10 16 9 14 9 13C9 11.5 10.5 10 10.5 10"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="1"
                strokeLinecap="round"
                strokeOpacity={0.4}
              />
            </motion.svg>

            {/* Logo text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-4 text-center"
            >
              <h1 className="text-2xl font-bold text-gradient-aqua">AquaFlow</h1>
              <motion.p
                className="text-xs text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Smart Water Monitoring
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Bottom shimmer line */}
          <motion.div
            className="absolute bottom-20 h-px w-32 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)",
            }}
            animate={{ x: [-60, 60], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SplashScreen;

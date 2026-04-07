import { motion } from "framer-motion";

const WaterFlowAnimation = () => {
  const droplets = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
      {/* Animated ripple ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/30"
        animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/20"
        animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
      />

      {/* Central drop icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="relative z-10">
        <motion.path
          d="M12 2C12 2 5 10 5 15C5 18.866 8.134 22 12 22C15.866 22 19 18.866 19 15C19 10 12 2 12 2Z"
          fill="hsl(var(--primary))"
          fillOpacity={0.8}
          animate={{ fillOpacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Mini floating droplets */}
      {droplets.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          initial={{
            x: 0,
            y: 10,
            opacity: 0,
          }}
          animate={{
            y: [10, -10],
            x: [0, (i - 2) * 4],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default WaterFlowAnimation;

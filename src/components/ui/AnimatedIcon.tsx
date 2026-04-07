import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  pulse?: boolean;
  bounce?: boolean;
  spin?: boolean;
}

const AnimatedIcon = ({
  icon: Icon,
  size = 16,
  className = "",
  pulse = false,
  bounce = false,
  spin = false,
}: AnimatedIconProps) => {
  const animationProps = pulse
    ? {
        animate: { scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] },
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
      }
    : bounce
    ? {
        animate: { y: [0, -3, 0] },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
      }
    : spin
    ? {
        animate: { rotate: 360 },
        transition: { duration: 8, repeat: Infinity, ease: "linear" as const },
      }
    : {
        whileHover: { scale: 1.2, rotate: 5 },
        whileTap: { scale: 0.9 },
        transition: { type: "spring" as const, stiffness: 400, damping: 15 },
      };

  return (
    <motion.div className="inline-flex" {...animationProps}>
      <Icon size={size} className={className} />
    </motion.div>
  );
};

export default AnimatedIcon;

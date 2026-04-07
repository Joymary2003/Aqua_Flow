import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Droplets,
    title: "Track Every Drop",
    description: "Monitor your daily water consumption in real-time. Know exactly how much you use and where you can save.",
    accent: "168 76% 64%",
  },
  {
    icon: ShieldCheck,
    title: "Detect Leaks Early",
    description: "Get instant alerts when unusual water flow is detected. Prevent damage and avoid surprise bills.",
    accent: "187 80% 70%",
  },
  {
    icon: BarChart3,
    title: "Smart Insights",
    description: "Understand your usage patterns with weekly trends, cost estimates, and personalized saving tips.",
    accent: "160 60% 50%",
  },
];

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between px-8 py-16 max-w-lg mx-auto">
      {/* Skip */}
      <div className="w-full flex justify-end">
        <button
          onClick={onComplete}
          className="text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-full hover:bg-secondary transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col items-center text-center flex-1 justify-center"
        >
          {/* Icon with glow */}
          <div className="relative mb-10">
            {/* Glow rings */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, hsl(${slide.accent} / 0.12) 0%, transparent 70%)`,
                width: 180,
                height: 180,
                left: -50,
                top: -50,
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, hsl(${slide.accent} / 0.2), hsl(${slide.accent} / 0.05))`,
                border: `1px solid hsl(${slide.accent} / 0.2)`,
              }}
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <slide.icon size={36} className="text-primary" />
            </motion.div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-3">{slide.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
            {slide.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom controls */}
      <div className="w-full space-y-6">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full ${i === current ? "bg-primary" : "bg-secondary"}`}
              animate={{ width: i === current ? 24 : 6 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {current === slides.length - 1 ? "Get Started" : "Continue"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    title: "Welcome to AquaFlow",
    subtitle: "Track and manage your water usage effortlessly",
    visual: "water-flow",
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "Smart Insights",
    subtitle: "Understand your water consumption with intelligent analytics",
    visual: "charts-water",
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Take Control",
    subtitle: "Monitor, optimize, and save water efficiently",
    visual: "action-focus",
    color: "from-blue-500 to-indigo-600",
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-between px-8 py-16 max-w-lg mx-auto relative overflow-hidden">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${slide.color} opacity-5 transition-colors duration-700`} />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center text-center flex-1 justify-center z-10"
        >
          {/* Visual Area */}
          <div className="h-64 w-full flex items-center justify-center mb-12">
            {slide.visual === "water-flow" && (
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-32 h-32 rounded-full bg-blue-500/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping opacity-20" />
                  <div className="w-20 h-20 rounded-full bg-blue-500/40 blur-xl absolute" />
                  <Droplets size={64} className="text-blue-500 relative z-10" />
                </div>
              </motion.div>
            )}

            {slide.visual === "charts-water" && (
              <div className="flex items-end gap-3 h-32">
                {[40, 70, 50, 90].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                    className="w-6 rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 relative overflow-hidden"
                  >
                    <motion.div 
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-0 left-0 right-0 h-1 bg-white/30"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {slide.visual === "action-focus" && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative"
              >
                <div className="w-40 h-40 rounded-full border-4 border-blue-500/30 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-2 border-blue-400/20 flex items-center justify-center">
                    <ShieldCheck size={48} className="text-blue-600" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10" />
              </motion.div>
            )}
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 mb-4"
          >
            {slide.title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-[300px]"
          >
            {slide.subtitle}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom controls */}
      <div className="w-full space-y-10 z-10">
        {/* Dots */}
        <div className="flex items-center justify-center gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-blue-500" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={next}
          className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25"
        >
          {current === slides.length - 1 ? "Get Started" : "Continue"}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;

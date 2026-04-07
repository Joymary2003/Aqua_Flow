import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, ShowerHead, Timer, Wrench, Leaf, Check, BookmarkPlus, Bookmark } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import { toast } from "sonner";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
};

const tips = [
  {
    icon: ShowerHead,
    title: "Shorten Your Shower",
    description: "Reducing shower time by 2 minutes can save up to 20 liters per day.",
    tag: "High Impact",
    detail: "The average shower uses about 9 liters per minute. By cutting just 2 minutes off your routine, you could save 140 liters per week — that's over 7,000 liters per year!",
  },
  {
    icon: Wrench,
    title: "Fix Leaky Faucets",
    description: "A dripping faucet can waste over 30 liters per day. Fix it promptly.",
    tag: "Urgent",
    detail: "Even a slow drip (one drop per second) adds up to 20 liters/day. A fast drip wastes even more. Most faucet leaks can be fixed by replacing a worn washer — a simple DIY fix.",
  },
  {
    icon: Timer,
    title: "Use a Timer",
    description: "Set a timer for showers and dishwashing to stay mindful of usage.",
    tag: "Easy Win",
    detail: "Set a 5-minute timer for showers. Use a basin when washing dishes instead of running water continuously. These small habits compound into significant savings.",
  },
  {
    icon: Droplets,
    title: "Full Loads Only",
    description: "Run dishwashers and washing machines with full loads to maximize efficiency.",
    tag: "Smart Habit",
    detail: "A washing machine uses about 50 liters per load regardless of how full it is. Running full loads instead of half loads can save up to 100 liters per week.",
  },
  {
    icon: Leaf,
    title: "Water Plants Wisely",
    description: "Water plants in early morning or evening to reduce evaporation.",
    tag: "Eco-Friendly",
    detail: "Watering during cooler parts of the day reduces evaporation by up to 50%. Use mulch around plants to retain moisture, and consider collecting rainwater for garden use.",
  },
];

const TipsScreen = () => {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [savedTips, setSavedTips] = useState<number[]>([]);

  const toggleSave = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedTips.includes(i)) {
      setSavedTips(savedTips.filter((t) => t !== i));
      toast("Tip removed from saved");
    } else {
      setSavedTips([...savedTips, i]);
      toast.success("Tip saved for later! 📌");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 px-5 pt-4 pb-4"
    >
      <motion.div variants={item}>
        <h1 className="text-xl font-bold text-foreground">Tips & Recommendations</h1>
        <p className="text-sm text-muted-foreground mt-1">Save water, save money</p>
      </motion.div>

      {/* Personalized Tip */}
      <motion.div variants={item} className="glass-card p-5 glow-accent" whileHover={{ scale: 1.01 }}>
        <p className="text-[10px] text-primary font-semibold uppercase tracking-wider mb-2">
          Personalized for you
        </p>
        <p className="text-sm text-foreground font-medium leading-relaxed">
          Based on your usage patterns, reducing shower time would save you the most water — approximately <span className="text-primary font-bold">140 liters per week</span>.
        </p>
      </motion.div>

      {/* Tips List */}
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <motion.div key={i} variants={item}>
            <motion.button
              onClick={() => setExpandedTip(expandedTip === i ? null : i)}
              className="w-full glass-card p-4 flex items-start gap-3.5 text-left"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
                whileHover={{ rotate: 10 }}
              >
                <AnimatedIcon icon={tip.icon} size={18} className="text-primary" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
                  <motion.button
                    onClick={(e) => toggleSave(i, e)}
                    className="p-1 rounded-lg transition-colors"
                    whileTap={{ scale: 0.8 }}
                  >
                    {savedTips.includes(i) ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                        <Bookmark size={14} className="text-primary fill-primary" />
                      </motion.div>
                    ) : (
                      <BookmarkPlus size={14} className="text-muted-foreground" />
                    )}
                  </motion.button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                <span className="inline-block mt-2 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {tip.tag}
                </span>
              </div>
            </motion.button>
            <AnimatePresence>
              {expandedTip === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="glass-card mx-2 mt-1 p-4 rounded-t-none border-t-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.detail}</p>
                    <motion.button
                      onClick={() => {
                        toast.success(`Applied "${tip.title}" to your daily goals!`);
                        setExpandedTip(null);
                      }}
                      className="mt-3 flex items-center gap-1.5 text-xs text-primary font-semibold"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Check size={12} />
                      Apply this tip
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TipsScreen;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, HelpCircle, ChevronDown, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface HelpSupportProps {
  onBack: () => void;
}

const faqs = [
  { q: "How does leak detection work?", a: "AquaFlow monitors your water flow patterns 24/7. When usage deviates significantly from your normal patterns (especially during off-hours like 2-5 AM), we flag it as a potential leak and send you an alert." },
  { q: "How accurate is the bill estimation?", a: "Bill estimates are based on your actual usage data combined with your local water rates. Accuracy is typically within 5-10% of your actual bill." },
  { q: "Can I connect multiple properties?", a: "Yes! Premium plan users can monitor up to 5 properties. Go to Profile → Add Property to set up additional locations." },
  { q: "How do I update my water rate?", a: "Go to Profile → Units & Currency. Your rate is auto-detected based on your location, but you can manually override it." },
  { q: "What data do you collect?", a: "We only collect water usage data from your connected meter. See our Privacy settings for full details on data handling." },
];

const HelpSupport = ({ onBack }: HelpSupportProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 px-5 pt-4 pb-4">
      <motion.div variants={item} className="flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ChevronLeft size={18} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Help & Support</h1>
          <p className="text-sm text-muted-foreground">FAQ & contact</p>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div variants={item} className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground mb-3">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <span className="text-sm text-foreground font-medium pr-4">{faq.q}</span>
              <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} className="text-muted-foreground flex-shrink-0" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>

      {/* Contact */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Contact Us</h2>
        <button
          onClick={() => toast.success("Opening email client...")}
          className="w-full glass-card p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail size={16} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm text-foreground font-medium">Email Support</p>
            <p className="text-[10px] text-muted-foreground">support@aquaflow.app</p>
          </div>
          <ExternalLink size={14} className="text-muted-foreground" />
        </button>
        <button
          onClick={() => toast.success("Live chat will be available soon!")}
          className="w-full glass-card p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageCircle size={16} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm text-foreground font-medium">Live Chat</p>
            <p className="text-[10px] text-muted-foreground">Avg. response: 5 min</p>
          </div>
          <ExternalLink size={14} className="text-muted-foreground" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default HelpSupport;

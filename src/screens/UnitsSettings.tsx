import { motion } from "framer-motion";
import { ChevronLeft, Ruler, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface UnitsSettingsProps {
  onBack: () => void;
}

const units = [
  { id: "liters", label: "Liters (L)", desc: "Metric system" },
  { id: "gallons", label: "Gallons (gal)", desc: "Imperial system" },
  { id: "cubicMeters", label: "Cubic Meters (m³)", desc: "Standard SI unit" },
];

const currencies = [
  { id: "usd", label: "USD ($)", symbol: "$" },
  { id: "eur", label: "EUR (€)", symbol: "€" },
  { id: "gbp", label: "GBP (£)", symbol: "£" },
  { id: "inr", label: "INR (₹)", symbol: "₹" },
];

const UnitsSettings = ({ onBack }: UnitsSettingsProps) => {
  const queryClient = useQueryClient();

  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ["userSettings"],
    queryFn: () => apiFetch("/user/settings"),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) =>
      apiFetch("/user/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      toast.success("Preferences updated");
    },
  });

  const selectedUnit = currentSettings?.units || "liters";
  const selectedCurrency = currentSettings?.currency || "usd";

  const handleUnitChange = (id: string) => {
    updateSettingsMutation.mutate({ units: id });
  };

  const handleCurrencyChange = (id: string) => {
    updateSettingsMutation.mutate({ currency: id });
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground animate-pulse">Loading preferences...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 px-5 pt-4 pb-4">
      <motion.div variants={item} className="flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ChevronLeft size={18} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Units & Currency</h1>
          <p className="text-sm text-muted-foreground">Measurement preferences</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Ruler size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Water Measurement</h2>
        </div>
        <div className="space-y-2">
          {units.map((u) => (
            <button
              key={u.id}
              onClick={() => handleUnitChange(u.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                selectedUnit === u.id ? "bg-primary/10 border border-primary/30" : "bg-secondary/50"
              }`}
            >
              <div className="text-left">
                <p className="text-sm text-foreground font-medium">{u.label}</p>
                <p className="text-[10px] text-muted-foreground">{u.desc}</p>
              </div>
              {selectedUnit === u.id && <Check size={16} className="text-primary" />}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Currency</h2>
        <div className="grid grid-cols-2 gap-2">
          {currencies.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCurrencyChange(c.id)}
              className={`p-3 rounded-xl text-center transition-colors ${
                selectedCurrency === c.id ? "bg-primary/10 border border-primary/30" : "bg-secondary/50"
              }`}
            >
              <p className="text-sm text-foreground font-medium">{c.label}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UnitsSettings;

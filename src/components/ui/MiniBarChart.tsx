import { motion } from "framer-motion";

interface MiniBarChartProps {
  data: number[];
  labels: string[];
  maxValue?: number;
  accentIndex?: number;
}

const MiniBarChart = ({ data, labels, maxValue, accentIndex }: MiniBarChartProps) => {
  const max = maxValue || Math.max(...data);

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((value, i) => {
        const height = (value / max) * 100;
        const isAccent = accentIndex === i;
        return (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <span className="text-[10px] text-muted-foreground font-medium">
              {value}L
            </span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
              className={`w-full rounded-lg min-h-[4px] ${
                isAccent
                  ? "bg-primary glow-accent"
                  : "bg-secondary"
              }`}
            />
            <span className="text-[10px] text-muted-foreground">{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MiniBarChart;

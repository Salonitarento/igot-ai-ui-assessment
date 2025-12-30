import { cn } from "@/lib/utils";
import { TrendingUp, Minus, TrendingDown } from "lucide-react";

interface DifficultyConfigProps {
  values: Record<string, number>;
  onChange: (difficulty: string, value: number) => void;
}

const difficulties = [
  { id: "easy", name: "Easy", icon: TrendingDown, colorClass: "bg-difficulty-easy", textClass: "text-difficulty-easy" },
  { id: "medium", name: "Medium", icon: Minus, colorClass: "bg-difficulty-medium", textClass: "text-difficulty-medium" },
  { id: "hard", name: "Hard", icon: TrendingUp, colorClass: "bg-difficulty-hard", textClass: "text-difficulty-hard" },
];

const DifficultyConfig = ({ values, onChange }: DifficultyConfigProps) => {
  const total = Object.values(values).reduce((sum, v) => sum + v, 0);

  return (
    <div className="glass rounded-xl p-6 border border-border/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Difficulty Distribution</h3>
          <p className="text-sm text-muted-foreground">Balance question complexity</p>
        </div>
        <div className="text-right">
          <span className={cn(
            "text-2xl font-bold",
            total === 100 ? "text-primary" : "text-destructive"
          )}>
            {total}%
          </span>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {difficulties.map((diff, index) => {
          const Icon = diff.icon;
          return (
            <div
              key={diff.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "glass rounded-lg p-4 border border-border/30 text-center",
                "hover:border-border/50 transition-all duration-300"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center",
                  diff.colorClass + "/20"
                )}>
                  <Icon className={cn("w-5 h-5", diff.textClass)} />
                </div>
                <span className="text-sm font-medium text-foreground block mb-2">{diff.name}</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={values[diff.id] || 0}
                  onChange={(e) => onChange(diff.id, parseInt(e.target.value) || 0)}
                  className={cn(
                    "w-full text-center text-lg font-mono py-2 rounded-md",
                    "bg-secondary/50 border border-border/30",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    diff.textClass
                  )}
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultyConfig;

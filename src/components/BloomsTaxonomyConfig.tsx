import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";

interface BloomLevel {
  id: string;
  name: string;
  description: string;
  colorClass: string;
}

const bloomLevels: BloomLevel[] = [
  { id: "remember", name: "Remember", description: "Recall facts", colorClass: "bg-bloom-remember" },
  { id: "understand", name: "Understand", description: "Explain ideas", colorClass: "bg-bloom-understand" },
  { id: "apply", name: "Apply", description: "Use information", colorClass: "bg-bloom-apply" },
  { id: "analyze", name: "Analyze", description: "Draw connections", colorClass: "bg-bloom-analyze" },
  { id: "evaluate", name: "Evaluate", description: "Justify decisions", colorClass: "bg-bloom-evaluate" },
  { id: "create", name: "Create", description: "Produce new work", colorClass: "bg-bloom-create" },
];

interface BloomsTaxonomyConfigProps {
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

const BloomsTaxonomyConfig = ({ values, onChange }: BloomsTaxonomyConfigProps) => {
  const total = Object.values(values).reduce((sum, v) => sum + v, 0);

  return (
    <div className="glass rounded-xl p-6 border border-border/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Bloom's Taxonomy Distribution</h3>
          <p className="text-sm text-muted-foreground">Configure cognitive level weights</p>
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

      <div className="space-y-5">
        {bloomLevels.map((level, index) => (
          <div
            key={level.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", level.colorClass)} />
                <span className="font-medium text-foreground">{level.name}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {level.description}
                </span>
              </div>
              <span className="text-sm font-mono text-primary">{values[level.id] || 0}%</span>
            </div>
            <Slider
              value={[values[level.id] || 0]}
              onValueChange={([v]) => onChange(level.id, v)}
              max={100}
              step={5}
              className="[&_[role=slider]]:border-2 [&_[role=slider]]:border-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloomsTaxonomyConfig;

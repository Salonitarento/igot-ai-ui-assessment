import { cn } from "@/lib/utils";
import { ClipboardCheck, GraduationCap, BookOpen, Check } from "lucide-react";

interface AssessmentTypeSelectorProps {
  selected: string;
  onSelect: (type: string) => void;
  currentStep?: string
}

const assessmentTypes = [
  {
    id: "standalone",
    name: "Standalone",
    icon: ClipboardCheck,
    description: "Standalone / Competency assessment",
  },
  {
    id: "practice",
    name: "Practice",
    icon: ClipboardCheck,
    description: "Basic Assessment",
  },
  {
    id: "final",
    name: "Final Assessment",
    icon: GraduationCap,
    description: "End of the course assessment",
  },
  {
    id: "comprehensive",
    name: "Comprehensive",
    icon: BookOpen,
    description: "Multi-course evaluation",
  },
];

const AssessmentTypeSelector = ({ selected, onSelect, currentStep }: AssessmentTypeSelectorProps) => {
  return (
    <div className="flex gap-3">
      {assessmentTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selected === type.id;

        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            disabled={currentStep == 'configuration' || currentStep == 'results'}
            className={cn(
              "relative flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all duration-200",
              isSelected
                ? "border-primary bg-primary/5 shadow-soft"
                : "border-border bg-card hover:border-primary/30 hover:shadow-soft"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-foreground">{type.name}</div>
              <div className="text-xs text-muted-foreground">{type.description}</div>
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AssessmentTypeSelector;
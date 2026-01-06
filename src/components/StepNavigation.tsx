import { cn } from "@/lib/utils";
import { FileText, Settings, CheckCircle, Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { id: "content", label: "Content", icon: FileText },
  { id: "configuration", label: "Configure", icon: Settings },
  { id: "results", label: "Results", icon: CheckCircle },
];

interface StepNavigationProps {
  currentStep: string;
  onStepChange: (step: string) => void;
  completedSteps: string[];
  courseIds: any;
  topics: any;
}

const StepNavigation = ({ currentStep, onStepChange, completedSteps,courseIds, topics}: StepNavigationProps) => {
  const canProceed = topics.length > 0 && courseIds.length > 0;
  const canNavigateTo = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (stepIndex < currentIndex) return true;
    if (completedSteps.includes(stepId)) return true;
    
    if (stepIndex > 0) {
      const prevStep = steps[stepIndex - 1];
      return completedSteps.includes(prevStep.id);
    }
    
    return stepIndex === 0;
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-6 p-1.5 bg-muted/50 rounded-xl">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.includes(step.id);
        const isClickable = canNavigateTo(step.id);

        return (
          <div key={step.id} className="flex items-center gap-2">
            <button
              onClick={() => isClickable && onStepChange(step.id)}
              disabled={!isClickable || !canProceed}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive && "bg-card text-primary shadow-soft",
                !isActive && isCompleted && "text-accent hover:bg-card/50",
                !isActive && !isCompleted && "text-muted-foreground",
                !isClickable && !canProceed && "opacity-50 cursor-not-allowed",
                isClickable && !isActive && "cursor-pointer hover:text-foreground"
              )}
            >
              {isCompleted && !isActive ? (
                <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center">
                  <Check className="w-3 h-3 text-accent" />
                </div>
              ) : (
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold",
                  isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
              )}
              <span>{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 h-0.5 rounded-full transition-colors",
                isCompleted ? "bg-accent/40" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepNavigation;
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const GenerateButton = ({ onClick, isGenerating, disabled }: GenerateButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={cn(
        "w-full py-6 text-lg font-semibold relative overflow-hidden",
        "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]",
        "hover:animate-shimmer transition-all duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "glow"
      )}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Generating Assessment...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Assessment
        </>
      )}
    </Button>
  );
};

export default GenerateButton;

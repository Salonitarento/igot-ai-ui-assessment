import { Hash } from "lucide-react";
import { Input } from "./ui/input";

interface QuestionCountInputProps {
  value: number;
  onChange: (value: number) => void;
}

const QuestionCountInput = ({ value, onChange }: QuestionCountInputProps) => {
  return (
    <div className="glass rounded-xl p-6 border border-border/30 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bloom-analyze to-bloom-evaluate flex items-center justify-center">
          <Hash className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Question Count</h3>
          <p className="text-sm text-muted-foreground">Total questions to generate</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Input
          type="number"
          min="1"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 1)}
          className="text-center text-2xl font-mono py-3 bg-secondary/50 border-border/30 focus:border-primary/50"
        />
        <span className="text-muted-foreground">questions</span>
      </div>
    </div>
  );
};

export default QuestionCountInput;

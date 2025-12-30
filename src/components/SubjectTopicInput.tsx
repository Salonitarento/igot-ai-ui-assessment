import { useState } from "react";
import { Plus, X, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface SubjectTopicInputProps {
  subject: string;
  topics: string[];
  onSubjectChange: (subject: string) => void;
  onTopicsChange: (topics: string[]) => void;
}

const SubjectTopicInput = ({ subject, topics, onSubjectChange, onTopicsChange }: SubjectTopicInputProps) => {
  const [newTopic, setNewTopic] = useState("");

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      onTopicsChange([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topic: string) => {
    onTopicsChange(topics.filter((t) => t !== topic));
  };

  return (
    <div className="glass rounded-xl p-6 border border-border/30 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Subject & Topics</h3>
          <p className="text-sm text-muted-foreground">Define the assessment scope</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
          <Input
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="e.g., Mathematics, Physics, Computer Science"
            className="bg-secondary/50 border-border/30 focus:border-primary/50"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Topics</label>
          <div className="flex gap-2 mb-3">
            <Input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTopic()}
              placeholder="Add a topic..."
              className="bg-secondary/50 border-border/30 focus:border-primary/50"
            />
            <Button
              onClick={addTopic}
              size="icon"
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <span
                key={topic}
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm",
                  "bg-secondary/70 border border-border/30 text-foreground",
                  "animate-slide-up"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {topic}
                <button
                  onClick={() => removeTopic(topic)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {topics.length === 0 && (
              <span className="text-sm text-muted-foreground italic">No topics added yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTopicInput;

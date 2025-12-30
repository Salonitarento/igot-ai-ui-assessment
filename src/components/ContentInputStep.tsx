import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { 
  Upload, 
  X, 
  Plus, 
  File,
  ChevronRight,
  Check,
  ChevronsUpDown,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ContentInputStepProps {
  assessmentType: string;
  courseIds: string[];
  topics: string[];
  notes: string;
  transcriptFiles: File[];
  materialFiles: File[];
  onCourseIdsChange: (ids: string[]) => void;
  onTopicsChange: (topics: string[]) => void;
  onNotesChange: (notes: string) => void;
  onTranscriptFilesChange: (files: File[]) => void;
  onMaterialFilesChange: (files: File[]) => void;
  onNext: () => void;
}

const availableCourseIds = [
  { value: "NA", label: "N/A - No Course ID" },
  { value: "CS101", label: "CS101 - Introduction to Computer Science" },
  { value: "CS201", label: "CS201 - Data Structures" },
  { value: "CS301", label: "CS301 - Algorithms" },
  { value: "CS401", label: "CS401 - Machine Learning" },
  { value: "MATH101", label: "MATH101 - Calculus I" },
  { value: "MATH201", label: "MATH201 - Linear Algebra" },
  { value: "PHY101", label: "PHY101 - Physics I" },
  { value: "ENG101", label: "ENG101 - English Composition" },
];

const ContentInputStep = ({
  assessmentType,
  courseIds,
  topics,
  notes,
  transcriptFiles,
  materialFiles,
  onCourseIdsChange,
  onTopicsChange,
  onNotesChange,
  onTranscriptFilesChange,
  onMaterialFilesChange,
  onNext,
}: ContentInputStepProps) => {
  const [newTopic, setNewTopic] = useState("");
  const [courseSearchOpen, setCourseSearchOpen] = useState(false);

  const isComprehensive = assessmentType === "comprehensive";

  const handleCourseSelect = (value: string) => {
    if (value === "NA") {
      onCourseIdsChange(["NA"]);
      setCourseSearchOpen(false);
      return;
    }

    if (!isComprehensive) {
      onCourseIdsChange([value]);
      setCourseSearchOpen(false);
    } else {
      const filtered = courseIds.filter(id => id !== "NA");
      if (filtered.includes(value)) {
        onCourseIdsChange(filtered.filter(id => id !== value));
      } else {
        onCourseIdsChange([...filtered, value]);
      }
    }
  };

  const removeCourseId = (id: string) => {
    onCourseIdsChange(courseIds.filter((c) => c !== id));
  };

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      onTopicsChange([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topic: string) => {
    onTopicsChange(topics.filter((t) => t !== topic));
  };

  const handleTranscriptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => 
      f.name.endsWith('.vtt') || f.name.endsWith('.txt')
    );
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid File Type",
        description: "Only VTT and TXT files are allowed.",
        variant: "destructive",
      });
    }

    const totalFiles = [...transcriptFiles, ...validFiles].slice(0, 10);
    onTranscriptFilesChange(totalFiles);
    e.target.value = "";
  };

  const handleMaterialUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => {
      if (!f.name.endsWith('.pdf')) return false;
      if (f.size > 25 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${f.name} exceeds 25MB limit.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    const totalFiles = [...materialFiles, ...validFiles].slice(0, 3);
    onMaterialFilesChange(totalFiles);
    e.target.value = "";
  };

  const removeTranscript = (index: number) => {
    onTranscriptFilesChange(transcriptFiles.filter((_, i) => i !== index));
  };

  const removeMaterial = (index: number) => {
    onMaterialFilesChange(materialFiles.filter((_, i) => i !== index));
  };

  const canProceed = topics.length > 0;

  const selectedCourseLabels = useMemo(() => {
    if (courseIds.length === 0) return "Select course...";
    if (courseIds.length === 1) {
      const course = availableCourseIds.find(c => c.value === courseIds[0]);
      return course?.label || courseIds[0];
    }
    return `${courseIds.length} courses selected`;
  }, [courseIds]);

  return (
    <div className="space-y-4 stagger-children">
      {/* Course DO ID */}
      <div className="card-elevated p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Course DO ID</h3>
          {isComprehensive && (
            <Badge variant="secondary" className="text-xs">Multi-select</Badge>
          )}
        </div>

        <Popover open={courseSearchOpen} onOpenChange={setCourseSearchOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={courseSearchOpen}
              className="w-full justify-between h-10 text-left font-normal"
            >
              <span className="truncate">{selectedCourseLabels}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-popover border shadow-lg" align="start">
            <Command>
              <CommandInput placeholder="Search courses..." className="h-10" />
              <CommandList>
                <CommandEmpty>No course found.</CommandEmpty>
                <CommandGroup>
                  {availableCourseIds.map((course) => (
                    <CommandItem
                      key={course.value}
                      value={course.label}
                      onSelect={() => handleCourseSelect(course.value)}
                      className="py-2.5 cursor-pointer"
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border mr-2 flex items-center justify-center",
                        courseIds.includes(course.value) 
                          ? "bg-primary border-primary" 
                          : "border-muted-foreground/30"
                      )}>
                        {courseIds.includes(course.value) && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                      {course.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {courseIds.length > 0 && courseIds[0] !== "NA" && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {courseIds.map((id) => (
              <Badge
                key={id}
                variant="secondary"
                className="text-xs px-2 py-1 flex items-center gap-1"
              >
                {id}
                <button onClick={() => removeCourseId(id)} className="hover:text-destructive ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Topics/Subjects */}
      <div className="card-elevated p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Topics / Subjects <span className="text-destructive">*</span>
        </h3>

        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Enter topic and press Enter..."
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTopic())}
            className="h-10"
          />
          <Button onClick={addTopic} size="icon" variant="secondary" className="h-10 w-10 shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="text-xs px-2 py-1 flex items-center gap-1 bg-accent/10 text-accent border-accent/20"
              >
                {topic}
                <button onClick={() => removeTopic(topic)} className="hover:text-destructive ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Additional Notes */}
      <div className="card-elevated p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Additional Notes <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </h3>
        <Textarea
          placeholder="Enter additional notes or description..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[70px] resize-none"
        />
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-2 gap-4">
        {/* Transcripts */}
        <div className="card-elevated p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">Transcripts</h3>
          <p className="text-xs text-muted-foreground mb-3">optional, VTT/TXT, max 10</p>

          <label className={cn(
            "flex flex-col items-center justify-center p-4 border border-dashed rounded-lg cursor-pointer transition-colors",
            "border-border hover:border-primary/40 hover:bg-primary/5"
          )}>
            <Upload className="w-5 h-5 text-muted-foreground mb-1.5" />
            <span className="text-xs text-muted-foreground">{transcriptFiles.length}/10 files</span>
            <input
              type="file"
              accept=".vtt,.txt"
              multiple
              onChange={handleTranscriptUpload}
              className="hidden"
            />
          </label>

          {transcriptFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {transcriptFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <File className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button onClick={() => removeTranscript(index)} className="text-muted-foreground hover:text-destructive shrink-0 p-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Materials */}
        <div className="card-elevated p-4">
          <h3 className="text-sm font-medium text-foreground mb-1">Materials</h3>
          <p className="text-xs text-muted-foreground mb-3">optional, PDF, max 3×25MB</p>

          <label className={cn(
            "flex flex-col items-center justify-center p-4 border border-dashed rounded-lg cursor-pointer transition-colors",
            "border-border hover:border-primary/40 hover:bg-primary/5"
          )}>
            <Upload className="w-5 h-5 text-muted-foreground mb-1.5" />
            <span className="text-xs text-muted-foreground">{materialFiles.length}/3 files</span>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleMaterialUpload}
              className="hidden"
            />
          </label>

          {materialFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {materialFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button onClick={() => removeMaterial(index)} className="text-muted-foreground hover:text-destructive shrink-0 p-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save & Next Button */}
      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full h-11"
      >
        Save & Continue
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default ContentInputStep;
import { useState, useMemo, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
interface ContentInputStepProps {
  assessmentType: string;
  courseIds: string[];
  topics: string[];
  notes: string;
  transcriptFiles: File[];
  materialFiles: File[];
  language: string;
  setLanguage: (language: string) => void;
  onCourseIdsChange: (ids: string[]) => void;
  onTopicsChange: (topics: string[]) => void;
  onNotesChange: (notes: string) => void;
  onTranscriptFilesChange: (files: File[]) => void;
  onMaterialFilesChange: (files: File[]) => void;
  onNext: () => void;
}
interface CourseOption {
  value: string; // identifier
  label: string; // name
}


const ContentInputStep = ({
  assessmentType,
  courseIds,
  topics,
  notes,
  transcriptFiles,
  materialFiles,
  language,
  setLanguage,
  onCourseIdsChange,
  onTopicsChange,
  onNotesChange,
  onTranscriptFilesChange,
  onMaterialFilesChange,
  onNext,
}: ContentInputStepProps) => {
  const [newTopic, setNewTopic] = useState("");
  const [courseSearchOpen, setCourseSearchOpen] = useState(false);
  const PAGE_LIMIT = 100;

  const [availableCourseIds, setAvailableCourseIds] = useState<CourseOption[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);
  const [courseOffset, setCourseOffset] = useState(0);
  const [hasMoreCourses, setHasMoreCourses] = useState(true);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { user } = useAuth();
  const isComprehensive = assessmentType === "comprehensive";
  const LANGUAGES = [
    { value: "Marathi", label: "Marathi" },
    { value: "Bengali", label: "Bengali" },
    { value: "Hindi", label: "Hindi" },
    { value: "Malayalam", label: "Malayalam" },
    { value: "Kannada", label: "Kannada" },
    { value: "Tamil", label: "Tamil" },
    { value: "English", label: "English" },
    { value: "Telugu", label: "Telugu" },
    { value: "Punjabi", label: "Punjabi" },
    { value: "Gujarati", label: "Gujarati" },
  ];
  const handleCourseSelect = (value: string) => {
    // if (value === "NA") {
    //   onCourseIdsChange(["NA"]);
    //   setCourseSearchOpen(false);
    //   return;
    // }

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

  const canProceed = assessmentType == 'standalone' ? topics.length > 0 && materialFiles?.length > 0 : topics.length > 0 && courseIds.length > 0;

const selectedCourseLabels = useMemo(() => {
  if (courseIds.length === 0) return "Select course...";
  if (courseIds.length === 1) {
    const course = availableCourseIds.find(c => c.value === courseIds[0]);
    return course?.label || courseIds[0];
  }
  return `${courseIds.length} courses selected`;
}, [courseIds, availableCourseIds]); // ✅ FIX

  // useEffect(() => {
  //   if (!user?.access_token) return;

  const fetchCourses = async (reset = false) => {
    if (!user?.access_token || isCoursesLoading || (!hasMoreCourses && !reset)) return;

    try {
      setIsCoursesLoading(true);

      const response = await fetch(
        "https://portal.igotkarmayogi.gov.in/api/content/v1/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({
            request: {
              filters: {
                primaryCategory: ["Course"],
                status: ["Live"],
                courseCategory: ["Course"],
              },
              fields: ["name"],
              sort_by: { createdOn: "desc" },
              limit: PAGE_LIMIT,
              offset: reset ? 0 : courseOffset,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      const newCourses: CourseOption[] =
        data?.result?.content?.map((item: any) => ({
          value: item.identifier,
          label: item.name,
        })) ?? [];
      setAvailableCourseIds((prev) =>
  reset ? newCourses : [...prev, ...newCourses]
);

      setCourseOffset((prev) => (reset ? PAGE_LIMIT : prev + PAGE_LIMIT));
      setHasMoreCourses(newCourses.length === PAGE_LIMIT);
    } catch (error) {
      console.error("Course fetch error:", error);
      toast({
        title: "Error",
        description: "Unable to load more courses",
        variant: "destructive",
      });
    } finally {
      setIsCoursesLoading(false);
    }
  };

const fetchCoursesByIds = async (ids: string[]) => {
  if (!user?.access_token || ids.length === 0) return;

  try {
    const response = await fetch(
      "https://portal.igotkarmayogi.gov.in/api/content/v1/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          request: {
            filters: {
              identifier: ids,
            },
            fields: ["name"],
            limit: ids.length,
          },
        }),
      }
    );

    if (!response.ok) return;

    const data = await response.json();

    const courses: CourseOption[] =
      data?.result?.content?.map((item: any) => ({
        value: item.identifier,
        label: item.name,
      })) ?? [];

    setAvailableCourseIds((prev) => {
      const map = new Map(prev.map(c => [c.value, c.label]));
      courses.forEach(c => map.set(c.value, c.label));

      // keep NA on top
      const merged = Array.from(map, ([value, label]) => ({ value, label }));
      return merged;
    });
  } catch (e) {
    console.error("Failed to hydrate selected courses", e);
  }
};
useEffect(() => {
  if (courseIds.length > 0 && courseIds[0] !== "NA") {
    fetchCoursesByIds(courseIds);
  }
}, [courseIds, user?.access_token]);
  // fetchCourses();
  // }, [user?.access_token]);

  useEffect(() => {
    if (courseSearchOpen) {
      setCourseOffset(0);
      setHasMoreCourses(true);
      fetchCourses(true);
    }
  }, [courseSearchOpen]);

  return (
    <div className="space-y-4 stagger-children">
      {/* Course DO ID */}
      {
        assessmentType != 'standalone' &&
        <div className="card-elevated p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Course DO ID <span className="text-destructive">*</span></h3>
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
                disabled={isCoursesLoading}
              >
                <span className="truncate">
                  {isCoursesLoading ? "Loading courses..." : selectedCourseLabels}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>

            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-popover border shadow-lg" align="start">
              <Command>
                <CommandInput placeholder="Search courses..." className="h-10" />
                <CommandList onScroll={(e) => {
                  const target = e.currentTarget;
                  if (
                    target.scrollTop + target.clientHeight >= target.scrollHeight - 20
                  ) {
                    fetchCourses();
                  }
                }}>
                  <CommandEmpty>No course found.</CommandEmpty>
                  <CommandGroup>
                    {isCoursesLoading && (
                      <div className="py-2 text-center text-xs text-muted-foreground">
                        Loading more courses...
                      </div>
                    )}

                    {!hasMoreCourses && (
                      <div className="py-2 text-center text-xs text-muted-foreground">
                        No more courses
                      </div>
                    )}
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
              {courseIds.map((id) => {
                const course = availableCourseIds.find(c => c.value === id);

                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="text-xs px-2 py-1 flex items-center gap-1"
                  >
                    {course?.label ?? id}
                    <button
                      onClick={() => removeCourseId(id)}
                      className="hover:text-destructive ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}

            </div>
          )}
        </div>
}
      {/* Topics/Subjects */}
      <div className="card-elevated p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Topics / Subjects / Competencies <span className="text-destructive">*</span>
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
      <div className="card-elevated p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Language <span className="text-destructive">*</span>
        </h3>

        <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between h-10 font-normal"
            >
              {language
                ? LANGUAGES.find(l => l.value === language)?.label
                : "Select language..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandList>
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {LANGUAGES.map(lang => (
                    <CommandItem
                      key={lang.value}
                      value={lang.label}
                      onSelect={() => {
                        setLanguage(lang.value);
                        setLanguageOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          language === lang.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {lang.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
          <h3 className="text-sm font-medium text-foreground mb-1">Materials {assessmentType == 'standalone' && <span className="text-destructive">*</span> }</h3>
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
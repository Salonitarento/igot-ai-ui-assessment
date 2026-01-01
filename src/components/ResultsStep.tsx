import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { 
  Download, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  FileJson,
  FileType,
  File,
  Lightbulb,
  Target,
  HelpCircle,
  Pencil,
  Save,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface QuestionOption {
  label: string;
  text: string;
}

interface Question {
  id: number;
  type: string;
  bloomLevel: string;
  bloomPercent: number;
  question: string;
  options: QuestionOption[];
  correctAnswer: string;
  rationale: string;
}

interface ResultsStepProps {
  isGenerated: boolean;
  totalQuestions: number;
  assessmentLevel: string;
  timeLimit: number;
  topics: string[];
  onStartOver: () => void;
  courseIds?:  string[];
  specificCourseId?: string;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

// Sample generated questions data
const sampleQuestions = [
  {
    id: 1,
    type: "MCQ",
    bloomLevel: "Remember",
    bloomPercent: 10,
    question: "What is the primary function of a database index?",
    options: [
      { label: "A", text: "To store backup copies of data" },
      { label: "B", text: "To speed up data retrieval operations" },
      { label: "C", text: "To encrypt sensitive information" },
      { label: "D", text: "To compress data storage" },
    ],
    correctAnswer: "B",
    rationale: "Database indexes create a data structure that allows the database engine to find rows faster without scanning the entire table. This is fundamental to database performance optimization."
  },
  {
    id: 2,
    type: "MCQ",
    bloomLevel: "Understand",
    bloomPercent: 20,
    question: "Which statement best explains the concept of normalization in databases?",
    options: [
      { label: "A", text: "Combining multiple tables into one for faster access" },
      { label: "B", text: "Organizing data to reduce redundancy and improve integrity" },
      { label: "C", text: "Converting data types to a standard format" },
      { label: "D", text: "Encrypting data for security purposes" },
    ],
    correctAnswer: "B",
    rationale: "Normalization is a systematic approach to decomposing tables to eliminate data redundancy and undesirable characteristics like insertion, update, and deletion anomalies."
  },
  {
    id: 3,
    type: "MCQ",
    bloomLevel: "Apply",
    bloomPercent: 25,
    question: "Given a users table with columns (id, name, email), which SQL query correctly retrieves all users with email ending in '@company.com'?",
    options: [
      { label: "A", text: "SELECT * FROM users WHERE email = '@company.com'" },
      { label: "B", text: "SELECT * FROM users WHERE email LIKE '%@company.com'" },
      { label: "C", text: "SELECT * FROM users WHERE email CONTAINS '@company.com'" },
      { label: "D", text: "SELECT * FROM users WHERE email ENDS '@company.com'" },
    ],
    correctAnswer: "B",
    rationale: "The LIKE operator with '%' wildcard matches any sequence of characters. '%@company.com' matches any email ending with '@company.com'."
  },
  {
    id: 4,
    type: "True/False",
    bloomLevel: "Analyze",
    bloomPercent: 20,
    question: "A composite primary key consisting of two foreign keys is always required when implementing a many-to-many relationship between two tables.",
    options: [
      { label: "T", text: "True" },
      { label: "F", text: "False" },
    ],
    correctAnswer: "F",
    rationale: "While a junction table is needed for many-to-many relationships, using a composite primary key is a design choice. An auto-incrementing surrogate key can also be used as the primary key."
  },
  {
    id: 5,
    type: "MCQ",
    bloomLevel: "Evaluate",
    bloomPercent: 15,
    question: "Which database design approach would be most appropriate for a real-time analytics dashboard requiring sub-second query response times on billions of records?",
    options: [
      { label: "A", text: "Fully normalized relational database (3NF)" },
      { label: "B", text: "Columnar database with denormalized schema" },
      { label: "C", text: "Document-based NoSQL database" },
      { label: "D", text: "Graph database" },
    ],
    correctAnswer: "B",
    rationale: "Columnar databases excel at analytical queries on large datasets because they read only relevant columns, enable better compression, and are optimized for aggregation operations."
  }
];

const bloomColors: Record<string, { bg: string; text: string; border: string; light: string }> = {
  "Remember": { bg: "bg-sky-500", text: "text-sky-700", border: "border-sky-200", light: "bg-sky-50" },
  "Understand": { bg: "bg-teal-500", text: "text-teal-700", border: "border-teal-200", light: "bg-teal-50" },
  "Apply": { bg: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-200", light: "bg-emerald-50" },
  "Analyze": { bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-200", light: "bg-amber-50" },
  "Evaluate": { bg: "bg-orange-500", text: "text-orange-700", border: "border-orange-200", light: "bg-orange-50" },
  "Create": { bg: "bg-rose-500", text: "text-rose-700", border: "border-rose-200", light: "bg-rose-50" },
};

const exportFormats = [
  { id: "pdf", name: "PDF", icon: FileText, description: "Print-ready document" },
  { id: "word", name: "Word", icon: FileType, description: "Editable .docx file" },
  { id: "json", name: "JSON", icon: FileJson, description: "Raw data format" },
];

const ResultsStep = ({
  isGenerated,
  totalQuestions,
  assessmentLevel,
  timeLimit,
  topics,
  onStartOver,
  courseIds,
  specificCourseId,
    questions ,
    setQuestions
}: ResultsStepProps) => {
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);

  const toggleQuestion = (id: number) => {
    setExpandedQuestions(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const startEditing = (question: Question) => {
    setEditingQuestionId(question.id);
    setEditForm({ ...question, options: question.options.map(o => ({ ...o })) });
    if (!expandedQuestions.includes(question.id)) {
      setExpandedQuestions(prev => [...prev, question.id]);
    }
  };

  const cancelEditing = () => {
    setEditingQuestionId(null);
    setEditForm(null);
  };

  const saveEditing = () => {
    if (!editForm) return;
    setQuestions(prev => prev.map(q => q.id === editForm.id ? editForm : q));
    setEditingQuestionId(null);
    setEditForm(null);
    toast({
      title: "Question updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const updateEditForm = (field: keyof Question, value: string) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
  };

  const updateOptionText = (index: number, text: string) => {
    if (!editForm) return;
    const newOptions = [...editForm.options];
    newOptions[index] = { ...newOptions[index], text };
    setEditForm({ ...editForm, options: newOptions });
  };

  // const handleExport = () => {
  //   const format = exportFormats.find(f => f.id === selectedFormat);
  //   console.log(format,'format')
  //   toast({
  //     title: `Exporting as ${format?.name}`,
  //     description: `Your assessment will be downloaded as a ${format?.name} file.`,
  //   });
  // };
const handleExport = async () => {
  try {
    // const assessmentId = "do_11447034411220992011179";

    let url = "";
    let fileName = "";
    let mimeType = "";

    if (selectedFormat === "json") {
      url = `https://portal.dev.karmayogibharat.net/ai-assment-generation/api/v1/download_json/${specificCourseId || courseIds}`;
      fileName = "assessment.json";
      mimeType = "application/json";
    }

    if (selectedFormat === "pdf") {
      // example – update when PDF API is ready
      url = `https://portal.dev.karmayogibharat.net/ai-assment-generation/api/v1/download_pdf/${specificCourseId || courseIds}`;
      fileName = "assessment.pdf";
      mimeType = "application/pdf";
    }

    if (!url) return;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: mimeType,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await response.blob();

    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    toast({
      title: "Download started",
      description: `Your ${selectedFormat.toUpperCase()} file is downloading.`,
    });
  } catch (error) {
    console.error(error);
    toast({
      title: "Download failed",
      description: "Unable to download the file. Please try again.",
      variant: "destructive",
    });
  }
};

  if (!isGenerated) {
    return (
      <div className="card-elevated rounded-xl p-8 text-center">
        <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
          Complete the configuration to generate your assessment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 stagger-children">
      {/* Success Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 border border-accent/20 rounded-xl p-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg">
            <CheckCircle className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">Assessment Generated Successfully</h3>
            <p className="text-sm text-muted-foreground">Your {totalQuestions}-question assessment is ready for review and export.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: FileText, value: totalQuestions, label: "Questions", color: "text-primary" },
          { icon: BarChart3, value: assessmentLevel, label: "Level", color: "text-accent" },
          { icon: Clock, value: `${timeLimit}m`, label: "Duration", color: "text-soft-amber" },
          { icon: Target, value: topics.length, label: "Topics", color: "text-soft-rose" },
        ].map((stat, index) => (
          <div key={index} className="card-elevated p-4 text-center hover-lift">
            <stat.icon className={cn("w-5 h-5 mx-auto mb-2", stat.color)} />
            <div className="text-xl font-semibold text-foreground capitalize">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Topics */}
      <div className="card-elevated p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Topics Covered</h4>
        <div className="flex flex-wrap gap-1.5">
          {topics.map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {/* Questions Preview */}
      <div className="card-elevated overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-foreground">Assessment Preview</h4>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setExpandedQuestions(questions.map(q => q.id))}
                className="text-xs text-primary hover:underline"
              >
                Expand All
              </button>
              <span className="text-muted-foreground">|</span>
              <button 
                onClick={() => setExpandedQuestions([])}
                className="text-xs text-primary hover:underline"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {questions?.map((q) => {
            const colors = bloomColors[q.bloomLevel] ?? bloomColors["Remember"];
            const isExpanded = expandedQuestions.includes(q.id);
            const isEditing = editingQuestionId === q.id;
            const currentData = isEditing && editForm ? editForm : q;
            
            return (
              <div key={q.id} className="group">
                {/* Question Header */}
                <div
                  className={cn(
                    "w-full flex items-start gap-4 p-4 text-left transition-colors",
                    isExpanded ? colors.light : "hover:bg-muted/30"
                  )}
                >
                  <button
                    onClick={() => toggleQuestion(q.id)}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0",
                      colors?.bg
                    )}
                  >
                    {q.id}
                  </button>
                  <div className="flex-1 min-w-0" onClick={() => !isEditing && toggleQuestion(q.id)}>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-normal">{q.type}</Badge>
                      <Badge className={cn("text-xs", colors.light, colors.text, colors.border, "border")}>
                        {q.bloomLevel} • {q.bloomPercent}%
                      </Badge>
                    </div>
                    {isEditing ? (
                      <Textarea
                        value={editForm?.question || ""}
                        onChange={(e) => updateEditForm("question", e.target.value)}
                        className="text-sm bg-white border-primary/30 focus:border-primary min-h-[60px]"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <p className={cn(
                        "text-sm text-foreground cursor-pointer",
                        !isExpanded && "line-clamp-1"
                      )}>{q.question}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveEditing}
                          className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(q);
                        }}
                        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleQuestion(q.id)}
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        isExpanded ? colors?.bg + " text-white" : "bg-muted"
                      )}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className={cn("px-4 pb-4 pt-0", colors.light)}>
                    <div className="ml-12 space-y-4">
                      {/* Options */}
                      <div className="grid grid-cols-2 gap-2">
                        {currentData.options.map((option, optIndex) => {
                          const isCorrect = option.label === currentData.correctAnswer;
                          return (
                            <div
                              key={option.label}
                              className={cn(
                                "relative flex items-start gap-3 p-3 rounded-lg border transition-all",
                                isCorrect 
                                  ? "bg-accent/10 border-accent/30 shadow-sm" 
                                  : "bg-white/80 border-border"
                              )}
                            >
                              {isEditing ? (
                                <button
                                  onClick={() => updateEditForm("correctAnswer", option.label)}
                                  className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors cursor-pointer",
                                    isCorrect ? "bg-accent text-white" : "bg-muted text-muted-foreground hover:bg-accent/50 hover:text-white"
                                  )}
                                  title="Click to set as correct answer"
                                >
                                  {option.label}
                                </button>
                              ) : (
                                <div className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                  isCorrect ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                                )}>
                                  {option.label}
                                </div>
                              )}
                              {isEditing ? (
                                <Input
                                  value={option.text}
                                  onChange={(e) => updateOptionText(optIndex, e.target.value)}
                                  className="text-sm flex-1 h-8 bg-white"
                                />
                              ) : (
                                <span className={cn(
                                  "text-sm flex-1",
                                  isCorrect ? "text-foreground font-medium" : "text-muted-foreground"
                                )}>
                                  {option.text}
                                </span>
                              )}
                              {isCorrect && !isEditing && (
                                <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Rationale */}
                      <div className="bg-white/80 rounded-lg p-4 border border-border">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Rationale</div>
                            {isEditing ? (
                              <Textarea
                                value={editForm?.rationale || ""}
                                onChange={(e) => updateEditForm("rationale", e.target.value)}
                                className="text-sm bg-white border-primary/30 focus:border-primary min-h-[80px]"
                              />
                            ) : (
                              <p className="text-sm text-foreground">{q.rationale}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-muted/30 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Showing {questions.length} questions • Hover over a question and click the pencil icon to edit
          </p>
        </div>
      </div>

      {/* AI Disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        </div>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          These are AI generated results, please verify the same.
        </p>
      </div>

      {/* Export Options */}
      <div className="card-elevated p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Export Format</h4>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {exportFormats.map((format) => {
            const Icon = format.icon;
            const isSelected = selectedFormat === format.id;
            return (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className={cn(
                    "font-medium text-sm",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>{format.name}</div>
                  <div className="text-xs text-muted-foreground">{format.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onStartOver} className="flex-1 h-11">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Create New
          </Button>
          <Button onClick={handleExport} className="flex-1 h-11">
            <Download className="w-4 h-4 mr-1.5" />
            Download {exportFormats.find(f => f.id === selectedFormat)?.name}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsStep;
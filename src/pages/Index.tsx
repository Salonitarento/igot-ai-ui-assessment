import { useState } from "react";
import Header from "@/components/Header";
import AssessmentTypeSelector from "@/components/AssessmentTypeSelector";
import StepNavigation from "@/components/StepNavigation";
import ContentInputStep from "@/components/ContentInputStep";
import ConfigurationStep, { QuestionTypeConfig } from "@/components/ConfigurationStep";
import ResultsStep from "@/components/ResultsStep";
import { toast } from "@/hooks/use-toast";
import { ListChecks, ToggleLeft, MessageSquare, FileText } from "lucide-react";

const defaultQuestionTypes = [
  { id: "mcq", name: "Multiple Choice", icon: ListChecks, enabled: true, count: 10 },
  { id: "truefalse", name: "True/False", icon: ToggleLeft, enabled: true, count: 5 },
  { id: "shortanswer", name: "Short Answer", icon: MessageSquare, enabled: false, count: 0 },
  { id: "essay", name: "Essay", icon: FileText, enabled: false, count: 0 },
];

const Index = () => {
  const [assessmentType, setAssessmentType] = useState("practice");
  const [currentStep, setCurrentStep] = useState("content");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [transcriptFiles, setTranscriptFiles] = useState<File[]>([]);
  const [materialFiles, setMaterialFiles] = useState<File[]>([]);
  
  const [questionTypes, setQuestionTypes] = useState(defaultQuestionTypes);
  const [assessmentLevel, setAssessmentLevel] = useState("intermediate");
  const [bloomValues, setBloomValues] = useState<Record<string, number>>({
    remember: 10,
    understand: 20,
    apply: 25,
    analyze: 20,
    evaluate: 15,
    create: 10,
  });
  const [timeLimit, setTimeLimit] = useState(30);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleBloomChange = (id: string, value: number) => {
    setBloomValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleContentNext = () => {
    if (topics.length === 0) {
      toast({
        title: "Topics Required",
        description: "Please add at least one topic.",
        variant: "destructive",
      });
      return;
    }
    
    setCompletedSteps((prev) => [...new Set([...prev, "content"])]);
    setCurrentStep("configuration");
  };

  const handleGenerate = async () => {
    const bloomTotal = Object.values(bloomValues).reduce((sum, v) => sum + v, 0);
    const totalQuestions = questionTypes
      .filter((qt) => qt.enabled)
      .reduce((sum, qt) => sum + qt.count, 0);

    if (bloomTotal !== 100) {
      toast({
        title: "Invalid Bloom's Distribution",
        description: `Total must equal 100%. Currently: ${bloomTotal}%`,
        variant: "destructive",
      });
      return;
    }

    if (totalQuestions === 0) {
      toast({
        title: "No Questions Configured",
        description: "Please add at least one question type.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsGenerated(true);
    setCompletedSteps((prev) => [...new Set([...prev, "configuration"])]);
    setCurrentStep("results");
    
    toast({
      title: "Assessment Generated!",
      description: `${totalQuestions} questions created.`,
    });
    
    setIsGenerating(false);
  };

  const handleStartOver = () => {
    setCurrentStep("content");
    setCompletedSteps([]);
    setCourseIds([]);
    setTopics([]);
    setNotes("");
    setTranscriptFiles([]);
    setMaterialFiles([]);
    setQuestionTypes(defaultQuestionTypes);
    setAssessmentLevel("intermediate");
    setBloomValues({
      remember: 10,
      understand: 20,
      apply: 25,
      analyze: 20,
      evaluate: 15,
      create: 10,
    });
    setTimeLimit(30);
    setIsGenerated(false);
  };

  const totalQuestions = questionTypes
    .filter((qt) => qt.enabled)
    .reduce((sum, qt) => sum + qt.count, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Title */}
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-foreground">iGOT AI Assessment Generator</h1>
          <p className="text-sm text-muted-foreground">Create curriculum-aligned assessments with iGOT AI</p>
        </div>

        {/* Assessment Type Selector */}
        <div className="mb-5">
          <AssessmentTypeSelector
            selected={assessmentType}
            onSelect={(type) => {
              setAssessmentType(type);
              setCourseIds([]);
            }}
          />
        </div>

        {/* Step Navigation */}
        <StepNavigation
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          completedSteps={completedSteps}
        />

        {/* Step Content */}
        {currentStep === "content" && (
          <ContentInputStep
            assessmentType={assessmentType}
            courseIds={courseIds}
            topics={topics}
            notes={notes}
            transcriptFiles={transcriptFiles}
            materialFiles={materialFiles}
            onCourseIdsChange={setCourseIds}
            onTopicsChange={setTopics}
            onNotesChange={setNotes}
            onTranscriptFilesChange={setTranscriptFiles}
            onMaterialFilesChange={setMaterialFiles}
            onNext={handleContentNext}
          />
        )}

        {currentStep === "configuration" && (
          <ConfigurationStep
            questionTypes={questionTypes}
            assessmentLevel={assessmentLevel}
            bloomValues={bloomValues}
            timeLimit={timeLimit}
            onQuestionTypesChange={setQuestionTypes}
            onAssessmentLevelChange={setAssessmentLevel}
            onBloomChange={handleBloomChange}
            onTimeLimitChange={setTimeLimit}
            onBack={() => setCurrentStep("content")}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        )}

        {currentStep === "results" && (
          <ResultsStep
            isGenerated={isGenerated}
            totalQuestions={totalQuestions}
            assessmentLevel={assessmentLevel}
            timeLimit={timeLimit}
            topics={topics}
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
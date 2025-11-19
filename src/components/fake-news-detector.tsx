import { useState } from "react";
import { FakeNewsLanding } from "./fake-news-landing";
import { FakeNewsResult } from "./fake-news-result";
import { FakeNewsMiniLessons } from "./fake-news-mini-lessons";
import { FakeNewsQuiz } from "./fake-news-quiz";
import { FakeNewsExamples } from "./fake-news-examples";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { EducationalBackground } from "./educational-background";

interface FakeNewsDetectorProps {
  onBack: () => void;
}

export type AnalysisResult = {
  score: number;
  title: string;
  domain?: string;
  date?: string;
  reasons: {
    text: string;
    confidence: number;
    icon: string;
  }[];
  sources: {
    url: string;
    name: string;
    matched: boolean;
  }[];
  evidence: string[];
  suggestions: string[];
};

export function FakeNewsDetector({ onBack }: FakeNewsDetectorProps) {
  const [currentView, setCurrentView] = useState<"landing" | "result" | "lessons" | "quiz" | "examples">("landing");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setCurrentView("result");
  };

  const handleViewLessons = () => {
    setCurrentView("lessons");
  };

  const handleViewQuiz = () => {
    setCurrentView("quiz");
  };

  const handleViewExamples = () => {
    setCurrentView("examples");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  const handleBackToResult = () => {
    setCurrentView("result");
  };

  return (
    <div className="min-h-screen relative">
      <EducationalBackground variant="secondary" />
      
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-red-500 to-red-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold">PHÂN BIỆT TIN TỨC THẬT GIẢ BẰNG AI</h1>
            <p className="text-sm text-red-100">Kiểm tra tin tức, bài viết với AI</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {currentView === "landing" && (
          <FakeNewsLanding
            onAnalysisComplete={handleAnalysisComplete}
            onViewExamples={handleViewExamples}
            onViewLessons={handleViewLessons}
          />
        )}
        {currentView === "result" && analysisResult && (
          <FakeNewsResult
            result={analysisResult}
            onViewLessons={handleViewLessons}
            onBack={handleBackToLanding}
          />
        )}
        {currentView === "lessons" && (
          <FakeNewsMiniLessons
            onBack={currentView === "result" ? handleBackToResult : handleBackToLanding}
            onStartQuiz={handleViewQuiz}
          />
        )}
        {currentView === "quiz" && (
          <FakeNewsQuiz
            onBack={handleViewLessons}
            onComplete={handleBackToLanding}
          />
        )}
        {currentView === "examples" && (
          <FakeNewsExamples
            onBack={handleBackToLanding}
            onAnalyzeExample={handleAnalysisComplete}
          />
        )}
      </div>
    </div>
  );
}

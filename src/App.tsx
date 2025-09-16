import { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/welcome-screen";
import { NameInput } from "./components/name-input";
import { Dashboard } from "./components/dashboard";
import { HomeworkSolver } from "./components/homework-solver";
import { ChatSupport } from "./components/chat-support";
import { Flashcards } from "./components/flashcards";
import { PomodoroTimer } from "./components/pomodoro-timer";
import { Tasks } from "./components/tasks";
import { Alarm } from "./components/alarm";
import { Schedule } from "./components/schedule";
import { Uniform } from "./components/uniform";
import { StudyAssistant } from "./components/study-assistant";
import { Health } from "./components/health";
import { Storage } from "./components/storage";
import { Notes } from "./components/notes";
import { ProgressTracker } from "./components/progress-tracker";
import { Dictionary } from "./components/dictionary";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

export default function App() {
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [currentFeature, setCurrentFeature] = useState<string>("dashboard");

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (!savedName) {
      setShowNameInput(true);
      setShowWelcome(false);
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    setShowNameInput(false);
    setShowWelcome(true);
    toast.success("Chào mừng bạn đến với T-Learn!", {
      description: `Xin chào ${name}! Hãy bắt đầu hành trình học tập của bạn.`,
      duration: 3000,
    });
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    toast.success("Chào mừng bạn đến với T-Learn!", {
      description: "Hãy khám phá các tính năng AI học tập thông minh!",
      duration: 3000,
    });
  };

  const handleFeatureSelect = (feature: string) => {
    setCurrentFeature(feature);
  };

  const handleBack = () => {
    setCurrentFeature("dashboard");
  };

  const renderCurrentFeature = () => {
    switch (currentFeature) {
      case "homework-solver":
        return <HomeworkSolver onBack={handleBack} />;
      case "chat-support":
        return <ChatSupport onBack={handleBack} />;
      case "flashcards":
        return <Flashcards onBack={handleBack} />;
      case "pomodoro":
        return <PomodoroTimer onBack={handleBack} />;
      case "tasks":
        return <Tasks onBack={handleBack} />;
      case "alarm":
        return <Alarm onBack={handleBack} />;
      case "schedule":
        return <Schedule onBack={handleBack} />;
      case "uniform":
        return <Uniform onBack={handleBack} />;
      case "study-assistant":
        return <StudyAssistant onBack={handleBack} />;
      case "health":
        return <Health onBack={handleBack} />;
      case "storage":
        return <Storage onBack={handleBack} />;
      case "notes":
        return <Notes onBack={handleBack} />;
      case "progress-tracker":
        return <ProgressTracker onBack={handleBack} />;
      case "dictionary":
        return <Dictionary onBack={handleBack} />;
      default:
        return <Dashboard onFeatureSelect={handleFeatureSelect} />;
    }
  };

  return (
    <div className="min-h-screen">
      {showNameInput && <NameInput onNameSubmit={handleNameSubmit} />}
      {showWelcome && <WelcomeScreen onGetStarted={handleGetStarted} />}
      {!showNameInput && !showWelcome && renderCurrentFeature()}
      <Toaster 
        position="top-center"
        richColors
        closeButton
        expand={true}
      />
    </div>
  );
}
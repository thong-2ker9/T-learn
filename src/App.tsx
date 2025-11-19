import { useState, useEffect } from "react";
import { Login } from "./components/login";
import { Register } from "./components/register";
import { RoleSelection } from "./components/role-selection";
import { NameInput } from "./components/name-input";
import { WelcomeScreen } from "./components/welcome-screen";
import { Dashboard } from "./components/dashboard";
import { HomeworkSolver } from "./components/homework-solver";
import { ChatSupport } from "./components/chat-support";
import { StudyAssistant } from "./components/study-assistant";
import { PomodoroTimer } from "./components/pomodoro-timer";
import { Flashcards } from "./components/flashcards";
import { Tasks } from "./components/tasks";
import { Alarm } from "./components/alarm";
import { Schedule } from "./components/schedule";
import { Uniform } from "./components/uniform";
import { Health } from "./components/health";
import { Storage } from "./components/storage";
import { Notes } from "./components/notes";
import { ProgressTracker } from "./components/progress-tracker";
import { Dictionary } from "./components/dictionary";
import { SlangDictionary } from "./components/slang-dictionary";
import { MyClassroom } from "./components/my-classroom";
import { FakeNewsDetector } from "./components/fake-news-detector";
import { CareerAI } from "./components/career-ai";
import { TeacherDashboard } from "./components/teacher-dashboard";
import { TeacherInfoInput } from "./components/teacher-info-input";
import { SocketProvider } from "./components/socket-context";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

export default function App() {
  const [authState, setAuthState] = useState<"login" | "register" | "role-selection" | "name-input" | "teacher-info" | "welcome" | "app" | "teacher-app">("login");
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [currentFeature, setCurrentFeature] = useState<string>("dashboard");
  const [healthTab, setHealthTab] = useState<string>("water");
  const [userRole, setUserRole] = useState<"student" | "teacher" | null>(null);
  const [teacherInfo, setTeacherInfo] = useState({ name: "", subject: "" });

  useEffect(() => {
    // Check if user is logged in
    const authData = JSON.parse(localStorage.getItem('studyai_auth') || '{}');
    const savedName = localStorage.getItem('userName');
    const savedTeacherInfo = JSON.parse(localStorage.getItem('teacherInfo') || '{}');
    
    if (authData.isLoggedIn) {
      // User is logged in
      if (!authData.role) {
        // Need to select role
        setAuthState("role-selection");
      } else {
        setUserRole(authData.role);
        
        if (authData.role === "teacher") {
          // Teacher flow
          if (!savedTeacherInfo.name || !savedTeacherInfo.subject) {
            setAuthState("teacher-info");
          } else {
            setTeacherInfo(savedTeacherInfo);
            setAuthState("teacher-app");
          }
        } else {
          // Student flow
          if (!savedName) {
            setAuthState("name-input");
            setShowNameInput(true);
          } else {
            setAuthState("welcome");
            setShowWelcome(true);
          }
        }
      }
    } else {
      // Not logged in, show login
      setAuthState("login");
    }
  }, []);

  const handleLoginSuccess = (isFirstTime: boolean) => {
    if (isFirstTime) {
      setAuthState("role-selection");
    } else {
      const savedName = localStorage.getItem('userName');
      if (!savedName) {
        setAuthState("name-input");
        setShowNameInput(true);
      } else {
        setAuthState("welcome");
        setShowWelcome(true);
      }
    }
  };

  const handleRegisterSuccess = () => {
    // After registration, go to role selection
    setAuthState("role-selection");
  };

  const handleRoleSelected = (role: "student" | "teacher") => {
    setUserRole(role);
    const authData = JSON.parse(localStorage.getItem('studyai_auth') || '{}');
    authData.role = role;
    localStorage.setItem('studyai_auth', JSON.stringify(authData));
    
    if (role === "teacher") {
      setAuthState("teacher-info");
    } else {
      setAuthState("name-input");
      setShowNameInput(true);
    }
  };

  const handleTeacherInfoComplete = (name: string, subject: string) => {
    const info = { name, subject };
    setTeacherInfo(info);
    localStorage.setItem('teacherInfo', JSON.stringify(info));
    setAuthState("teacher-app");
    toast.success("Chào mừng Giáo viên!", {
      description: `Xin chào ${name}! Chào mừng bạn đến với hệ thống quản lý T-learn.`,
      duration: 3000,
    });
  };

  const handleNameSubmit = (name: string) => {
    setShowNameInput(false);
    setAuthState("welcome");
    setShowWelcome(true);
    toast.success("Chào mừng bạn đến với T-Learn!", {
      description: `Xin chào ${name}! Hãy bắt đầu hành trình học tập của bạn.`,
      duration: 3000,
    });
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setAuthState("app");
    toast.success("Chào mừng bạn đến với T-Learn!", {
      description: "Hãy khám phá các tính năng AI học tập thông minh!",
      duration: 3000,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('studyai_auth');
    localStorage.removeItem('userName');
    localStorage.removeItem('teacherInfo');
    setAuthState("login");
    setUserRole(null);
    setTeacherInfo({ name: "", subject: "" });
    toast.success("Đã đăng xuất", {
      description: "Hẹn gặp lại bạn!",
      duration: 2000,
    });
  };

  const handleFeatureSelect = (feature: string) => {
    setCurrentFeature(feature);
    // Reset health tab when selecting health normally
    if (feature === "health") {
      setHealthTab("water");
    }
  };

  const handleBack = () => {
    setCurrentFeature("dashboard");
  };

  const handleNavigateToMeditation = () => {
    setHealthTab("meditation");
    setCurrentFeature("health");
    toast.success("Chuyển sang phần Thiền - Thư giãn", {
      description: "Hãy chọn một session để bắt đầu thư giãn 🧘‍♀️",
      duration: 3000,
    });
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
        return <PomodoroTimer onBack={handleBack} onNavigateToHealth={handleNavigateToMeditation} />;
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
        return <Health onBack={handleBack} defaultTab={healthTab} />;
      case "storage":
        return <Storage onBack={handleBack} />;
      case "notes":
        return <Notes onBack={handleBack} />;
      case "progress-tracker":
        return <ProgressTracker onBack={handleBack} />;
      case "dictionary":
        return <Dictionary onBack={handleBack} />;
      case "slang-dictionary":
        return <SlangDictionary onBack={handleBack} />;
      case "my-classroom":
        return <MyClassroom onBack={handleBack} />;
      case "fake-news-detector":
        return <FakeNewsDetector onBack={handleBack} />;
      case "career-ai":
        return <CareerAI onBack={handleBack} />;
      default:
        return <Dashboard onFeatureSelect={handleFeatureSelect} />;
    }
  };

  // Render based on auth state
  if (authState === "login") {
    return (
      <>
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthState("register")}
        />
        <Toaster 
          position="top-center"
          richColors
          closeButton
          expand={true}
        />
      </>
    );
  }

  if (authState === "register") {
    return (
      <>
        <Register 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setAuthState("login")}
        />
        <Toaster 
          position="top-center"
          richColors
          closeButton
          expand={true}
        />
      </>
    );
  }

  if (authState === "role-selection") {
    return (
      <>
        <RoleSelection onRoleSelected={handleRoleSelected} />
        <Toaster 
          position="top-center"
          richColors
          closeButton
          expand={true}
        />
      </>
    );
  }

  if (authState === "teacher-info") {
    return (
      <>
        <TeacherInfoInput onComplete={handleTeacherInfoComplete} />
        <Toaster 
          position="top-center"
          richColors
          closeButton
          expand={true}
        />
      </>
    );
  }

  if (authState === "teacher-app") {
    return (
      <SocketProvider serverUrl="http://localhost:3000">
        <TeacherDashboard 
          teacherName={teacherInfo.name}
          teacherSubject={teacherInfo.subject}
          onLogout={handleLogout}
        />
        <Toaster 
          position="top-center"
          richColors
          closeButton
          expand={true}
        />
      </SocketProvider>
    );
  }

  return (
    <SocketProvider serverUrl="http://localhost:3000">
      <div className="min-h-screen">
        {showNameInput && <NameInput onNameSubmit={handleNameSubmit} />}
        {showWelcome && <WelcomeScreen onGetStarted={handleGetStarted} />}
        {!showNameInput && !showWelcome && authState === "app" && renderCurrentFeature()}
        <Toaster 
          position="top-center"
          richColors
          closeButton
          expand={true}
        />
      </div>
    </SocketProvider>
  );
}
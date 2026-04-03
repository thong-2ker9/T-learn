import { useState } from "react";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { TeacherDashboardHome } from "./teacher-dashboard-home";
import { TeacherAssignments } from "./teacher-assignments";
import { TeacherClasses } from "./teacher-classes";
import { TeacherSchedule } from "./teacher-schedule";
import { TeacherMessages } from "./teacher-messages";
import { TeacherSettings } from "./teacher-settings";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface TeacherDashboardProps {
  teacherName: string;
  teacherSubject: string;
  onLogout: () => void;
}

type TabType = "dashboard" | "assignments" | "classes" | "schedule" | "messages" | "settings";

export function TeacherDashboard({ teacherName, teacherSubject, onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "assignments" as TabType, label: "Giao bài tập", icon: ClipboardList },
    { id: "classes" as TabType, label: "Quản lý lớp", icon: Users },
    { id: "schedule" as TabType, label: "Thời khóa biểu", icon: Calendar },
    { id: "messages" as TabType, label: "Tin nhắn", icon: MessageSquare },
    { id: "settings" as TabType, label: "Cài đặt", icon: Settings },
  ];

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as TabType);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <TeacherDashboardHome teacherName={teacherName} teacherSubject={teacherSubject} onNavigate={handleNavigate} />;
      case "assignments":
        return <TeacherAssignments />;
      case "classes":
        return <TeacherClasses />;
      case "schedule":
        return <TeacherSchedule />;
      case "messages":
        return <TeacherMessages />;
      case "settings":
        return <TeacherSettings teacherName={teacherName} teacherSubject={teacherSubject} onLogout={onLogout} />;
      default:
        return <TeacherDashboardHome teacherName={teacherName} teacherSubject={teacherSubject} onNavigate={handleNavigate} />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-red-100 to-red-50 shadow-xl transition-all duration-300 z-50 ${
          sidebarOpen ? "w-72" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl">📚</span>
              </div>
              <span className="text-red-800">T-learn</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-red-200 rounded-xl transition-colors relative z-[100] pointer-events-auto"
            >
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>

          {/* Teacher Info */}
          <div className="bg-white rounded-3xl p-4 mb-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white">
                  {getInitials(teacherName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 truncate">{teacherName}</p>
                <p className="text-red-500 text-sm truncate">{teacherSubject}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-red-200/50"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-red-500"}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-red-200/50 transition-all duration-200 mt-6"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-72" : "ml-0"
        }`}
      >
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-red-100 rounded-xl transition-colors relative z-50"
            >
              <Menu className="w-6 h-6 text-red-600" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-gray-800">Xin chào, {teacherName}!</p>
                <p className="text-red-500 text-sm">{teacherSubject}</p>
              </div>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white">
                  {getInitials(teacherName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
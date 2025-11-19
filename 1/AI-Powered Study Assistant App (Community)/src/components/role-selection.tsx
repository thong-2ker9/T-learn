import { useState } from "react";
import { EducationalBackground } from "./educational-background";
import { GraduationCap, BookOpen } from "lucide-react";
import { Button } from "./ui/button";

interface RoleSelectionProps {
  onRoleSelected: (role: "teacher" | "student") => void;
}

export function RoleSelection({ onRoleSelected }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    // Save role to localStorage
    const authData = JSON.parse(localStorage.getItem("studyai_auth") || "{}");
    authData.role = selectedRole;
    localStorage.setItem("studyai_auth", JSON.stringify(authData));
    
    // Also update in users data
    const users = JSON.parse(localStorage.getItem("studyai_users") || "{}");
    if (authData.email && users[authData.email]) {
      users[authData.email].role = selectedRole;
      localStorage.setItem("studyai_users", JSON.stringify(users));
    }
    
    setTimeout(() => {
      onRoleSelected(selectedRole);
    }, 500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <EducationalBackground variant="primary" />
      
      <div className="relative z-10 w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-12 slide-up">
          <h1 className="text-white mb-4">Bạn là:</h1>
          <p className="text-white/90 text-xl">Chọn vai trò của bạn để tiếp tục</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Teacher Card */}
          <button
            onClick={() => setSelectedRole("teacher")}
            disabled={isLoading}
            className={`bg-white rounded-2xl p-8 shadow-xl transition-all duration-300 hover-card ${
              selectedRole === "teacher" 
                ? "ring-4 ring-red-500 scale-105" 
                : "hover:shadow-2xl"
            } slide-up`}
            style={{ animationDelay: "0.1s" }}
          >
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              selectedRole === "teacher"
                ? "bg-gradient-to-br from-red-500 to-red-600 scale-110"
                : "bg-gradient-to-br from-red-100 to-red-200"
            }`}>
              <GraduationCap className={`w-12 h-12 ${
                selectedRole === "teacher" ? "text-white" : "text-red-600"
              }`} />
            </div>
            <h3 className={`text-center mb-3 ${
              selectedRole === "teacher" ? "text-red-600" : "text-gray-800"
            }`}>
              Giáo viên
            </h3>
            <p className="text-center text-gray-600">
              Quản lý lớp học, tạo bài tập và theo dõi tiến độ học sinh
            </p>
            {selectedRole === "teacher" && (
              <div className="mt-4 flex justify-center check-mark">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>

          {/* Student Card */}
          <button
            onClick={() => setSelectedRole("student")}
            disabled={isLoading}
            className={`bg-white rounded-2xl p-8 shadow-xl transition-all duration-300 hover-card ${
              selectedRole === "student" 
                ? "ring-4 ring-red-500 scale-105" 
                : "hover:shadow-2xl"
            } slide-up`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              selectedRole === "student"
                ? "bg-gradient-to-br from-red-500 to-red-600 scale-110"
                : "bg-gradient-to-br from-red-100 to-red-200"
            }`}>
              <BookOpen className={`w-12 h-12 ${
                selectedRole === "student" ? "text-white" : "text-red-600"
              }`} />
            </div>
            <h3 className={`text-center mb-3 ${
              selectedRole === "student" ? "text-red-600" : "text-gray-800"
            }`}>
              Học sinh
            </h3>
            <p className="text-center text-gray-600">
              Học tập với AI, làm bài tập và theo dõi tiến độ học tập
            </p>
            {selectedRole === "student" && (
              <div className="mt-4 flex justify-center check-mark">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center slide-up" style={{ animationDelay: "0.3s" }}>
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className={`px-12 py-6 text-lg shadow-lg transition-all duration-300 ${
              selectedRole
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover-lift"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Tiếp tục"}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes checkMark {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        .check-mark {
          animation: checkMark 0.3s ease-out forwards;
        }

        .hover-card {
          transition: all 0.3s ease;
        }

        .hover-card:hover:not(:disabled) {
          transform: translateY(-4px);
        }

        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hover-lift:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
}

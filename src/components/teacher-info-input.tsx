import { useState } from "react";
import { EducationalBackground } from "./educational-background";
import { User, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TeacherInfoInputProps {
  onComplete: (name: string, subject: string) => void;
}

export function TeacherInfoInput({ onComplete }: TeacherInfoInputProps) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !subject.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    onComplete(name.trim(), subject.trim());
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <EducationalBackground variant="primary" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 slide-up">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4 scale-in">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-white mb-2">Thông tin Giáo viên</h1>
          <p className="text-white/90">Vui lòng cho chúng tôi biết thêm về bạn</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 slide-up" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-700">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="pl-10 border-gray-300 focus:border-red-400 focus:ring-red-400 rounded-2xl"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-700">Môn học giảng dạy</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Toán, Văn, Anh..."
                  className="pl-10 border-gray-300 focus:border-red-400 focus:ring-red-400 rounded-2xl"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl fade-in">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-lg rounded-2xl py-6"
            >
              Tiếp tục
            </Button>
          </form>
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        .scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { User, ArrowRight } from "lucide-react";
import { EducationalBackground } from "./educational-background";

interface NameInputProps {
  onNameSubmit: (name: string) => void;
}

export function NameInput({ onNameSubmit }: NameInputProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <EducationalBackground variant="secondary" />
      <Card className="relative z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-md shadow-2xl border-2 border-red-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">Chào mừng bạn!</h1>
          <p className="text-gray-600">Hãy cho chúng tôi biết tên của bạn để bắt đầu hành trình học tập cùng T-learn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Nhập tên của bạn..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-center border-2 border-red-200 focus:border-red-500 rounded-xl p-4 text-lg"
              maxLength={50}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl text-lg font-medium"
            disabled={!name.trim()}
          >
            Bắt đầu học tập
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Tên của bạn sẽ được lưu trên thiết bị này
          </p>
        </div>
      </Card>
    </div>
  );
}
import { Sparkles, Target, Briefcase, User } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface CareerAIHomeProps {
  onStartQuiz: () => void;
  onExploreJobs: () => void;
  onViewProfile: () => void;
}

export function CareerAIHome({ onStartQuiz, onExploreJobs, onViewProfile }: CareerAIHomeProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Hero Card */}
      <Card 
        className="p-8 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white border-0 shadow-2xl overflow-hidden relative"
        style={{ borderRadius: "20px" }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl -ml-24 -mb-24" />
        
        <div className="relative z-10 text-center space-y-4 animate-fade-in">
          <div className="inline-block p-4 bg-white/20 rounded-full backdrop-blur-sm mb-2">
            <Sparkles className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold">Bắt đầu khám phá nghề phù hợp</h2>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            AI sẽ phân tích sở thích, kỹ năng, giá trị để gợi ý nghề & lộ trình phù hợp nhất với bạn
          </p>
          <Button
            onClick={onStartQuiz}
            size="lg"
            className="bg-white text-purple-600 hover:bg-purple-50 mt-4 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{ borderRadius: "20px" }}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Bắt đầu khám phá 
          </Button>
        </div>
      </Card>

      {/* Intro Text */}
      <div className="text-center space-y-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <p className="text-gray-600">
          ✨ Trả lời 10 câu hỏi ngắn → 📊 Phân tích tính cách → 🎯 Nhận gợi ý nghề phù hợp
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-gradient-to-br from-purple-50 to-blue-50 animate-card-appear"
          style={{ borderRadius: "20px", animationDelay: "200ms" }}
          onClick={onStartQuiz}
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Quiz 5 phút</h3>
            <p className="text-sm text-gray-600">Khám phá sở thích & giá trị của bạn</p>
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
              10 câu hỏi
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 animate-card-appear"
          style={{ borderRadius: "20px", animationDelay: "300ms" }}
          onClick={onExploreJobs}
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Khám phá nghề</h3>
            <p className="text-sm text-gray-600">Tìm hiểu các nghề nghiệp phổ biến</p>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
              100+ nghề
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-gradient-to-br from-orange-50 to-red-50 animate-card-appear"
          style={{ borderRadius: "20px", animationDelay: "400ms" }}
          onClick={onViewProfile}
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Hồ sơ của tôi</h3>
            <p className="text-sm text-gray-600">Xem tiến độ & thành tích</p>
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
              Profile
            </div>
          </div>
        </Card>
      </div>

      {/* Features Overview */}
      <Card 
        className="p-6 border-0 bg-white shadow-md animate-slide-up"
        style={{ borderRadius: "20px", animationDelay: "500ms" }}
      >
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Bạn sẽ nhận được gì?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">Top 5 nghề phù hợp</p>
              <p className="text-xs text-gray-600">Với % match và lý do chi tiết</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">Phân tích tính cách</p>
              <p className="text-xs text-gray-600">Biểu đồ 5 chiều về điểm mạnh</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">🗺️</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">Lộ trình chi tiết</p>
              <p className="text-xs text-gray-600">Timeline 0-2 năm với từng bước</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">💼</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">Việc làm & Mentor</p>
              <p className="text-xs text-gray-600">Kết nối cơ hội thực tế</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
    </div>
  );
}

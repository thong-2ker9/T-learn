import { User, Award, Briefcase, BookOpen, Target, Calendar, TrendingUp, Share2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import type { CareerMatch } from "./career-ai";

interface CareerAIProfileProps {
  progress: number;
  careers: CareerMatch[];
  onBack: () => void;
}

const badges = [
  { id: "fast-learner", name: "Fast Learner", icon: "⚡", earned: true },
  { id: "explorer", name: "Career Explorer", icon: "🔍", earned: true },
  { id: "achiever", name: "High Achiever", icon: "🏆", earned: false }
];

const activities = [
  { id: 1, action: "Hoàn thành quiz phân tích nghề nghiệp", date: "Hôm nay", icon: "✅" },
  { id: 2, action: "Bắt đầu học module UX Designer", date: "Hôm nay", icon: "📚" },
  { id: 3, action: "Lưu 3 công việc phù hợp", date: "Hôm qua", icon: "💼" },
  { id: 4, action: "Kết nối với mentor trong lĩnh vực Data", date: "2 ngày trước", icon: "💬" }
];

export function CareerAIProfile({ progress, careers, onBack }: CareerAIProfileProps) {
  const topCareer = careers[0];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card 
        className="p-8 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white border-0 shadow-2xl overflow-hidden relative animate-scale-in"
        style={{ borderRadius: "20px" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl border-4 border-white/30">
              <User className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">Hồ sơ nghề nghiệp</h2>
              <p className="text-purple-100 mb-4">Theo dõi hành trình phát triển của bạn</p>
              
              <div className="flex gap-4">
                <div>
                  <p className="text-2xl font-bold">{careers.length}</p>
                  <p className="text-xs text-purple-100">Nghề phù hợp</p>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <p className="text-2xl font-bold">{badges.filter(b => b.earned).length}</p>
                  <p className="text-xs text-purple-100">Huy hiệu</p>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                  <p className="text-xs text-purple-100">Hoàn thành</p>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              className="rounded-full bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Tiến độ tổng thể</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-white/20" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Career Match */}
          {topCareer && (
            <Card 
              className="p-6 border-0 shadow-lg animate-slide-up"
              style={{ borderRadius: "20px" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-800">Nghề phù hợp nhất</h3>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-1">{topCareer.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{topCareer.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {topCareer.requiredSkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white flex-shrink-0 ml-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">{topCareer.matchPercent}%</div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Saved Careers */}
          <Card 
            className="p-6 border-0 shadow-lg animate-slide-up"
            style={{ borderRadius: "20px", animationDelay: "100ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-800">Nghề nghiệp đã khám phá</h3>
            </div>
            
            <div className="space-y-3">
              {careers.slice(0, 4).map((career, index) => (
                <div
                  key={career.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{career.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{career.salaryRange}</p>
                  </div>
                  <Badge className={
                    career.matchPercent >= 85 
                      ? "bg-green-100 text-green-700 border-green-300"
                      : career.matchPercent >= 70
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-purple-100 text-purple-700 border-purple-300"
                  }>
                    {career.matchPercent}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card 
            className="p-6 border-0 shadow-lg animate-slide-up"
            style={{ borderRadius: "20px", animationDelay: "200ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-800">Hoạt động gần đây</h3>
            </div>
            
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="text-2xl flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Badges */}
          <Card 
            className="p-6 border-0 shadow-lg animate-slide-up"
            style={{ borderRadius: "20px", animationDelay: "100ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-800">Huy hiệu</h3>
            </div>
            
            <div className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    badge.earned
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{badge.icon}</div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${badge.earned ? 'text-gray-800' : 'text-gray-500'}`}>
                        {badge.name}
                      </p>
                      {badge.earned && (
                        <p className="text-xs text-green-600 mt-0.5">✓ Đã đạt được</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Learning Stats */}
          <Card 
            className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 animate-slide-up"
            style={{ borderRadius: "20px", animationDelay: "200ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-800">Thống kê học tập</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Bài học hoàn thành</p>
                  <p className="text-sm font-semibold text-gray-800">8/11</p>
                </div>
                <Progress value={73} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Kỹ năng đã học</p>
                  <p className="text-sm font-semibold text-gray-800">5</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topCareer?.requiredSkills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Thời gian học</p>
                  <p className="text-lg font-bold text-blue-600">12.5h</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Goals */}
          <Card 
            className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 animate-slide-up"
            style={{ borderRadius: "20px", animationDelay: "300ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-800">Mục tiêu tuần này</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-green-600">✓</span>
                </div>
                <p className="text-sm text-gray-700">Hoàn thành quiz nghề nghiệp</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-green-600">✓</span>
                </div>
                <p className="text-sm text-gray-700">Học 5 bài trong module cơ bản</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500">Kết nối với 1 mentor</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500">Ứng tuyển 3 vị trí phù hợp</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full"
        >
          Quay lại trang chủ
        </Button>
      </div>
    </div>
  );
}

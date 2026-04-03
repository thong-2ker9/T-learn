import { Clock, CheckCircle2, ArrowRight, Target, BookOpen, Briefcase, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import type { CareerMatch } from "./career-ai";

interface CareerAICareerPathProps {
  career: CareerMatch;
  onStartLearning: () => void;
  onBack: () => void;
}

export function CareerAICareerPath({ career, onStartLearning, onBack }: CareerAICareerPathProps) {
  const getMatchColor = (percent: number) => {
    if (percent >= 85) return "from-green-500 to-emerald-500";
    if (percent >= 70) return "from-blue-500 to-cyan-500";
    return "from-purple-500 to-pink-500";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Hero Section */}
      <Card 
        className="p-8 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white border-0 shadow-2xl overflow-hidden relative animate-scale-in"
        style={{ borderRadius: "20px" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Badge className="bg-white/20 text-white border-white/30 mb-3">
                Lộ trình nghề nghiệp
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{career.title}</h1>
              <p className="text-purple-100 text-lg">{career.description}</p>
            </div>
            
            {/* Match Meter */}
            <div 
              className={`w-28 h-28 rounded-full bg-gradient-to-br ${getMatchColor(career.matchPercent)} flex items-center justify-center shadow-2xl`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold">{career.matchPercent}%</div>
                <div className="text-xs text-white/90">Phù hợp</div>
              </div>
            </div>
          </div>

          {/* Job Titles */}
          <div className="flex flex-wrap gap-2 mt-4">
            {career.jobTitles.map((title) => (
              <Badge key={title} className="bg-white/20 text-white border-white/30">
                {title}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Why Fit You */}
      <Card 
        className="p-6 border-0 shadow-lg animate-slide-up"
        style={{ borderRadius: "20px", animationDelay: "100ms" }}
      >
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Tại sao phù hợp với bạn?
        </h3>
        <div className="space-y-3">
          {career.reasons.map((reason, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-700">{reason}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills to Build */}
      <Card 
        className="p-6 border-0 shadow-lg animate-slide-up"
        style={{ borderRadius: "20px", animationDelay: "200ms" }}
      >
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Kỹ năng cần xây dựng
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {career.requiredSkills.map((skill, index) => (
            <div
              key={skill}
              className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-800 text-sm">{skill}</p>
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-600 font-semibold">
                  {index + 1}
                </div>
              </div>
              <Progress value={(5 - index) * 20} className="h-1.5" />
              <p className="text-xs text-gray-500 mt-2">Độ ưu tiên: {index < 2 ? "Cao" : index < 4 ? "Trung bình" : "Thấp"}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Timeline */}
      <Card 
        className="p-6 border-0 shadow-lg animate-slide-up"
        style={{ borderRadius: "20px", animationDelay: "300ms" }}
      >
        <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Lộ trình thời gian (0-2 năm)
        </h3>
        
        <div className="relative space-y-6">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500" />

          {career.pathTimeline.map((phase, index) => (
            <div key={index} className="relative pl-16">
              {/* Timeline Dot */}
              <div className="absolute left-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                {index + 1}
              </div>

              <Card className="p-5 border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50" style={{ borderRadius: "16px" }}>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">{phase.phase}</h4>
                    <p className="text-sm text-purple-600 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {phase.duration}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-600">Nhiệm vụ chính:</p>
                    {phase.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-purple-600">✓</span>
                        </div>
                        <p className="text-sm text-gray-700">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>

      {/* Salary & Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 animate-slide-up"
          style={{ borderRadius: "20px", animationDelay: "400ms" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mức lương trung bình</p>
              <p className="text-2xl font-bold text-green-600">{career.salaryRange}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            * Mức lương phụ thuộc vào kinh nghiệm, kỹ năng và công ty
          </p>
        </Card>

        <Card 
          className="p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 animate-slide-up"
          style={{ borderRadius: "20px", animationDelay: "500ms" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cơ hội việc làm</p>
              <p className="text-2xl font-bold text-orange-600">200+ việc</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Đang có nhiều vị trí tuyển dụng cho nghề này
          </p>
        </Card>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-6 z-20 animate-fade-in" style={{ animationDelay: "600ms" }}>
        <Card 
          className="p-4 bg-white border-0 shadow-2xl"
          style={{ borderRadius: "20px" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Sẵn sàng bắt đầu lộ trình?</p>
              <p className="text-sm text-gray-600">Học từng bước với bài học ngắn và thực hành</p>
            </div>
            <Button
              onClick={onStartLearning}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Bắt đầu học
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full"
        >
          Quay lại kết quả
        </Button>
      </div>
    </div>
  );
}

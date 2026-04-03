import { useState } from "react";
import { TrendingUp, Briefcase, DollarSign, ArrowRight, Star, Sparkles, Award } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { CareerMatch } from "./career-ai";

interface CareerAIResultsProps {
  matches: CareerMatch[];
  onSelectCareer: (career: CareerMatch) => void;
  onBack: () => void;
}

export function CareerAIResults({ matches, onSelectCareer, onBack }: CareerAIResultsProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  // Top 3 careers for spotlight
  const topCareers = matches.slice(0, 3);
  const otherCareers = matches.slice(3);

  const getMatchColor = (percent: number) => {
    if (percent >= 85) return "from-green-500 to-emerald-500";
    if (percent >= 70) return "from-blue-500 to-cyan-500";
    return "from-purple-500 to-pink-500";
  };

  const getMatchBadgeColor = (percent: number) => {
    if (percent >= 85) return "bg-green-100 text-green-700 border-green-300";
    if (percent >= 70) return "bg-blue-100 text-blue-700 border-blue-300";
    return "bg-purple-100 text-purple-700 border-purple-300";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Confetti Animation (CSS only) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '🎊', '⭐', '🏆'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Success Header */}
      <Card 
        className="p-8 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white border-0 shadow-2xl overflow-hidden relative animate-scale-in"
        style={{ borderRadius: "20px" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 text-center space-y-4">
          <div className="inline-block p-4 bg-white/20 rounded-full backdrop-blur-sm">
            <Award className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold">Phân tích hoàn tất!</h2>
          <p className="text-lg text-purple-100">
            Tìm thấy <strong>{matches.length} nghề nghiệp</strong> phù hợp với tính cách và sở thích của bạn
          </p>
        </div>
      </Card>

      {/* TOP 3 Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 animate-slide-down">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <h3 className="text-xl font-semibold text-gray-800">Top 3 nghề phù hợp nhất</h3>
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        </div>

        {topCareers.map((career, index) => (
          <Card
            key={career.id}
            className="p-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-card-appear relative overflow-hidden"
            style={{ 
              borderRadius: "20px",
              animationDelay: `${index * 150}ms`,
              background: index === 0 ? 'linear-gradient(135deg, #FFF9E6 0%, #FFE4B5 100%)' : 'white'
            }}
            onClick={() => onSelectCareer(career)}
          >
            {/* Rank Badge */}
            {index === 0 && (
              <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
                <span className="text-white font-bold text-lg">👑</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">{career.title}</h3>
                    {index < 3 && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                        #{index + 1}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">{career.description}</p>
                </div>
                
                {/* Match Score */}
                <div className="text-center flex-shrink-0">
                  <div 
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${getMatchColor(career.matchPercent)} flex items-center justify-center shadow-lg`}
                  >
                    <div>
                      <div className="text-3xl font-bold text-white">{career.matchPercent}%</div>
                      <div className="text-xs text-white/90">Match</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Match */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Tại sao phù hợp?
                </p>
                <div className="space-y-1.5">
                  {career.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-green-600">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Salary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Kỹ năng cần có:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.slice(0, 5).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Mức lương:
                  </p>
                  <p className="text-sm font-semibold text-green-600">{career.salaryRange}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {career.jobTitles.slice(0, 2).join(", ")}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCareer(career);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full"
              >
                Xem lộ trình chi tiết
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Other Careers */}
      {otherCareers.length > 0 && (
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "500ms" }}>
          <h3 className="text-lg font-semibold text-gray-700">Các nghề khác phù hợp</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherCareers.map((career, index) => (
              <Card
                key={career.id}
                className="p-5 border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                style={{ borderRadius: "16px" }}
                onClick={() => onSelectCareer(career)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">{career.title}</h4>
                    <Badge className={getMatchBadgeColor(career.matchPercent)}>
                      {career.matchPercent}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{career.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {career.jobTitles[0]}
                    </span>
                    <span className="text-green-600 font-medium">{career.salaryRange.split('-')[0]}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center pt-4 animate-fade-in" style={{ animationDelay: "700ms" }}>
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full"
        >
          Làm lại quiz
        </Button>
        <Button
          onClick={() => setShowConfetti(false)}
          variant="outline"
          className="rounded-full"
        >
          Ẩn hiệu ứng
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { CheckCircle2, Circle, Award, Play, BookOpen, Video, FileText, ExternalLink } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import type { CareerMatch } from "./career-ai";

interface CareerAILearningProps {
  career: CareerMatch;
  onComplete: () => void;
  onBack: () => void;
}

const learningModules = [
  {
    id: "basics",
    title: "Kiến thức nền tảng",
    duration: "30 phút",
    lessons: [
      { id: 1, title: "Giới thiệu tổng quan về nghề", duration: "5 phút", type: "video" as const },
      { id: 2, title: "Kỹ năng cốt lõi cần có", duration: "8 phút", type: "article" as const },
      { id: 3, title: "Công cụ và môi trường làm việc", duration: "10 phút", type: "interactive" as const },
      { id: 4, title: "Quiz: Kiểm tra kiến thức", duration: "7 phút", type: "quiz" as const }
    ]
  },
  {
    id: "practical",
    title: "Thực hành cơ bản",
    duration: "45 phút",
    lessons: [
      { id: 5, title: "Dự án mẫu đầu tiên", duration: "15 phút", type: "video" as const },
      { id: 6, title: "Hướng dẫn từng bước", duration: "20 phút", type: "article" as const },
      { id: 7, title: "Thực hành tự làm", duration: "10 phút", type: "interactive" as const }
    ]
  },
  {
    id: "advanced",
    title: "Kỹ năng nâng cao",
    duration: "60 phút",
    lessons: [
      { id: 8, title: "Best practices trong ngành", duration: "12 phút", type: "video" as const },
      { id: 9, title: "Case study thực tế", duration: "18 phút", type: "article" as const },
      { id: 10, title: "Portfolio building", duration: "20 phút", type: "interactive" as const },
      { id: 11, title: "Quiz tổng hợp", duration: "10 phút", type: "quiz" as const }
    ]
  }
];

const badges = [
  { id: "fast-learner", name: "Fast Learner", icon: "⚡", condition: "Hoàn thành 5 bài trong 1 ngày" },
  { id: "explorer", name: "Career Explorer", icon: "🔍", condition: "Khám phá 3 module khác nhau" },
  { id: "achiever", name: "High Achiever", icon: "🏆", condition: "Đạt điểm >90% trong quiz" }
];

export function CareerAILearning({ career, onComplete, onBack }: CareerAILearningProps) {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const totalLessons = learningModules.reduce((sum, module) => sum + module.lessons.length, 0);
  const progress = (completedLessons.length / totalLessons) * 100;

  const handleLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);

      // Check for badges
      if (newCompleted.length === 5 && !earnedBadges.includes("fast-learner")) {
        setEarnedBadges([...earnedBadges, "fast-learner"]);
      }
      if (newCompleted.length >= totalLessons * 0.5 && !earnedBadges.includes("explorer")) {
        setEarnedBadges([...earnedBadges, "explorer"]);
      }

      // Complete course if all done
      if (newCompleted.length === totalLessons) {
        setEarnedBadges([...earnedBadges, "achiever"]);
        onComplete();
      }
    }
    setSelectedLesson(null);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4" />;
      case "article": return <FileText className="w-4 h-4" />;
      case "interactive": return <Play className="w-4 h-4" />;
      case "quiz": return <CheckCircle2 className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-red-100 text-red-600";
      case "article": return "bg-blue-100 text-blue-600";
      case "interactive": return "bg-purple-100 text-purple-600";
      case "quiz": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Progress */}
      <Card 
        className="p-6 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white border-0 shadow-xl animate-scale-in"
        style={{ borderRadius: "20px" }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-white/20 text-white border-white/30 mb-2">
                Lộ trình học: {career.title}
              </Badge>
              <h2 className="text-2xl font-bold">Khóa học micro-learning</h2>
              <p className="text-purple-100 text-sm mt-1">
                {completedLessons.length}/{totalLessons} bài học hoàn thành
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{Math.round(progress)}%</div>
              <p className="text-xs text-purple-100">Tiến độ</p>
            </div>
          </div>
          <Progress value={progress} className="h-3 bg-white/20" />
        </div>
      </Card>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <Card 
          className="p-4 border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 animate-slide-down"
          style={{ borderRadius: "16px" }}
        >
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8 text-orange-500" />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Huy hiệu đã đạt được</p>
              <div className="flex gap-2 mt-2">
                {earnedBadges.map(badgeId => {
                  const badge = badges.find(b => b.id === badgeId);
                  return badge ? (
                    <Badge key={badgeId} className="bg-orange-100 text-orange-700 border-orange-300">
                      {badge.icon} {badge.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Learning Modules */}
      <div className="space-y-6">
        {learningModules.map((module, moduleIndex) => (
          <Card 
            key={module.id}
            className="p-6 border-0 shadow-lg animate-slide-up"
            style={{ borderRadius: "20px", animationDelay: `${moduleIndex * 100}ms` }}
          >
            <div className="space-y-4">
              {/* Module Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{module.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <BookOpen className="w-3 h-3" />
                    {module.lessons.length} bài · {module.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    {module.lessons.filter(l => completedLessons.includes(l.id)).length}/{module.lessons.length}
                  </p>
                  <p className="text-xs text-gray-500">Hoàn thành</p>
                </div>
              </div>

              {/* Lessons List */}
              <div className="space-y-2">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isSelected = selectedLesson === lesson.id;
                  
                  return (
                    <div key={lesson.id}>
                      <button
                        onClick={() => setSelectedLesson(isSelected ? null : lesson.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isCompleted 
                            ? 'bg-green-50 border-green-200' 
                            : isSelected
                            ? 'bg-purple-50 border-purple-300 shadow-md'
                            : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Status Icon */}
                          {isCompleted ? (
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                              <Circle className="w-5 h-5 text-gray-400" />
                            </div>
                          )}

                          {/* Lesson Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-800'}`}>
                                {lesson.title}
                              </p>
                              <Badge className={`${getLessonTypeColor(lesson.type)} text-xs`}>
                                {getLessonIcon(lesson.type)}
                                <span className="ml-1 capitalize">{lesson.type}</span>
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">{lesson.duration}</p>
                          </div>

                          {/* Action */}
                          {!isCompleted && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLesson(lesson.id);
                              }}
                              size="sm"
                              variant="ghost"
                              className="rounded-full"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </button>

                      {/* Expanded Lesson Content */}
                      {isSelected && (
                        <Card className="mt-2 p-5 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 animate-slide-down" style={{ borderRadius: "12px" }}>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Nội dung bài học</h4>
                              <p className="text-sm text-gray-600 mb-3">
                                Đây là nội dung mô phỏng cho bài học "{lesson.title}". 
                                Trong ứng dụng thực tế, bạn sẽ xem video, đọc bài viết, hoặc làm bài tập tương tác.
                              </p>
                              
                              {lesson.type === "quiz" && (
                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                  <p className="text-sm font-medium text-gray-700 mb-3">Câu hỏi mẫu:</p>
                                  <p className="text-sm text-gray-600 mb-3">Kỹ năng nào quan trọng nhất cho {career.title}?</p>
                                  <div className="space-y-2">
                                    {career.requiredSkills.slice(0, 4).map((skill, i) => (
                                      <button key={i} className="w-full p-2 text-left text-sm rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all">
                                        {String.fromCharCode(65 + i)}. {skill}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {lesson.type === "video" && (
                                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                                  <Play className="w-16 h-16 text-white opacity-50" />
                                </div>
                              )}

                              {lesson.type === "article" && (
                                <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-2">
                                  <p className="text-sm text-gray-700">📖 Bài viết chi tiết về {lesson.title.toLowerCase()}</p>
                                  <p className="text-xs text-gray-500">Nội dung được tối ưu để đọc trong {lesson.duration}</p>
                                </div>
                              )}

                              {lesson.type === "interactive" && (
                                <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg border border-purple-200">
                                  <p className="text-sm text-purple-700 mb-2">🎮 Bài tập tương tác</p>
                                  <p className="text-xs text-gray-600">Thực hành trực tiếp trên trình duyệt</p>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleLessonComplete(lesson.id)}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Đánh dấu hoàn thành
                              </Button>
                              <Button
                                onClick={() => setSelectedLesson(null)}
                                variant="outline"
                                className="rounded-full"
                              >
                                Đóng
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Resources */}
      <Card 
        className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 animate-slide-up"
        style={{ borderRadius: "20px", animationDelay: "400ms" }}
      >
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-blue-500" />
          Tài nguyên học tập bổ sung
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a href="#" className="p-3 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-all">
            <p className="font-medium text-gray-800 text-sm">📚 Khóa học miễn phí</p>
            <p className="text-xs text-gray-600 mt-1">Coursera, edX, Udemy</p>
          </a>
          <a href="#" className="p-3 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-all">
            <p className="font-medium text-gray-800 text-sm">👥 Cộng đồng học tập</p>
            <p className="text-xs text-gray-600 mt-1">Discord, Facebook Groups</p>
          </a>
          <a href="#" className="p-3 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-all">
            <p className="font-medium text-gray-800 text-sm">📖 Tài liệu tham khảo</p>
            <p className="text-xs text-gray-600 mt-1">Sách, blog, documentation</p>
          </a>
          <a href="#" className="p-3 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-all">
            <p className="font-medium text-gray-800 text-sm">🎯 Dự án thực hành</p>
            <p className="text-xs text-gray-600 mt-1">GitHub, Portfolio ideas</p>
          </a>
        </div>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full"
        >
          Quay lại lộ trình
        </Button>
      </div>
    </div>
  );
}

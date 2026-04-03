import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import type { QuizAnswers } from "./career-ai";

interface CareerAIQuizProps {
  onComplete: (answers: QuizAnswers) => void;
  onBack: () => void;
}

const quizQuestions = [
  {
    id: 1,
    category: "interests",
    question: "Bạn thích làm gì nhất trong thời gian rảnh?",
    emoji: "🎨",
    options: [
      { value: "creative", label: "Vẽ, thiết kế, sáng tạo nội dung", icon: "🎨" },
      { value: "technical", label: "Lập trình, xây dựng website/app", icon: "💻" },
      { value: "social", label: "Gặp gỡ, trò chuyện với bạn bè", icon: "👥" },
      { value: "analytical", label: "Đọc sách, nghiên cứu, phân tích", icon: "📚" }
    ]
  },
  {
    id: 2,
    category: "skills",
    question: "Bạn tự tin nhất về kỹ năng nào?",
    emoji: "⭐",
    options: [
      { value: "communication", label: "Giao tiếp và thuyết phục", icon: "💬" },
      { value: "problem-solving", label: "Giải quyết vấn đề logic", icon: "🧩" },
      { value: "creativity", label: "Sáng tạo và nghĩ ý tưởng mới", icon: "💡" },
      { value: "leadership", label: "Lãnh đạo và tổ chức", icon: "👑" }
    ]
  },
  {
    id: 3,
    category: "values",
    question: "Điều gì quan trọng nhất với bạn trong công việc?",
    emoji: "🎯",
    options: [
      { value: "impact", label: "Tạo ra tác động tích cực", icon: "🌟" },
      { value: "salary", label: "Thu nhập cao và ổn định", icon: "💰" },
      { value: "growth", label: "Cơ hội học hỏi và phát triển", icon: "📈" },
      { value: "flexibility", label: "Linh hoạt thời gian & địa điểm", icon: "🌍" }
    ]
  },
  {
    id: 4,
    category: "workStyle",
    question: "Bạn thích làm việc như thế nào?",
    emoji: "🚀",
    options: [
      { value: "team", label: "Làm việc nhóm, hợp tác nhiều", icon: "👥" },
      { value: "solo", label: "Độc lập, tự chủ cao", icon: "🧘" },
      { value: "hybrid", label: "Kết hợp cả hai", icon: "⚖️" },
      { value: "leadership", label: "Dẫn dắt và quản lý team", icon: "🎖️" }
    ]
  },
  {
    id: 5,
    category: "interests",
    question: "Môn học nào bạn yêu thích nhất?",
    emoji: "📖",
    options: [
      { value: "arts", label: "Mỹ thuật, Âm nhạc, Văn học", icon: "🎭" },
      { value: "sciences", label: "Toán, Lý, Hóa, Sinh", icon: "🔬" },
      { value: "languages", label: "Tiếng Anh, Ngữ văn", icon: "🗣️" },
      { value: "social", label: "Sử, Địa, GDCD", icon: "🌏" }
    ]
  },
  {
    id: 6,
    category: "skills",
    question: "Khi gặp vấn đề khó, bạn sẽ?",
    emoji: "🤔",
    options: [
      { value: "research", label: "Tìm hiểu, nghiên cứu kỹ", icon: "🔍" },
      { value: "ask", label: "Hỏi người có kinh nghiệm", icon: "💬" },
      { value: "experiment", label: "Thử nghiệm nhiều cách khác nhau", icon: "🧪" },
      { value: "plan", label: "Lập kế hoạch chi tiết", icon: "📋" }
    ]
  },
  {
    id: 7,
    category: "values",
    question: "Bạn mong muốn được công nhận vì?",
    emoji: "🏆",
    options: [
      { value: "innovation", label: "Sáng tạo và đổi mới", icon: "💡" },
      { value: "results", label: "Kết quả và hiệu suất cao", icon: "📊" },
      { value: "teamwork", label: "Tinh thần đồng đội", icon: "🤝" },
      { value: "expertise", label: "Chuyên môn sâu rộng", icon: "🎓" }
    ]
  },
  {
    id: 8,
    category: "workStyle",
    question: "Môi trường làm việc lý tưởng của bạn?",
    emoji: "🏢",
    options: [
      { value: "office", label: "Văn phòng hiện đại, chuyên nghiệp", icon: "🏢" },
      { value: "creative", label: "Không gian sáng tạo, tự do", icon: "🎨" },
      { value: "remote", label: "Làm việc từ xa, online", icon: "🏠" },
      { value: "dynamic", label: "Năng động, thay đổi liên tục", icon: "⚡" }
    ]
  },
  {
    id: 9,
    category: "interests",
    question: "Bạn thích loại nội dung nào nhất?",
    emoji: "📱",
    options: [
      { value: "visual", label: "Hình ảnh, video, design", icon: "📸" },
      { value: "text", label: "Bài viết, blog, sách", icon: "📝" },
      { value: "data", label: "Biểu đồ, số liệu, phân tích", icon: "📊" },
      { value: "interactive", label: "Game, app tương tác", icon: "🎮" }
    ]
  },
  {
    id: 10,
    category: "skills",
    question: "Điểm mạnh lớn nhất của bạn?",
    emoji: "💪",
    options: [
      { value: "detail", label: "Tỉ mỉ, chú ý chi tiết", icon: "🔍" },
      { value: "bigpicture", label: "Nhìn tổng quan, chiến lược", icon: "🗺️" },
      { value: "execution", label: "Hành động nhanh, quyết đoán", icon: "⚡" },
      { value: "empathy", label: "Đồng cảm, hiểu người khác", icon: "❤️" }
    ]
  }
];

export function CareerAIQuiz({ onComplete, onBack }: CareerAIQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleSelectOption = (value: string) => {
    setSelectedOption(value);
    
    // Auto-advance after selection with a small delay
    setTimeout(() => {
      handleNext(value);
    }, 300);
  };

  const handleNext = (value?: string) => {
    const answerValue = value || selectedOption;
    if (!answerValue) return;

    const newAnswers = {
      ...answers,
      [question.id]: answerValue
    };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed - organize answers by category
      const organized: QuizAnswers = {
        interests: [],
        skills: [],
        values: [],
        workStyle: []
      };

      quizQuestions.forEach((q) => {
        const answer = newAnswers[q.id];
        if (answer) {
          organized[q.category as keyof QuizAnswers].push(answer);
        }
      });

      onComplete(organized);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Progress */}
      <div className="space-y-2 animate-fade-in">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Câu hỏi {currentQuestion + 1}/{quizQuestions.length}</span>
          <span className="font-medium text-purple-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card 
        className="p-8 border-0 shadow-xl animate-slide-up bg-gradient-to-br from-white to-purple-50"
        style={{ borderRadius: "20px" }}
      >
        <div className="text-center space-y-6">
          <div className="text-6xl animate-bounce-slow">{question.emoji}</div>
          <h2 className="text-2xl font-semibold text-gray-800">{question.question}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {question.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 hover:shadow-lg animate-card-appear ${
                  selectedOption === option.value
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{option.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{option.label}</p>
                  </div>
                  {selectedOption === option.value && (
                    <CheckCircle2 className="w-6 h-6 text-purple-500 animate-scale-in" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between animate-fade-in">
        <Button
          onClick={handleBack}
          variant="outline"
          className="rounded-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentQuestion === 0 ? "Quay lại" : "Câu trước"}
        </Button>

        <div className="flex gap-1">
          {quizQuestions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentQuestion ? 'bg-purple-500 w-3' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={() => handleNext()}
          disabled={!selectedOption}
          className="rounded-full bg-purple-600 hover:bg-purple-700"
        >
          {currentQuestion === quizQuestions.length - 1 ? "Hoàn thành" : "Tiếp theo"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Tips */}
      <Card 
        className="p-4 bg-blue-50 border-blue-200 animate-slide-up"
        style={{ borderRadius: "16px", animationDelay: "200ms" }}
      >
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>Mẹo:</strong> Chọn đáp án phản ánh đúng nhất sở thích và giá trị của bạn. Không có câu trả lời đúng/sai!
        </p>
      </Card>
    </div>
  );
}

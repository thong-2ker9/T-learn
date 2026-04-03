import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle, Award, RefreshCcw } from "lucide-react";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";

interface FakeNewsQuizProps {
  onBack: () => void;
  onComplete: () => void;
}

const questions = [
  {
    id: 1,
    question: "Dấu hiệu nào cho thấy một tin tức có thể là giả?",
    options: [
      "Có nguồn từ website chính thống",
      "Ngôn ngữ quá cường điệu, gây sốc",
      "Có tác giả rõ ràng",
      "Được nhiều báo lớn đưa tin"
    ],
    correctAnswer: 1,
    explanation: "Ngôn ngữ quá cường điệu, gây sốc thường là dấu hiệu của tin giả. Tin tức thật thường có văn phong trung lập và khách quan."
  },
  {
    id: 2,
    question: "Khi gặp tin tức đáng ngờ, bạn nên làm gì đầu tiên?",
    options: [
      "Chia sẻ ngay để mọi người biết",
      "Kiểm tra nguồn tin và tìm thêm thông tin",
      "Bình luận phản đối",
      "Bỏ qua không quan tâm"
    ],
    correctAnswer: 1,
    explanation: "Luôn kiểm tra nguồn tin và tìm thêm thông tin từ các nguồn đáng tin cậy trước khi tin hoặc chia sẻ."
  },
  {
    id: 3,
    question: "Điều gì giúp xác định một nguồn tin đáng tin cậy?",
    options: [
      "Có nhiều quảng cáo",
      "Thiết kế website đẹp",
      "Có thông tin tác giả, nguồn tham khảo rõ ràng",
      "Có nhiều lượt chia sẻ trên mạng xã hội"
    ],
    correctAnswer: 2,
    explanation: "Nguồn tin đáng tin cậy thường có thông tin tác giả rõ ràng, nguồn tham khảo có thể kiểm chứng và được các tổ chức uy tín công nhận."
  },
  {
    id: 4,
    question: "Tại sao không nên chia sẻ tin giả?",
    options: [
      "Vì sẽ bị phạt tiền",
      "Vì góp phần lan truyền thông tin sai lệch gây hại",
      "Vì mất thời gian",
      "Vì không ai tin"
    ],
    correctAnswer: 1,
    explanation: "Mỗi lần chia sẻ tin giả, bạn đang góp phần lan truyền thông tin sai lệch có thể gây hại cho cộng đồng, ảnh hưởng đến sức khỏe, tài chính và quyết định của nhiều người."
  },
  {
    id: 5,
    question: "Cách tốt nhất để kiểm tra một bức ảnh có bị chỉnh sửa không?",
    options: [
      "Nhìn bằng mắt thường",
      "Hỏi ý kiến bạn bè",
      "Sử dụng công cụ tìm kiếm ảnh ngược (reverse image search)",
      "Tin vào trực giác"
    ],
    correctAnswer: 2,
    explanation: "Công cụ tìm kiếm ảnh ngược như Google Images giúp bạn tìm nguồn gốc của ảnh, phát hiện ảnh cũ được đăng lại hoặc ảnh đã bị chỉnh sửa."
  }
];

export function FakeNewsQuiz({ onBack, onComplete }: FakeNewsQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleAnswerSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      toast.error("Vui lòng chọn một câu trả lời");
      return;
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    
    if (isCorrect && !answeredQuestions[currentQuestion]) {
      setScore(score + 1);
    }

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);

    setShowResult(true);
    
    if (isCorrect) {
      toast.success("Chính xác! 🎉");
    } else {
      toast.error("Chưa đúng, hãy đọc giải thích nhé!");
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setIsQuizComplete(false);
  };

  const handleFinish = () => {
    // Save badge/achievement
    const achievements = JSON.parse(localStorage.getItem("achievements") || "[]");
    const percentage = (score / questions.length) * 100;
    
    if (percentage >= 80 && !achievements.includes("fake-news-expert")) {
      achievements.push("fake-news-expert");
      localStorage.setItem("achievements", JSON.stringify(achievements));
      toast.success("🏆 Bạn đã nhận huy hiệu 'Người kiểm chứng tin tức'!");
    }

    onComplete();
  };

  if (isQuizComplete) {
    const percentage = (score / questions.length) * 100;
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center space-y-6 animate-scale-in">
          <div className="text-6xl mb-4">
            {percentage >= 80 ? "🏆" : percentage >= 60 ? "🎯" : "💪"}
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz hoàn thành!</h2>
            <p className="text-gray-600">Kết quả của bạn</p>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 space-y-3">
            <div className="text-5xl font-bold text-red-600">{score}/{questions.length}</div>
            <div className="text-xl text-gray-700">
              {percentage >= 80 && "Xuất sắc! Bạn là chuyên gia phân biệt tin giả! 🌟"}
              {percentage >= 60 && percentage < 80 && "Tốt lắm! Bạn đã nắm được kiến thức cơ bản! 👍"}
              {percentage < 60 && "Đừng nản! Hãy ôn lại bài học và thử lại! 💪"}
            </div>
          </div>

          {percentage >= 80 && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Huy hiệu mới!</p>
                  <p className="text-sm text-gray-600">Người kiểm chứng tin tức</p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="flex-1"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Làm lại
            </Button>
            <Button
              onClick={handleFinish}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Hoàn thành
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress */}
      <div className="space-y-2 animate-fade-in">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Câu {currentQuestion + 1} / {questions.length}</span>
          <span>Điểm: {score}/{questions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6 animate-slide-up">
        <div className="space-y-6">
          {/* Question */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">{question.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    showCorrect
                      ? "border-green-500 bg-green-50"
                      : showWrong
                      ? "border-red-500 bg-red-50"
                      : isSelected
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{option}</span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                    {showWrong && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <Card className="p-4 bg-blue-50 border-blue-200 animate-slide-down">
              <div className="flex items-start gap-2">
                <div className="text-2xl">💡</div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">Giải thích:</p>
                  <p className="text-sm text-gray-700">{question.explanation}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!showResult ? (
          <>
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1"
            >
              Quay lại
            </Button>
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Kiểm tra
            </Button>
          </>
        ) : (
          <Button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            {currentQuestion < questions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
          </Button>
        )}
      </div>
    </div>
  );
}

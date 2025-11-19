import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";
import { Progress } from "./ui/progress";

interface FakeNewsMiniLessonsProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

const lessons = [
  {
    id: 1,
    title: "Tại sao tin giả nguy hiểm?",
    icon: "⚠️",
    content: [
      {
        type: "text",
        value: "Tin giả có thể gây ra nhiều hậu quả nghiêm trọng trong xã hội:"
      },
      {
        type: "list",
        items: [
          "🧠 Gây hoang mang, lo lắng cho cộng đồng",
          "💰 Thiệt hại tài chính cho cá nhân và tổ chức",
          "🏥 Nguy hiểm đến sức khỏe khi tin theo lời khuyên sai lệch",
          "⚖️ Ảnh hưởng đến quyết định quan trọng",
          "🌐 Làm suy yếu niềm tin vào thông tin chính thống"
        ]
      },
      {
        type: "highlight",
        value: "Mỗi lần chia sẻ tin giả, bạn đang góp phần lan truyền sự sai lệch!"
      }
    ]
  },
  {
    id: 2,
    title: "Ví dụ thực tế: Tin tốt",
    icon: "✅",
    content: [
      {
        type: "example",
        title: "Trường Tiểu học X nhận quà hỗ trợ 100 triệu từ nhà hảo tâm",
        status: "verified",
        details: [
          "✓ Đăng trên website chính thức của trường",
          "✓ Có văn bản xác nhận từ nhà trường",
          "✓ Hình ảnh sự kiện với metadata khớp thời gian",
          "✓ Nhiều nguồn tin độc lập đưa tin tương tự",
          "✓ Tác giả và nguồn tin rõ ràng"
        ]
      },
      {
        type: "text",
        value: "📊 Độ tin cậy: 92% - Đây là tin tức đã được xác minh từ nhiều nguồn đáng tin cậy."
      }
    ]
  },
  {
    id: 3,
    title: "Ví dụ thực tế: Tin giả",
    icon: "❌",
    content: [
      {
        type: "example",
        title: "Thuốc X chữa khỏi bệnh Y trong 24 giờ",
        status: "fake",
        details: [
          "✗ Trang mạng không rõ tác giả",
          "✗ Không có trích dẫn nghiên cứu khoa học",
          "✗ Ảnh là stock photo đã được cắt ghép",
          "✗ Ngôn ngữ cường điệu, hứa hẹn điều phi thực tế",
          "✗ Không tìm thấy thông tin tương tự từ nguồn uy tín"
        ]
      },
      {
        type: "text",
        value: "📊 Độ tin cậy: 18% - Đây là tin giả điển hình với nhiều dấu hiệu cảnh báo."
      }
    ]
  },
  {
    id: 4,
    title: "Ví dụ thực tế: Cần kiểm chứng",
    icon: "⚡",
    content: [
      {
        type: "example",
        title: "Chính sách Z sắp áp dụng ngay tuần tới",
        status: "warning",
        details: [
          "⚠ Chỉ có post Facebook của tài khoản cá nhân",
          "⚠ Chưa có thông tin từ nguồn chính thống",
          "⚠ Không có văn bản chính thức đính kèm",
          "⚠ Thời gian thực hiện chưa rõ ràng",
          "⚠ Cần đối chiếu với website chính phủ"
        ]
      },
      {
        type: "text",
        value: "📊 Độ tin cậy: 52% - Nên tìm kiếm thêm từ nguồn chính thống trước khi tin."
      }
    ]
  },
  {
    id: 5,
    title: "5 bước kiểm tra tin tức",
    icon: "📋",
    content: [
      {
        type: "text",
        value: "Áp dụng checklist này mỗi khi gặp tin tức đáng ngờ:"
      },
      {
        type: "checklist",
        items: [
          {
            step: "1️⃣ Kiểm tra nguồn",
            description: "Website/trang có uy tín không? Domain có đáng tin không?"
          },
          {
            step: "2️⃣ Kiểm tra tác giả",
            description: "Ai viết bài này? Họ có chuyên môn trong lĩnh vực không?"
          },
          {
            step: "3️⃣ Kiểm tra ngày tháng",
            description: "Thông tin còn mới không? Có phải tin cũ được đăng lại không?"
          },
          {
            step: "4️⃣ Tìm nguồn độc lập",
            description: "Có báo chính thống nào khác đưa tin tương tự không?"
          },
          {
            step: "5️⃣ Chú ý ngôn ngữ",
            description: "Có quá cường điệu, gây sốc không? Có lỗi chính tả nhiều không?"
          }
        ]
      },
      {
        type: "highlight",
        value: "Nếu nghi ngờ, đừng chia sẻ! Hãy kiểm chứng trước."
      }
    ]
  }
];

export function FakeNewsMiniLessons({ onBack, onStartQuiz }: FakeNewsMiniLessonsProps) {
  const [currentLesson, setCurrentLesson] = useState(0);

  const progress = ((currentLesson + 1) / lessons.length) * 100;
  const lesson = lessons[currentLesson];

  const handleNext = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handlePrev = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const renderContent = (item: any) => {
    switch (item.type) {
      case "text":
        return <p className="text-gray-700">{item.value}</p>;
      
      case "list":
        return (
          <ul className="space-y-2">
            {item.items.map((listItem: string, i: number) => (
              <li key={i} className="text-gray-700 flex items-start gap-2">
                <span className="mt-1">{listItem}</span>
              </li>
            ))}
          </ul>
        );
      
      case "highlight":
        return (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-gray-800 font-medium">{item.value}</p>
          </div>
        );
      
      case "example":
        return (
          <Card className={`p-4 ${
            item.status === "verified" ? "bg-green-50 border-green-200" :
            item.status === "fake" ? "bg-red-50 border-red-200" :
            "bg-yellow-50 border-yellow-200"
          }`}>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {item.status === "verified" && <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />}
                {item.status === "fake" && <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />}
                {item.status === "warning" && <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">{item.title}</h4>
                  <ul className="space-y-2">
                    {item.details.map((detail: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700">{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        );
      
      case "checklist":
        return (
          <div className="space-y-3">
            {item.items.map((checkItem: any, i: number) => (
              <Card key={i} className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-medium text-gray-800 mb-1">{checkItem.step}</h4>
                <p className="text-sm text-gray-600">{checkItem.description}</p>
              </Card>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress */}
      <div className="space-y-2 animate-fade-in">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Bài {currentLesson + 1} / {lessons.length}</span>
          <span>{Math.round(progress)}% hoàn thành</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Lesson Card */}
      <Card className="p-6 animate-slide-up">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <div className="text-5xl mb-3">{lesson.icon}</div>
            <h2 className="text-2xl font-semibold text-gray-800">{lesson.title}</h2>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {lesson.content.map((item, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                {renderContent(item)}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePrev}
          disabled={currentLesson === 0}
          variant="outline"
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Bài trước
        </Button>

        {currentLesson === lessons.length - 1 ? (
          <Button
            onClick={onStartQuiz}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Làm Quiz
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            Bài tiếp
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button onClick={onBack} variant="outline">
          <BookOpen className="w-4 h-4 mr-2" />
          Quay lại kết quả
        </Button>
      </div>
    </div>
  );
}

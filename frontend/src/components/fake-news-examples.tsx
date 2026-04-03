import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";
import type { AnalysisResult } from "./fake-news-detector";

interface FakeNewsExamplesProps {
  onBack: () => void;
  onAnalyzeExample: (result: AnalysisResult) => void;
}

const examples = [
  {
    id: "good",
    type: "verified",
    icon: "✅",
    title: "Bài tốt - Tin đã xác minh",
    newsTitle: "Trường Tiểu học X nhận quà hỗ trợ 100 triệu từ nhà hảo tâm",
    description: "Ví dụ về tin tức đã được xác minh từ nhiều nguồn tin đáng tin cậy",
    highlights: [
      "✓ Đăng trên website chính thức của trường",
      "✓ Có văn bản xác nhận từ nhà trường",
      "✓ Hình ảnh sự kiện với metadata khớp thời gian",
      "✓ Nhiều nguồn tin độc lập (VTV, báo địa phương) đưa tin",
      "✓ Tác giả và nguồn tin rõ ràng"
    ],
    score: 92,
    color: "bg-green-50 border-green-200",
    badgeColor: "bg-[#0B63FF]"
  },
  {
    id: "fake",
    type: "fake",
    icon: "❌",
    title: "Bài giả - Tin sai lệch",
    newsTitle: "Thuốc X chữa khỏi bệnh Y trong 24 giờ",
    description: "Ví dụ điển hình về tin giả với nhiều dấu hiệu cảnh báo",
    highlights: [
      "✗ Trang mạng không rõ tác giả",
      "✗ Không có trích dẫn nghiên cứu khoa học",
      "✗ Ảnh là stock photo đã được cắt ghép",
      "✗ Ngôn ngữ cường điệu 'chữa khỏi 100%'",
      "✗ Không tìm thấy thông tin từ nguồn y tế uy tín"
    ],
    score: 18,
    color: "bg-red-50 border-red-200",
    badgeColor: "bg-[#E53935]"
  },
  {
    id: "warning",
    type: "warning",
    icon: "⚠️",
    title: "Cần kiểm chứng - Chưa rõ",
    newsTitle: "Chính sách Z sắp áp dụng ngay tuần tới",
    description: "Tin tức cần được xác minh thêm từ nguồn chính thống",
    highlights: [
      "⚠ Chỉ có post Facebook của tài khoản cá nhân",
      "⚠ Chưa có thông tin từ nguồn chính thống",
      "⚠ Không có văn bản chính thức đính kèm",
      "⚠ Thời gian thực hiện chưa rõ ràng",
      "⚠ Cần đối chiếu với website chính phủ/bộ ngành"
    ],
    score: 52,
    color: "bg-yellow-50 border-yellow-200",
    badgeColor: "bg-[#FF8A00]"
  }
];

export function FakeNewsExamples({ onBack, onAnalyzeExample }: FakeNewsExamplesProps) {
  const handleViewDetail = (exampleId: string) => {
    const example = examples.find(e => e.id === exampleId);
    if (!example) return;

    const mockResult: AnalysisResult = {
      score: example.score,
      title: example.newsTitle,
      domain: exampleId === "good" ? "truongX.edu.vn" : exampleId === "fake" ? "tingiamao.com" : "facebook.com",
      date: new Date().toLocaleDateString("vi-VN"),
      reasons: example.highlights.map((highlight, i) => ({
        text: highlight.replace(/^[✓✗⚠]\s/, ""),
        confidence: exampleId === "good" ? 85 + i * 2 : exampleId === "fake" ? 20 - i : 50,
        icon: exampleId === "good" ? "✅" : exampleId === "fake" ? "❌" : "⚠️"
      })),
      sources: exampleId === "good" ? [
        { url: "https://truongX.edu.vn", name: "Website chính thức trường X", matched: true },
        { url: "https://vtv.vn", name: "VTV News", matched: true },
        { url: "https://baodiaiphuong.vn", name: "Báo địa phương", matched: true }
      ] : exampleId === "fake" ? [
        { url: "https://tingiamao.com", name: "Website không rõ nguồn gốc", matched: false },
        { url: "https://whoami.xyz", name: "Blog cá nhân", matched: false }
      ] : [
        { url: "https://facebook.com/user", name: "Trang cá nhân", matched: false },
        { url: "https://chinhphu.vn", name: "Cổng thông tin chính phủ (chưa có thông tin)", matched: false }
      ],
      evidence: exampleId === "good" ? [
        "Đã tìm thấy bài viết tương tự trên website chính thức của trường",
        "Có văn bản xác nhận kèm chữ ký và con dấu của hiệu trưởng",
        "Hình ảnh có metadata EXIF khớp với thời gian và địa điểm sự kiện",
        "VTV đã đưa tin với cùng nội dung vào ngày 15/11/2025"
      ] : exampleId === "fake" ? [
        "Không tìm thấy nghiên cứu khoa học nào về thuốc này",
        "Ảnh được tìm thấy trên nhiều website stock photo",
        "Không có đơn vị y tế nào xác nhận thông tin",
        "Nhiều website fact-check đã gắn cờ đỏ"
      ] : [
        "Chưa có thông báo chính thức từ cơ quan có thẩm quyền",
        "Thông tin chỉ xuất hiện trên mạng xã hội",
        "Chưa có văn bản pháp lý hỗ trợ"
      ],
      suggestions: exampleId === "good" ? [
        "Bạn có thể yên tâm chia sẻ tin này",
        "Truy cập website chính thức để biết thêm chi tiết"
      ] : exampleId === "fake" ? [
        "KHÔNG nên chia sẻ tin này",
        "Báo cáo nội dung sai sự thật",
        "Tìm kiếm thông tin từ nguồn y tế uy tín như Bộ Y tế"
      ] : [
        "Chờ thông báo chính thức từ cơ quan có thẩm quyền",
        "Kiểm tra trên website chính phủ hoặc bộ ngành liên quan",
        "Không nên chia sẻ cho đến khi có xác nhận"
      ]
    };

    onAnalyzeExample(mockResult);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-800">Ví dụ thực tế</h2>
        <p className="text-gray-600">
          Tìm hiểu sự khác biệt giữa tin thật, tin giả và tin cần kiểm chứng
        </p>
      </div>

      {/* Examples Grid */}
      <div className="space-y-4">
        {examples.map((example, index) => (
          <Card 
            key={example.id} 
            className={`${example.color} p-6 animate-card-appear`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-4xl">{example.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{example.title}</h3>
                    <p className="text-sm text-gray-600">{example.description}</p>
                  </div>
                </div>
                <Badge className={`${example.badgeColor} text-white`}>
                  {example.score}%
                </Badge>
              </div>

              {/* News Title */}
              <div className="bg-white/50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <p className="font-medium text-gray-800 italic">"{example.newsTitle}"</p>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Dấu hiệu nhận biết:</p>
                <ul className="space-y-2">
                  {example.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => handleViewDetail(example.id)}
                className={`w-full ${
                  example.type === "verified" 
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    : example.type === "fake"
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                }`}
              >
                {example.type === "verified" && <CheckCircle2 className="w-4 h-4 mr-2" />}
                {example.type === "fake" && <XCircle className="w-4 h-4 mr-2" />}
                {example.type === "warning" && <AlertTriangle className="w-4 h-4 mr-2" />}
                Xem phân tích chi tiết
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="flex items-start gap-2">
          <div className="text-2xl">💡</div>
          <div>
            <p className="font-medium text-gray-800 mb-1">Ghi nhớ</p>
            <p className="text-sm text-gray-700">
              Mỗi ví dụ trên đây đều thể hiện các đặc điểm điển hình. Trong thực tế, hãy luôn kiểm tra kỹ và so sánh 
              với nhiều nguồn tin trước khi tin hoặc chia sẻ.
            </p>
          </div>
        </div>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button onClick={onBack} variant="outline">
          Quay lại
        </Button>
      </div>
    </div>
  );
}

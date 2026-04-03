import { useState } from "react";
import { Link, FileText, Camera, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import type { AnalysisResult } from "./fake-news-detector";

interface FakeNewsLandingProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onViewExamples: () => void;
  onViewLessons: () => void;
}

export function FakeNewsLanding({ onAnalysisComplete, onViewExamples, onViewLessons }: FakeNewsLandingProps) {
  const [activeInput, setActiveInput] = useState<"link" | "text" | "image" | null>(null);
  const [linkValue, setLinkValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    let hasInput = false;
    if (activeInput === "link" && linkValue) hasInput = true;
    if (activeInput === "text" && textValue) hasInput = true;
    if (activeInput === "image" && imageFile) hasInput = true;

    if (!hasInput) {
      toast.error("Vui lòng nhập nội dung cần kiểm tra");
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      // Mock result - in real app, this would call the AI API
      const mockResult: AnalysisResult = {
        score: Math.floor(Math.random() * 100),
        title: activeInput === "link" 
          ? "Trường Tiểu học X nhận quà hỗ trợ 100 triệu từ nhà hảo tâm"
          : "Nội dung đã phân tích",
        domain: activeInput === "link" ? "example.com" : undefined,
        date: new Date().toLocaleDateString("vi-VN"),
        reasons: [
          { text: "Nguồn tin đáng tin cậy", confidence: 85, icon: "✅" },
          { text: "Ngôn ngữ trung lập, không cường điệu", confidence: 78, icon: "📝" },
          { text: "Có thông tin tác giả rõ ràng", confidence: 92, icon: "👤" },
          { text: "Ngày đăng hợp lý", confidence: 88, icon: "📅" }
        ],
        sources: [
          { url: "https://example1.com", name: "Nguồn chính thống 1", matched: true },
          { url: "https://example2.com", name: "Nguồn chính thống 2", matched: true },
          { url: "https://example3.com", name: "Nguồn độc lập", matched: false }
        ],
        evidence: [
          "Đã tìm thấy bài viết tương tự trên website chính thức của trường",
          "Có văn bản xác nhận từ nhà trường",
          "Hình ảnh có metadata khớp với thời gian sự kiện"
        ],
        suggestions: [
          "Kiểm tra thêm trên website chính thức",
          "Tìm kiếm tin tức liên quan từ các nguồn khác",
          "Xác minh thông tin với cơ quan có thẩm quyền"
        ]
      };

      setIsAnalyzing(false);
      onAnalysisComplete(mockResult);
      toast.success("Phân tích hoàn tất!");
    }, 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      toast.success("Đã tải ảnh lên");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Title & Subtitle */}
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-800">Kiểm tra tin tức với AI</h2>
        <p className="text-gray-600">
          Kiểm tra nhanh tin tức, bài viết hoặc ảnh chụp màn hình. Nhận giải thích bằng tiếng Việt trong vài giây.
        </p>
      </div>

      {/* Input Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Link Input */}
        <Card
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg animate-card-appear ${
            activeInput === "link" ? "ring-2 ring-blue-500 shadow-lg" : ""
          }`}
          style={{ animationDelay: "200ms" }}
          onClick={() => setActiveInput("link")}
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Link className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Dán link</h3>
              <p className="text-xs text-gray-600 mt-1">Nhập URL bài viết</p>
            </div>
          </div>
        </Card>

        {/* Text Input */}
        <Card
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg animate-card-appear ${
            activeInput === "text" ? "ring-2 ring-green-500 shadow-lg" : ""
          }`}
          style={{ animationDelay: "300ms" }}
          onClick={() => setActiveInput("text")}
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Dán nội dung</h3>
              <p className="text-xs text-gray-600 mt-1">Paste văn bản</p>
            </div>
          </div>
        </Card>

        {/* Image Upload */}
        <Card
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg animate-card-appear ${
            activeInput === "image" ? "ring-2 ring-purple-500 shadow-lg" : ""
          }`}
          style={{ animationDelay: "400ms" }}
          onClick={() => setActiveInput("image")}
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Tải ảnh lên</h3>
              <p className="text-xs text-gray-600 mt-1">Chụp/tải ảnh màn hình</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Input Field Based on Selection */}
      {activeInput === "link" && (
        <Card className="p-4 animate-slide-up">
          <div className="space-y-3">
            <Label>URL bài viết</Label>
            <Input
              type="url"
              placeholder="https://example.com/article"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
            />
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !linkValue}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang phân tích...
                </>
              ) : (
                "Kiểm tra"
              )}
            </Button>
          </div>
        </Card>
      )}

      {activeInput === "text" && (
        <Card className="p-4 animate-slide-up">
          <div className="space-y-3">
            <Label>Nội dung văn bản</Label>
            <Textarea
              placeholder="Dán nội dung bài viết hoặc tin tức tại đây..."
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              rows={6}
            />
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !textValue}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang phân tích...
                </>
              ) : (
                "Phân tích"
              )}
            </Button>
          </div>
        </Card>
      )}

      {activeInput === "image" && (
        <Card className="p-4 animate-slide-up">
          <div className="space-y-3">
            <Label>Tải ảnh lên</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imageFile ? (
                  <div className="space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="text-sm text-gray-600">{imageFile.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">Nhấn để chọn ảnh</p>
                  </div>
                )}
              </label>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !imageFile}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang quét ảnh...
                </>
              ) : (
                "Quét ảnh"
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200 animate-slide-up" style={{ animationDelay: "500ms" }}>
        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Mẹo kiểm tra nhanh
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Luôn kiểm tra nguồn tin có đáng tin cậy không</span>
          </li>
          <li className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Xem ngày giờ đăng bài có hợp lý không</span>
          </li>
          <li className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>So sánh với nhiều nguồn tin khác nhau</span>
          </li>
        </ul>
      </Card>

      {/* Secondary Actions */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={onViewExamples}
          variant="outline"
          className="animate-fade-in"
          style={{ animationDelay: "600ms" }}
        >
          Xem ví dụ
        </Button>
        <Button
          onClick={onViewLessons}
          variant="outline"
          className="animate-fade-in"
          style={{ animationDelay: "700ms" }}
        >
          Học nhanh
        </Button>
      </div>
    </div>
  );
}

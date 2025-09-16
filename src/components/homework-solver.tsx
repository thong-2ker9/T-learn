import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Brain, Send, Upload, Image } from "lucide-react";
import ReactMarkdown from "react-markdown";
// thêm trợ lí gemini hehee
import { GoogleGenerativeAI } from "@google/generative-ai";

interface HomeworkSolverProps {
  onBack: () => void;
}

// 👉 Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCM6EK2GDSQAg-vy_qcH6NAONOndwjeQ3E");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export function HomeworkSolver({ onBack }: HomeworkSolverProps) {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const subjects = [
    { value: "math", label: "Toán học" },
    { value: "physics", label: "Vật lý" },
    { value: "chemistry", label: "Hóa học" },
    { value: "biology", label: "Sinh học" },
    { value: "literature", label: "Ngữ văn" },
    { value: "history", label: "Lịch sử" },
    { value: "geography", label: "Địa lý" },
    { value: "english", label: "Tiếng Anh" },
    { value: "other", label: "Môn khác" }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const solveProblem = async () => {
    if (!question.trim() && !uploadedImage) {
      alert("Vui lòng nhập câu hỏi hoặc upload hình ảnh!");
      return;
    }

    setIsLoading(true);
    setSolution("");

    try {
      const contents: any = [
        {
          role: "user",
          parts: [{ text: `Môn học: ${subject || "Chưa chọn"}\n\nĐề bài: ${question || "Xem ảnh bên dưới"}` }],
        }, 
      ];

      // Nếu có ảnh, thêm vào request
      if (uploadedImage) {
        contents[0].parts.push({
          inlineData: {
            mimeType: "image/png", // hoặc "image/jpeg" tùy file
            data: uploadedImage.split(",")[1], // bỏ "data:image/png;base64,"
          },
        });
      }

      const result = await model.generateContent({ contents });

      const aiResponse =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Xin lỗi, tôi chưa thể giải được bài tập này.";

      setSolution(aiResponse);
    } catch (error) {
      console.error(error);
      setSolution("Có lỗi xảy ra khi gọi Gemini API. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          ← Quay lại
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">AI Giải Bài Tập</h1>
          <p className="text-gray-600">Giải mọi bài tập mọi lĩnh vực với AI thông minh</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6 border-2 border-red-100">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold text-red-600">Nhập Bài Tập</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn môn học
                </label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="border-red-200 focus:border-red-400">
                    <SelectValue placeholder="Chọn môn học..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subj) => (
                      <SelectItem key={subj.value} value={subj.value}>
                        {subj.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập câu hỏi hoặc bài tập
                </label>
                <Textarea
                  placeholder="Nhập đề bài hoặc câu hỏi cần giải..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={8}
                  className="border-red-200 focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hoặc upload ảnh bài tập
                </label>
                <div className="border-2 border-dashed border-red-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-red-400" />
                    <span className="text-sm text-gray-600">
                      Click để upload ảnh bài tập
                    </span>
                  </label>
                </div>
              </div>

              {uploadedImage && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh đã upload:
                  </label>
                  <div className="border rounded-lg p-2">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded homework" 
                      className="max-w-full h-auto rounded"
                    />
                  </div>
                </div>
              )}

              <Button 
                onClick={solveProblem}
                disabled={isLoading || (!question.trim() && !uploadedImage)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full w-5 h-5 border-2 border-white border-t-transparent mr-2" />
                    Đang giải...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Giải Bài Tập
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Solution Section */}
          <Card className="p-6 border-2 border-red-100">
            <div className="flex items-center gap-2 mb-6">
              <Image className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold text-red-600">Lời Giải</h2>
            </div>

            <div className="min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full w-12 h-12 border-4 border-red-500 border-t-transparent mb-4" />
                  <p className="text-gray-600">Đang phân tích và giải bài tập...</p>
                </div>
              ) : solution ? (
                <div className="prose max-w-none text-gray-800 leading-relaxed">
                  <ReactMarkdown>{solution}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Brain className="w-16 h-16 mb-4 opacity-50" />
                  <p>Nhập câu hỏi và nhấn "Giải Bài Tập" để xem lời giải</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Brain, Send, Upload, Image, Calculator, BookOpen, Atom, FlaskConical,
  Languages, Globe, MapPin, Clock, Lightbulb, Zap, Stars, Sparkles, Rocket
} from "lucide-react";
import ReactMarkdown from "react-markdown";
// thêm cái này để đỡ bị lỗi phân số 
import 'katex/dist/katex.min.css'; // cần để KaTeX style
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';


// thêm trợ lí gemini hehee

import { GoogleGenerativeAI } from "@google/generative-ai";

interface HomeworkSolverProps {
  onBack: () => void;
}

// 👉 Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyDKwzIxGhtFLivCridRv7-BKU6N-834MHI");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export function HomeworkSolver({ onBack }: HomeworkSolverProps) {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const subjects = [
    { value: "math", label: "Toán học", icon: Calculator, color: "from-blue-500 to-purple-600" },
    { value: "physics", label: "Vật lý", icon: Atom, color: "from-green-500 to-teal-600" },
    { value: "chemistry", label: "Hóa học", icon: FlaskConical, color: "from-orange-500 to-red-600" },
    { value: "biology", label: "Sinh học", icon: BookOpen, color: "from-emerald-500 to-green-600" },
    { value: "literature", label: "Ngữ văn", icon: BookOpen, color: "from-pink-500 to-rose-600" },
    { value: "history", label: "Lịch sử", icon: Clock, color: "from-amber-500 to-orange-600" },
    { value: "geography", label: "Địa lý", icon: MapPin, color: "from-cyan-500 to-blue-600" },
    { value: "english", label: "Tiếng Anh", icon: Languages, color: "from-indigo-500 to-purple-600" },
    { value: "other", label: "Môn khác", icon: Globe, color: "from-violet-500 to-purple-600" }
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
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 via-orange-50 to-cyan-100 p-6 relative overflow-hidden">
      {/* Simple Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-16 text-3xl opacity-10">
          🧮
        </div>
        <div className="absolute top-32 right-20 text-2xl opacity-10">
          🔬
        </div>
        <div className="absolute top-1/4 left-8 text-2xl opacity-10">
          📐
        </div>
        <div className="absolute top-3/4 right-16 text-2xl opacity-10">
          💡
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50/50 backdrop-blur-sm"
        >
          ← Quay lại
        </Button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="flex gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <Rocket className="w-6 h-6 text-blue-500" />
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
            🌟 AI Giải Bài Tập Thông Minh 🌟
          </h1>
          <p className="text-gray-600 text-lg">Giải mọi bài tập mọi lĩnh vực với trí tuệ nhân tạo siêu thông minh!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-white/80 to-purple-50/50 backdrop-blur-sm shadow-xl animate-card-appear">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                💭 Nhập Bài Tập
              </h2>
              <Sparkles className="w-5 h-5 text-yellow-500 sparkle-animation" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn môn học
                </label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400 bg-white/50">
                    <SelectValue placeholder="🎯 Chọn môn học..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subj) => {
                      const IconComponent = subj.icon;
                      return (
                        <SelectItem key={subj.value} value={subj.value}>
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded bg-gradient-to-r ${subj.color}`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            {subj.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập câu hỏi hoặc bài tập
                </label>
                <Textarea
                  placeholder="✍️ Nhập đề bài hoặc câu hỏi cần giải..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={8}
                  className="border-purple-200 focus:border-purple-400 bg-white/50 focus:bg-white/70 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hoặc upload ảnh bài tập
                </label>
                <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center hover:border-purple-300 transition-all duration-300 bg-gradient-to-br from-purple-50/30 to-pink-50/30 hover:from-purple-50/50 hover:to-pink-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2 group"
                  >
                    <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                      📸 Click để upload ảnh bài tập
                    </span>
                    <div className="flex gap-1 mt-1">
                      <Stars className="w-4 h-4 text-yellow-500 sparkle-animation" />
                      <Stars className="w-4 h-4 text-pink-500 sparkle-animation" style={{ animationDelay: "0.5s" }} />
                      <Stars className="w-4 h-4 text-blue-500 sparkle-animation" style={{ animationDelay: "1s" }} />
                    </div>
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
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-button-explode"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full w-5 h-5 border-2 border-white border-t-transparent" />
                      <Sparkles className="w-5 h-5 sparkle-animation" />
                      <span>🤖 AI đang suy nghĩ...</span>
                      <Brain className="w-5 h-5 gentle-pulse" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      <span>🚀 Giải Bài Tập Ngay!</span>
                      <Zap className="w-5 h-5" />
                    </div>
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Solution Section */}
          <Card className="p-6 border-2 border-orange-200 bg-gradient-to-br from-white/80 to-orange-50/50 backdrop-blur-sm shadow-xl animate-card-appear" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                🎯 Lời Giải Chi Tiết
              </h2>
              <Lightbulb className="w-5 h-5 text-yellow-500 twinkle-animation" />
            </div>

            <div className="min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="relative">
                    <div className="animate-spin rounded-full w-16 h-16 border-4 border-gradient-to-r from-purple-500 to-pink-500 border-t-transparent mb-4" />
                    <div className="absolute inset-2 animate-pulse">
                      <Brain className="w-8 h-8 text-purple-500 mx-auto" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Sparkles className="w-5 h-5 sparkle-animation" />
                    <p>🤖 AI đang phân tích và giải bài tập...</p>
                    <Sparkles className="w-5 h-5 sparkle-animation" style={{ animationDelay: "0.5s" }} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              ) : solution ? (
                <div className="prose max-w-none text-gray-800 leading-relaxed animate-dictionary-entry">
                  <div className="mb-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-green-500 rounded-full">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-green-700">✅ Lời giải từ AI:</span>
                    </div>
                  </div>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {solution.replace(/\\\\/g, '\\').replace(/\$\$/g, '$$$$')}
                  </ReactMarkdown>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="relative mb-6">
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
                      <Brain className="w-16 h-16 text-purple-400 gentle-pulse" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="w-6 h-6 text-yellow-500 sparkle-animation" />
                    </div>
                  </div>
                  <p className="text-center text-lg">
                    🤔 Nhập câu hỏi và nhấn 
                    <span className="text-purple-600 font-semibold">" 🚀 Giải Bài Tập Ngay!"</span> 
                    <br />để xem lời giải chi tiết
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Stars className="w-5 h-5 text-yellow-500 twinkle-animation" />
                    <Stars className="w-5 h-5 text-pink-500 twinkle-animation" style={{ animationDelay: "0.5s" }} />
                    <Stars className="w-5 h-5 text-blue-500 twinkle-animation" style={{ animationDelay: "1s" }} />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

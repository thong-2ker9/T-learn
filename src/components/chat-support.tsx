import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { MessageCircle, Send, User, Bot } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";


interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSupportProps {
  onBack: () => void;
}

// 👉 Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCM6EK2GDSQAg-vy_qcH6NAONOndwjeQ3E");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export function ChatSupport({ onBack }: ChatSupportProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý AI hỗ trợ tâm lý và học tập. Tôi có thể giúp bạn với:\n\n• Áp lực học tập\n• Stress trước kỳ thi\n• Động lực học tập\n• Quản lý thời gian\n• Tâm lý học đường\n• Các vấn đề khác liên quan đến học tập\n\nHãy chia sẻ với tôi những gì bạn đang lo lắng nhé!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { 
                text: `Bạn là một trợ lý AI tâm lý học đường. 
          Nhiệm vụ của bạn:
          - Đầu tiên phải xưng hô bằng tớ và cậu, không được xưng hô bằng tôi và bạn.Sau đó khuyên bạn hãy vui lên rồi mới kể câu chuyện.
          - Khuyên tiếp là xung quanh bạn còn nhiều người thân,cha mẹ, bạn bè, thầy cô luôn sẵn sàng lắng nghe và giúp đỡ bạn.
          - kể 1 câu chuyện ngắn (2-3 câu) về 1 học sinh gặp vấn đề tương tự để tạo sự đồng cảm.
          - khuyên học sinh cách giải quyết vấn đề.
          - Nếu học sinh có dấu hiệu trầm cảm nặng, hãy khuyên tìm đến thầy cô hoặc chuyên gia phù hợp.
          - Luôn đặt sự an toàn và sức khỏe tinh thần của học sinh lên hàng đầu.
          - Câu trả lời phải ngắn gọn, súc tích, dễ hiểu, không
          - Nói ít hiểu nhiều, trả lời đúng trọng tâm câu hỏi.
          - Luôn nói chuyện nhẹ nhàng, tích cực, đồng cảm.
          - Giúp học sinh giảm căng thẳng, có động lực học tập.
          - Nếu câu hỏi liên quan đến học tập, hãy đưa lời khuyên khoa học và thực tế.
          - Nếu câu hỏi vượt ngoài phạm vi (ví dụ: pháp luật, y tế nặng), hãy khuyên tìm đến thầy cô hoặc chuyên gia phù hợp.
          - Luôn trả lời bằng tiếng Việt, giọng thân thiện và dễ hiểu.
          Đây là câu hỏi của học sinh: "${inputMessage}"`
 }],
          },
        ],
      });

      // Lấy text từ response
      const aiResponse =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Xin lỗi, tôi chưa có phản hồi cho câu hỏi này.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Xin lỗi, có lỗi xảy ra khi kết nối với Gemini API. Vui lòng thử lại.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
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

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-red-600 mb-2">
            AI Hỗ Trợ Tâm Lý
          </h1>
          <p className="text-gray-600">
            Trò chuyện và giải quyết các vấn đề tâm lý học đường
          </p>
        </div>

        <Card className="h-[600px] border-2 border-red-100 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-red-50 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-700">
                  Trợ Lý Tâm Lý AI
                </h3>
                <p className="text-sm text-red-500">
                  Luôn sẵn sàng lắng nghe và hỗ trợ bạn
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] flex gap-3 ${
                    message.role === "user"
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-red-500"
                        : "bg-red-100"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="prose max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown> 
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-red-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) =>
                  setInputMessage(e.target.value)
                }
                onKeyPress={handleKeyPress}
                placeholder="Chia sẻ suy nghĩ, cảm xúc hoặc vấn đề của bạn..."
                className="flex-1 border-red-200 focus:border-red-400"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-red-500 hover:bg-red-600 text-white px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 


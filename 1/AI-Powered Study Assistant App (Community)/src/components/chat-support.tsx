import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { 
  MessageCircle, Send, User, Bot, ArrowLeft, Heart, Lightbulb, 
  Star, Sparkles, Smile, Frown, Meh, Eye, Headphones
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { EducationalBackground } from "./educational-background";
import { toast } from "sonner@2.0.3";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSupportProps {
  onBack: () => void;
}

interface QuickReply {
  id: string;
  text: string;
  emoji: string;
  category: "positive" | "negative" | "neutral" | "share";
}

const quickReplies: QuickReply[] = [
  // 🌱 Nhóm cảm xúc tích cực
  { id: "1", text: "Hôm nay mình thấy khá vui 😆", emoji: "😆", category: "positive" },
  { id: "2", text: "Tâm trạng thoải mái, nhẹ nhàng ✨", emoji: "✨", category: "positive" },
  { id: "3", text: "Mình thấy hứng khởi, có nhiều năng lượng 🔥", emoji: "🔥", category: "positive" },
  
  // 🌧️ Nhóm cảm xúc tiêu cực
  { id: "4", text: "Nay mình buồn, không có động lực 😞", emoji: "😞", category: "negative" },
  { id: "5", text: "Mình bị la/áp lực từ gia đình 😔", emoji: "😔", category: "negative" },
  { id: "6", text: "Mình cảm thấy lo lắng, bất an 😬", emoji: "😬", category: "negative" },
  { id: "7", text: "Nay mình không khỏe trong người 🤒", emoji: "🤒", category: "negative" },
  
  // 😶 Nhóm trung tính / khó diễn đạt
  { id: "8", text: "Thật sự mình không biết cảm xúc của mình ra sao 🌀", emoji: "🌀", category: "neutral" },
  { id: "9", text: "Mọi thứ bình thường thôi, không có gì đặc biệt 💤", emoji: "💤", category: "neutral" },
  { id: "10", text: "Mình hơi mệt nhưng cũng không quá tệ 😐", emoji: "😐", category: "neutral" },
  
  // ❤️ Nhóm chia sẻ thêm
  { id: "11", text: "Mình muốn kể về một chuyện xảy ra hôm nay 📖", emoji: "📖", category: "share" },
  { id: "12", text: "Mình cần ai đó lắng nghe 👂", emoji: "👂", category: "share" },
  { id: "13", text: "Có thể gợi ý cho mình cách để vui hơn không? 🌈", emoji: "🌈", category: "share" }
];

// Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyD0DNv-Qn-53yKnYhTxIW5CGdjLF-rraGs");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export function ChatSupport({ onBack }: ChatSupportProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Chào cậu! 🌸 Tớ là Mind AI, luôn sẵn sàng lắng nghe và đồng hành cùng cậu qua mọi cảm xúc trong cuộc sống. Cậu có muốn chia sẻ gì với tớ không? 💫",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setShowQuickReplies(false);

    try {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Bạn là Mind AI - một trợ lý AI tâm lý học đường thân thiện và ấm áp. 
          
          Nhiệm vụ của bạn:
          - Xưng hô bằng "tớ" và "cậu" một cách thân thiện
          - Luôn bắt đầu bằng lời động viên tích cực và ấm áp
          - Nhắc nhở rằng xung quanh cậu còn có gia đình, bạn bè, thầy cô luôn sẵn sàng lắng nghe
          - Đưa ra lời khuyên thiết thực, tập trung vào sức khỏe tinh thần và giải pháp tích cực
          - Nếu phát hiện dấu hiệu trầm cảm nghiêm trọng, khuyên cậu tìm sự hỗ trợ từ thầy cô hoặc chuyên gia
          - Luôn nhẹ nhàng, tích cực, súc tích nhưng đầy ý nghĩa
          - Sử dụng emoji phù hợp để tạo không khí ấm áp
          - Kết thúc với câu hỏi mở để khuyến khích cậu chia sẻ thêm

          Trả lời bằng tiếng Việt với giọng điệu của một người bạn thân thiết.
          
          Đây là chia sẻ của học sinh: "${messageToSend}"`,
              },
            ],
          },
        ],
      });

      const aiResponse =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Tớ hiểu cảm xúc của cậu... Hãy cho tớ một chút thời gian để suy nghĩ cách hỗ trợ cậu tốt nhất nhé! 💝";

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
        content: "Ôi không! Có chút vấn đề kỹ thuật... Nhưng tớ vẫn ở đây lắng nghe cậu! Hãy thử lại nhé 🌟",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Có lỗi xảy ra khi kết nối AI");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.text);
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

  const filterRepliesByCategory = (category: string) => {
    return quickReplies.filter(reply => reply.category === category);
  };

  return (
    <div className="min-h-screen bg-background">
      <EducationalBackground variant="secondary" />
      
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button 
            onClick={onBack}
            variant="outline" 
            size="icon"
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-emerald-700">
                Mind AI
              </h1>
              <p className="text-gray-600 hidden sm:block">
                AI trò chuyện hỗ trợ cảm xúc, tìm niềm vui trong cuộc sống
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Chat Area - Shows first on mobile */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card className="h-[60vh] sm:h-[70vh] lg:h-[calc(100vh-200px)] flex flex-col shadow-xl">
              {/* Chat Header */}
              <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      Mind AI - Trợ lý tâm lý thân thiện
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="truncate">Đang online, luôn sẵn sàng lắng nghe bạn</span>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-100">
                      <Headphones className="w-4 h-4 mr-2" />
                      Đang lắng nghe
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 sm:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] sm:max-w-[80%] ${message.role === "user" ? "order-1" : ""}`}>
                      <div
                        className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                            : "bg-card border"
                        }`}
                      >
                        <div className="prose prose-sm sm:prose max-w-none">
                          <ReactMarkdown
                            className={`${
                              message.role === "user" 
                                ? "text-white [&>*]:text-white" 
                                : "text-foreground"
                            }`}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        <p
                          className={`text-xs mt-2 sm:mt-3 ${
                            message.role === "user"
                              ? "text-emerald-100"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 sm:gap-4 justify-start">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md flex-shrink-0">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="bg-card border rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span className="text-sm text-emerald-600 ml-2">Mind AI đang suy nghĩ...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 sm:p-6 border-t bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
                <div className="flex gap-2 sm:gap-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Chia sẻ cảm xúc, suy nghĩ của bạn với Mind AI..."
                    className="flex-1 border-emerald-200 focus:border-emerald-400 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-emerald-500" />
                    <span className="hidden sm:inline">Hỗ trợ tâm lý 24/7</span>
                    <span className="sm:hidden">24/7</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-500" />
                    <span className="hidden sm:inline">AI thông minh và thấu hiểu</span>
                    <span className="sm:hidden">AI thông minh</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-blue-500" />
                    <span className="hidden sm:inline">Bảo mật tuyệt đối</span>
                    <span className="sm:hidden">Bảo mật</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Replies Sidebar - Shows second on mobile */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="shadow-xl bg-gradient-to-b from-emerald-50/80 to-teal-50/80 backdrop-blur-sm lg:h-full">
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Cảm xúc hôm nay</h3>
                </div>

                {showQuickReplies && (
                  <div className="space-y-4 max-h-96 lg:max-h-none overflow-y-auto lg:overflow-visible">
                    {/* 🌱 Nhóm tích cực */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-xs">🌱</span>
                        </div>
                        <span className="text-sm font-medium text-emerald-700">Cảm xúc tích cực</span>
                      </div>
                      <div className="space-y-2">
                        {filterRepliesByCategory("positive").map((reply) => (
                          <button
                            key={reply.id}
                            onClick={() => handleQuickReply(reply)}
                            className="w-full text-left p-3 rounded-xl border text-sm transition-all hover:shadow-md bg-white/80 hover:bg-white border-emerald-200 hover:border-emerald-300 text-emerald-800 active:scale-95 sm:hover:scale-105"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg flex-shrink-0">{reply.emoji}</span>
                              <span className="flex-1 leading-relaxed">{reply.text}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 🌧️ Nhóm tiêu cực */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs">🌧️</span>
                        </div>
                        <span className="text-sm font-medium text-blue-700">Cảm xúc tiêu cực</span>
                      </div>
                      <div className="space-y-2">
                        {filterRepliesByCategory("negative").map((reply) => (
                          <button
                            key={reply.id}
                            onClick={() => handleQuickReply(reply)}
                            className="w-full text-left p-3 rounded-xl border text-sm transition-all hover:shadow-md bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-800 active:scale-95 sm:hover:scale-105"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg flex-shrink-0">{reply.emoji}</span>
                              <span className="flex-1 leading-relaxed">{reply.text}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 😶 Nhóm trung tính */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-xs">😶</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Trung tính / khó diễn đạt</span>
                      </div>
                      <div className="space-y-2">
                        {filterRepliesByCategory("neutral").map((reply) => (
                          <button
                            key={reply.id}
                            onClick={() => handleQuickReply(reply)}
                            className="w-full text-left p-3 rounded-xl border text-sm transition-all hover:shadow-md bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300 text-gray-800 active:scale-95 sm:hover:scale-105"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg flex-shrink-0">{reply.emoji}</span>
                              <span className="flex-1 leading-relaxed">{reply.text}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ❤️ Nhóm chia sẻ */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                          <span className="text-xs">❤️</span>
                        </div>
                        <span className="text-sm font-medium text-pink-700">Chia sẻ thêm</span>
                      </div>
                      <div className="space-y-2">
                        {filterRepliesByCategory("share").map((reply) => (
                          <button
                            key={reply.id}
                            onClick={() => handleQuickReply(reply)}
                            className="w-full text-left p-3 rounded-xl border text-sm transition-all hover:shadow-md bg-white/80 hover:bg-white border-pink-200 hover:border-pink-300 text-pink-800 active:scale-95 sm:hover:scale-105"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg flex-shrink-0">{reply.emoji}</span>
                              <span className="flex-1 leading-relaxed">{reply.text}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!showQuickReplies && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Đang trong cuộc trò chuyện...
                    </p>
                    <Button
                      onClick={() => setShowQuickReplies(true)}
                      variant="outline"
                      size="sm"
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    >
                      Hiện gợi ý cảm xúc
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
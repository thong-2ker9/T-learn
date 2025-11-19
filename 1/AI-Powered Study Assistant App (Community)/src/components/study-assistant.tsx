import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Upload, FileText, Video, Send, Download, Trash2, MessageCircle, 
  BookOpen, ArrowLeft, Play, FileUp, Link, Brain, Sparkles, 
  Settings, Users, Mic, Search, Filter, MoreVertical, Copy, Star,
  Clock, CheckCircle, AlertCircle, Loader2, Youtube, FileImage,
  Lightbulb, Target, FileCheck, Zap, Globe, Headphones, Eye,
  ChevronDown, RotateCw, Share, Bookmark, Hash, Layers
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { EducationalBackground } from "./educational-background";
import { toast } from "sonner@2.0.3";

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'text' | 'youtube';
  content: string;
  url?: string;
  uploadDate: Date;
  processed: boolean;
  summary?: string;
  notes?: string;
  flashcards?: Array<{question: string, answer: string}>;
  quiz?: Array<{question: string, options: string[], correct: number}>;
  keyTopics?: string[];
  estimatedReadTime?: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  documentId?: string;
}

interface StudyAssistantProps {
  onBack: () => void;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyD0DNv-Qn-53yKnYhTxIW5CGdjLF-rraGs");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export function StudyAssistant({ onBack }: StudyAssistantProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedDocs = localStorage.getItem('studyDocuments');
    if (savedDocs) {
      try {
        const parsed = JSON.parse(savedDocs).map((doc: any) => ({
          ...doc,
          uploadDate: new Date(doc.uploadDate)
        }));
        setDocuments(parsed);
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    }

    const savedMessages = localStorage.getItem('studyChatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setChatMessages(parsed);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  }, []);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // Save data to localStorage
  const saveDocuments = (newDocs: Document[]) => {
    setDocuments(newDocs);
    localStorage.setItem('studyDocuments', JSON.stringify(newDocs));
  };

  const saveChatMessages = (newMessages: ChatMessage[]) => {
    setChatMessages(newMessages);
    localStorage.setItem('studyChatMessages', JSON.stringify(newMessages));
  };

  // Extract YouTube video ID
  const extractYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Handle YouTube upload
  const handleYouTubeUpload = async () => {
    if (!youtubeUrl.trim()) {
      toast.error('Vui lòng nhập URL YouTube!');
      return;
    }

    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      toast.error('URL YouTube không hợp lệ!');
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      name: `YouTube Video - ${videoId}`,
      type: 'youtube',
      content: `Video YouTube: ${youtubeUrl}\n\nNội dung: Đây là một video học tập từ YouTube. AI sẽ phân tích và tạo tóm tắt, ghi chú, flashcards dựa trên thông tin từ video này.`,
      url: youtubeUrl,
      uploadDate: new Date(),
      processed: false
    };

    const newDocs = [newDoc, ...documents];
    saveDocuments(newDocs);
    setYoutubeUrl("");
    toast.success('Đã thêm video YouTube!');
    
    // Auto process the document
    processDocument(newDoc);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File quá lớn! Vui lòng chọn file nhỏ hơn 50MB.');
      return;
    }

    let fileType: 'pdf' | 'video' | 'text' = 'text';
    
    if (file.type.includes('pdf')) {
      fileType = 'pdf';
    } else if (file.type.includes('video')) {
      fileType = 'video';
    } else if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      fileType = 'text';
    } else {
      toast.error('Loại file không được hỗ trợ! Vui lòng chọn PDF, video hoặc file text.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: fileType,
        content: fileType === 'text' ? content : `File ${fileType}: ${file.name}\n\nNội dung đã được upload thành công. AI sẽ phân tích và tạo tóm tắt, ghi chú, flashcards từ nội dung này.`,
        uploadDate: new Date(),
        processed: false
      };

      const newDocs = [newDoc, ...documents];
      saveDocuments(newDocs);
      toast.success('Upload thành công!');
      
      // Auto process the document
      processDocument(newDoc);
    };

    if (fileType === 'text') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Process document with Gemini AI
  const processDocument = async (doc: Document) => {
    setIsProcessing(true);
    setActiveDocument(doc);
    
    try {
      toast.info('AI đang phân tích tài liệu...');

      // Create comprehensive prompts
      const summaryPrompt = `Hãy tóm tắt nội dung sau một cách chi tiết và có cấu trúc bằng tiếng Việt:

${doc.content}

Yêu cầu:
- Tóm tắt đầy đủ các ý chính
- Sử dụng markdown để format
- Highlight các điểm quan trọng
- Thêm emoji phù hợp`;

      const notesPrompt = `Tạo ghi chú học tập chi tiết từ nội dung sau bằng tiếng Việt:

${doc.content}

Yêu cầu:
- Chia thành các phần rõ ràng
- Liệt kê các khái niệm quan trọng
- Thêm ví dụ và giải thích
- Gợi ý cách học hiệu quả`;

      const flashcardsPrompt = `Tạo 8 flashcards từ nội dung sau. Trả về JSON array với format:
[{"question": "Câu hỏi", "answer": "Câu trả lời"}]

Nội dung: ${doc.content}

Lưu ý: Câu hỏi ngắn gọn, câu trả lời đầy đủ`;

      const quizPrompt = `Tạo 6 câu hỏi trắc nghiệm từ nội dung sau. Trả về JSON array với format:
[{"question": "Câu hỏi?", "options": ["A", "B", "C", "D"], "correct": 0}]

Nội dung: ${doc.content}

Lưu ý: Các đáp án phải hợp lý và có tính nhiễu`;

      // Process all components
      const [summaryResult, notesResult, flashcardsResult, quizResult] = await Promise.all([
        model.generateContent(summaryPrompt),
        model.generateContent(notesPrompt),
        model.generateContent(flashcardsPrompt),
        model.generateContent(quizPrompt)
      ]);

      const summary = summaryResult.response.text();
      const notes = notesResult.response.text();
      
      let flashcards: Array<{question: string, answer: string}> = [];
      try {
        const flashcardsText = flashcardsResult.response.text();
        const cleanedText = flashcardsText.replace(/```json\n?|\n?```/g, '').trim();
        flashcards = JSON.parse(cleanedText);
      } catch (error) {
        console.error('Error parsing flashcards:', error);
        flashcards = [
          { question: "Chủ đề chính của tài liệu là gì?", answer: "Xem tóm tắt để biết thêm chi tiết" },
          { question: "Ý chính quan trọng nhất?", answer: "Xem ghi chú để tìm hiểu thêm" }
        ];
      }

      let quiz: Array<{question: string, options: string[], correct: number}> = [];
      try {
        const quizText = quizResult.response.text();
        const cleanedText = quizText.replace(/```json\n?|\n?```/g, '').trim();
        quiz = JSON.parse(cleanedText);
      } catch (error) {
        console.error('Error parsing quiz:', error);
        quiz = [
          {
            question: "Tài liệu này thuộc chủ đề nào?",
            options: ["Khoa học", "Văn học", "Toán học", "Khác"],
            correct: 3
          }
        ];
      }

      const updatedDoc = {
        ...doc,
        processed: true,
        summary,
        notes,
        flashcards,
        quiz,
        keyTopics: ["Chủ đề chính", "Kiến thức cơ bản", "Ứng dụng thực tế"],
        estimatedReadTime: Math.ceil(doc.content.length / 1000)
      };

      const updatedDocs = documents.map(d => 
        d.id === doc.id ? updatedDoc : d
      );
      
      saveDocuments(updatedDocs);
      setActiveDocument(updatedDoc);
      toast.success('Phân tích hoàn thành!');

    } catch (error) {
      console.error('Error processing document:', error);
      toast.error('Có lỗi xảy ra khi phân tích. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Send message to AI
  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeDocument) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      documentId: activeDocument.id
    };

    const newMessages = [...chatMessages, userMessage];
    saveChatMessages(newMessages);
    setInputMessage("");
    setIsChatLoading(true);

    try {
      const prompt = `Bạn là một trợ lý AI học tập thông minh và thân thiện. Hãy trả lời câu hỏi dựa trên tài liệu sau:

TÀI LIỆU: ${activeDocument.name}
TÓM TẮT: ${activeDocument.summary || 'Chưa có tóm tắt'}

CÂU HỎI: ${inputMessage}

Yêu cầu:
- Trả lời bằng tiếng Việt, dễ hiểu
- Giải thích step-by-step nếu cần
- Sử dụng markdown để format
- Thêm emoji phù hợp
- Kết nối với nội dung tài liệu`;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        documentId: activeDocument.id
      };

      const finalMessages = [...newMessages, assistantMessage];
      saveChatMessages(finalMessages);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "❌ Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        timestamp: new Date(),
        documentId: activeDocument.id
      };
      saveChatMessages([...newMessages, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const deleteDocument = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      const newDocs = documents.filter(doc => doc.id !== id);
      saveDocuments(newDocs);
      
      if (activeDocument?.id === id) {
        setActiveDocument(null);
      }

      const newMessages = chatMessages.filter(msg => msg.documentId !== id);
      saveChatMessages(newMessages);
      toast.success('Đã xóa tài liệu!');
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'youtube': return Youtube;
      case 'text': return BookOpen;
      default: return FileText;
    }
  };

  const getFilteredChatMessages = () => {
    return activeDocument 
      ? chatMessages.filter(msg => msg.documentId === activeDocument.id)
      : [];
  };

  const filteredMessages = getFilteredChatMessages();

  // Flashcard navigation
  const nextFlashcard = () => {
    if (activeDocument?.flashcards) {
      setCurrentFlashcard((prev) => (prev + 1) % activeDocument.flashcards!.length);
      setShowAnswer(false);
    }
  };

  const prevFlashcard = () => {
    if (activeDocument?.flashcards) {
      setCurrentFlashcard((prev) => prev === 0 ? activeDocument.flashcards!.length - 1 : prev - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <EducationalBackground variant="secondary" />
      
      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-6">
        {/* Header - Mobile Responsive */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button 
            onClick={onBack}
            variant="outline" 
            size="icon"
            className="shrink-0 w-10 h-10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
                AI Study Assistant
              </h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Tải tài liệu và học cùng AI thông minh</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Left Sidebar - Documents */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm lg:h-[calc(100vh-200px)]">
              <div className="p-3 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800">Tài liệu</h2>
                  <div className="text-xs text-gray-500">
                    {documents.length} files
                  </div>
                </div>

                {/* Upload Options */}
                <div className="space-y-3 mb-4">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.mp4,.avi,.mov,.txt,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="YouTube URL..."
                      className="flex-1 text-xs sm:text-sm"
                    />
                    <Button 
                      size="sm"
                      onClick={handleYouTubeUpload}
                      disabled={!youtubeUrl.trim()}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Youtube className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>

                {/* Documents List */}
                <div className="max-h-80 lg:max-h-none overflow-y-auto">
                  {documents.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-xs sm:text-sm">
                        Chưa có tài liệu nào
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {documents.map((doc) => {
                        const IconComponent = getDocumentIcon(doc.type);
                        return (
                          <div
                            key={doc.id}
                            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                              activeDocument?.id === doc.id
                                ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-md'
                                : 'bg-gray-50/80 border-gray-200 hover:border-purple-200'
                            }`}
                            onClick={() => setActiveDocument(doc)}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className={`p-1.5 sm:p-2 rounded-lg ${
                                doc.type === 'youtube' ? 'bg-red-100' : 
                                doc.type === 'pdf' ? 'bg-orange-100' :
                                doc.type === 'video' ? 'bg-blue-100' : 'bg-green-100'
                              }`}>
                                <IconComponent className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  doc.type === 'youtube' ? 'text-red-600' :
                                  doc.type === 'pdf' ? 'text-orange-600' :
                                  doc.type === 'video' ? 'text-blue-600' : 'text-green-600'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                                  {doc.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {doc.uploadDate.toLocaleDateString('vi-VN')}
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 mt-1">
                                  <div className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                    doc.processed 
                                      ? 'bg-green-100 text-green-700' 
                                      : isProcessing && activeDocument?.id === doc.id
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {doc.processed ? (
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                                        <span className="hidden sm:inline">Processed</span>
                                        <span className="sm:hidden">✓</span>
                                      </div>
                                    ) : isProcessing && activeDocument?.id === doc.id ? (
                                      <div className="flex items-center gap-1">
                                        <Loader2 className="w-2 h-2 sm:w-3 sm:h-3 animate-spin" />
                                        <span className="hidden sm:inline">Processing</span>
                                        <span className="sm:hidden">...</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                                        <span className="hidden sm:inline">Pending</span>
                                        <span className="sm:hidden">○</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteDocument(doc.id);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {activeDocument ? (
              <Card className="h-[60vh] sm:h-[70vh] lg:h-[calc(100vh-200px)] border-0 shadow-xl bg-white/90 backdrop-blur-sm flex flex-col">
                {/* Document Header */}
                <div className="p-3 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${
                        activeDocument.type === 'youtube' ? 'bg-red-100' : 
                        activeDocument.type === 'pdf' ? 'bg-orange-100' :
                        activeDocument.type === 'video' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {(() => {
                          const IconComponent = getDocumentIcon(activeDocument.type);
                          return <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            activeDocument.type === 'youtube' ? 'text-red-600' :
                            activeDocument.type === 'pdf' ? 'text-orange-600' :
                            activeDocument.type === 'video' ? 'text-blue-600' : 'text-green-600'
                          }`} />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                          {activeDocument.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {activeDocument.uploadDate.toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    {!activeDocument.processed && (
                      <Button
                        onClick={() => processDocument(activeDocument)}
                        disabled={isProcessing}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-xs sm:text-sm"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                            <span className="hidden sm:inline">Đang xử lý...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Xử lý AI</span>
                            <span className="sm:hidden">AI</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Navigation Tabs */}
                  <div className="flex items-center gap-1 mt-3 sm:mt-4 p-1 bg-gray-100 rounded-lg overflow-x-auto">
                    {[
                      { id: 'chat', label: 'Trò chuyện', icon: MessageCircle },
                      { id: 'summary', label: 'Tóm tắt', icon: FileText },
                      { id: 'notes', label: 'Ghi chú', icon: BookOpen },
                      { id: 'flashcards', label: 'Thẻ nhớ', icon: Lightbulb },
                      { id: 'quiz', label: 'Kiểm tra', icon: Target }
                    ].map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === tab.id
                              ? 'bg-white text-purple-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                  {/* Chat Tab */}
                  {activeTab === 'chat' && (
                    <div className="h-full flex flex-col">
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
                        {filteredMessages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-3 sm:mb-4">
                              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                            </div>
                            <h3 className="text-sm sm:text-base font-semibold mb-2">Bắt đầu trò chuyện</h3>
                            <p className="text-center text-xs sm:text-sm">
                              Hỏi AI về nội dung tài liệu để hiểu sâu hơn
                            </p>
                            {!activeDocument.processed && (
                              <p className="text-xs text-orange-500 mt-2">
                                Vui lòng xử lý tài liệu trước khi chat
                              </p>
                            )}
                          </div>
                        ) : (
                          <>
                            {filteredMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                                    message.role === 'user'
                                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                  </div>
                                  <p
                                    className={`text-xs mt-2 ${
                                      message.role === 'user' ? 'text-purple-100' : 'text-gray-500'
                                    }`}
                                  >
                                    {message.timestamp.toLocaleTimeString('vi-VN', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            ))}

                            {isChatLoading && (
                              <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Chat Input */}
                      <div className="p-3 sm:p-6 border-t border-gray-100">
                        <div className="flex gap-2 sm:gap-3">
                          <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder="Hỏi AI về nội dung tài liệu..."
                            className="flex-1 border-purple-200 focus:border-purple-400 rounded-xl text-sm sm:text-base"
                            disabled={isChatLoading || !activeDocument.processed}
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isChatLoading || !activeDocument.processed}
                            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl px-4 sm:px-6"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary Tab */}
                  {activeTab === 'summary' && (
                    <div className="h-full overflow-y-auto p-3 sm:p-6">
                      {activeDocument.processed && activeDocument.summary ? (
                        <div className="prose prose-sm sm:prose max-w-none">
                          <ReactMarkdown className="text-sm sm:text-base leading-relaxed">
                            {activeDocument.summary}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center mb-3 sm:mb-4">
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold mb-2">Chưa có tóm tắt</h3>
                          <p className="text-center text-xs sm:text-sm">
                            Nhấn "Xử lý AI" để tạo tóm tắt thông minh
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === 'notes' && (
                    <div className="h-full overflow-y-auto p-3 sm:p-6">
                      {activeDocument.processed && activeDocument.notes ? (
                        <div className="prose prose-sm sm:prose max-w-none">
                          <ReactMarkdown className="text-sm sm:text-base leading-relaxed">
                            {activeDocument.notes}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center mb-3 sm:mb-4">
                            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold mb-2">Chưa có ghi chú</h3>
                          <p className="text-center text-xs sm:text-sm">
                            AI sẽ tạo ghi chú học tập chi tiết sau khi xử lý
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Flashcards Tab */}
                  {activeTab === 'flashcards' && (
                    <div className="h-full flex flex-col p-3 sm:p-6">
                      {activeDocument.processed && activeDocument.flashcards && activeDocument.flashcards.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                              Thẻ nhớ ({currentFlashcard + 1}/{activeDocument.flashcards.length})
                            </h3>
                            <div className="flex gap-2">
                              <Button onClick={prevFlashcard} variant="outline" size="sm">
                                ←
                              </Button>
                              <Button onClick={nextFlashcard} variant="outline" size="sm">
                                →
                              </Button>
                            </div>
                          </div>

                          <div className="flex-1 flex items-center justify-center">
                            <Card 
                              className="w-full max-w-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => setShowAnswer(!showAnswer)}
                            >
                              <div className="text-center">
                                <div className="text-xs sm:text-sm text-purple-600 font-medium mb-3">
                                  {showAnswer ? 'Câu trả lời' : 'Câu hỏi'}
                                </div>
                                <div className="text-sm sm:text-lg font-medium mb-4">
                                  {showAnswer 
                                    ? activeDocument.flashcards[currentFlashcard].answer
                                    : activeDocument.flashcards[currentFlashcard].question
                                  }
                                </div>
                                <div className="text-xs text-gray-500">
                                  {showAnswer ? 'Nhấn để xem câu hỏi' : 'Nhấn để xem câu trả lời'}
                                </div>
                              </div>
                            </Card>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center justify-center mb-3 sm:mb-4">
                            <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold mb-2">Chưa có thẻ nhớ</h3>
                          <p className="text-center text-xs sm:text-sm">
                            AI sẽ tạo flashcards để ôn tập hiệu quả
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quiz Tab */}
                  {activeTab === 'quiz' && (
                    <div className="h-full overflow-y-auto p-3 sm:p-6">
                      {activeDocument.processed && activeDocument.quiz && activeDocument.quiz.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                          {activeDocument.quiz.map((question, index) => (
                            <Card key={index} className="p-4 sm:p-6 border-2 border-gray-100">
                              <div className="mb-3 sm:mb-4">
                                <div className="text-xs sm:text-sm font-medium text-purple-600 mb-2">Câu {index + 1}</div>
                                <div className="text-sm sm:text-lg font-semibold text-gray-800">{question.question}</div>
                              </div>
                              <div className="space-y-2">
                                {question.options.map((option, optIndex) => (
                                  <div 
                                    key={optIndex}
                                    className={`p-3 rounded-lg border transition-colors ${
                                      optIndex === question.correct 
                                        ? 'bg-green-50 border-green-200 text-green-800' 
                                        : 'bg-gray-50 border-gray-200 text-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                                        optIndex === question.correct
                                          ? 'bg-green-500 border-green-500 text-white'
                                          : 'border-gray-300 text-gray-500'
                                      }`}>
                                        {String.fromCharCode(65 + optIndex)}
                                      </div>
                                      <span className="text-sm sm:text-base">{option}</span>
                                      {optIndex === question.correct && (
                                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-3 sm:mb-4">
                            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold mb-2">Chưa có bài kiểm tra</h3>
                          <p className="text-center text-xs sm:text-sm">
                            AI sẽ tạo quiz để kiểm tra kiến thức
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="h-[60vh] sm:h-[70vh] lg:h-[calc(100vh-200px)] flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-4 sm:mb-6">
                  <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Chọn hoặc tải tài liệu</h3>
                <p className="text-center max-w-md leading-relaxed text-sm sm:text-base px-4">
                  Tải lên file PDF, video bài giảng, ghi chú hoặc paste link YouTube 
                  để AI giúp bạn tóm tắt, tạo ghi chú và trả lời câu hỏi về nội dung.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                    </div>
                    <div className="text-xs sm:text-sm font-medium">PDF</div>
                    <div className="text-xs text-gray-500">Tài liệu</div>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Video className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div className="text-xs sm:text-sm font-medium">Video</div>
                    <div className="text-xs text-gray-500">Bài giảng</div>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Youtube className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                    <div className="text-xs sm:text-sm font-medium">YouTube</div>
                    <div className="text-xs text-gray-500">Link video</div>
                  </div>
                  <div className="text-center p-3 sm:p-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div className="text-xs sm:text-sm font-medium">Text</div>
                    <div className="text-xs text-gray-500">Ghi chú</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
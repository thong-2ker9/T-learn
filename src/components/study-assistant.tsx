import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Upload, FileText, Video, Send, Trash2, MessageCircle, BookOpen, Music, Link, Play, FileImage, Mic, Plus, Brain, StickyNote, Layers, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Thêm Gemini SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'audio' | 'image' | 'text' | 'youtube' | 'website';
  content: string;
  url?: string; // for YouTube/website links
  thumbnail?: string;
  uploadDate: Date;
  processed: boolean;
  summary?: string;
  notes?: string;
  flashcards?: Flashcard[];
  duration?: number; // for video/audio
  size?: number; // file size
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  documentId?: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
}

interface StudyAssistantProps {
  onBack: () => void;
}

export function StudyAssistant({ onBack }: StudyAssistantProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [apiKey, setApiKey] = useState(
    "AIzaSyCM6EK2GDSQAg-vy_qcH6NAONOndwjeQ3E" // default API key
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load data từ localStorage
  useState(() => {
    const savedDocs = localStorage.getItem("studyDocuments");
    if (savedDocs) {
      const parsed = JSON.parse(savedDocs).map((doc: any) => ({
        ...doc,
        uploadDate: new Date(doc.uploadDate),
      }));
      setDocuments(parsed);
    }

    const savedMessages = localStorage.getItem("studyChatMessages");
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setChatMessages(parsed);
    }

    const savedApiKey = localStorage.getItem("studyAssistantApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  });

  // Lưu data vào localStorage
  const saveDocuments = (newDocs: Document[]) => {
    setDocuments(newDocs);
    localStorage.setItem("studyDocuments", JSON.stringify(newDocs));
  };

  const saveChatMessages = (newMessages: ChatMessage[]) => {
    setChatMessages(newMessages);
    localStorage.setItem("studyChatMessages", JSON.stringify(newMessages));
  };

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("studyAssistantApiKey", key);
  };

  // Upload file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024 * 1024) {
      alert("File quá lớn! Vui lòng chọn file nhỏ hơn 200MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type || "unknown",
        content,
        uploadDate: new Date(),
        processed: false,
      };

      const newDocs = [newDoc, ...documents];
      saveDocuments(newDocs);

      processDocument(newDoc);
    };

    // đọc text nếu có, còn lại thì đọc base64
    if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Xử lý document bằng Gemini
  const processDocument = async (doc: Document) => {
    setIsProcessing(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Bạn là một trợ lý giải bài tập cho học sinh. 
File sau có thể chứa đề bài hoặc ghi chú học tập (file: ${doc.name}).

Nhiệm vụ:
1. Nếu phát hiện đề bài → hãy giải chi tiết từng bước, ghi công thức và lời giải.
2. Nếu là tài liệu lý thuyết → tóm tắt công thức, định nghĩa, ví dụ minh họa.

Nội dung tài liệu:
${doc.content.substring(0, 5000)}`


      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const updatedDoc: Document = {
        ...doc,
        processed: true,
        summary: "📑 Tóm tắt:\n\n" + responseText,
        notes: "📝 Ghi chú học tập:\n\n" + responseText,
      };

      const updatedDocs = documents.map((d) => (d.id === doc.id ? updatedDoc : d));
      saveDocuments(updatedDocs);

      if (activeDocument?.id === doc.id) {
        setActiveDocument(updatedDoc);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi gọi API Gemini. Vui lòng kiểm tra API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Chat với Gemini
  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeDocument) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      documentId: activeDocument.id,
    };

    const newMessages = [...chatMessages, userMessage];
    saveChatMessages(newMessages);
    setInputMessage("");
    setIsChatLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Bạn là một trợ lý giải bài tập. 
Tài liệu: ${activeDocument.name}
Tóm tắt nội dung: ${activeDocument.summary || ""}

Người dùng hỏi: "${inputMessage}"

→ Hãy trả lời như giáo viên, giải thích step-by-step, công thức đầy đủ,công tâm,nói vui vẻ hòa đồng với học sinh.`

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
        documentId: activeDocument.id,
      };

      const finalMessages = [...newMessages, assistantMessage];
      saveChatMessages(finalMessages);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "❌ Lỗi khi gọi Gemini. Vui lòng kiểm tra API key.",
        timestamp: new Date(),
        documentId: activeDocument.id,
      };
      saveChatMessages([...newMessages, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Xóa tài liệu
  const deleteDocument = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
      const newDocs = documents.filter((doc) => doc.id !== id);
      saveDocuments(newDocs);

      if (activeDocument?.id === id) {
        setActiveDocument(null);
      }

      const newMessages = chatMessages.filter((msg) => msg.documentId !== id);
      saveChatMessages(newMessages);
    }
  };

  const getDocumentIcon = (type: string) => {
    if (type.includes("pdf")) return FileText;
    if (type.includes("video")) return Video;
    if (type.includes("text")) return BookOpen;
    return FileText;
  };

  const getFilteredChatMessages = () => {
    return activeDocument
      ? chatMessages.filter((msg) => msg.documentId === activeDocument.id)
      : [];
  };

  const filteredMessages = getFilteredChatMessages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          ← Quay lại
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Giải Tài Liệu Cùng AI</h1>
          <p className="text-gray-600">Upload tài liệu và chat với AI để học tập hiệu quả</p>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-2 border-red-100 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-red-600">Tài Liệu</h2>
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
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Chưa có tài liệu nào
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => {
                    const IconComponent = getDocumentIcon(doc.type);
                    return (
                      <div
                        key={doc.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          activeDocument?.id === doc.id
                            ? 'bg-red-50 border-red-300'
                            : 'bg-gray-50 border-gray-200 hover:border-red-200'
                        }`}
                        onClick={() => setActiveDocument(doc)}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className="w-5 h-5 text-red-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-800 truncate">
                              {doc.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {doc.uploadDate.toLocaleDateString('vi-VN')}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`text-xs px-2 py-0.5 rounded-full ${
                                doc.processed 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {doc.processed ? 'Đã xử lý' : 'Chưa xử lý'}
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
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeDocument ? (
              <Card className="p-6 border-2 border-red-100 bg-white h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-red-600 truncate">
                    {activeDocument.name}
                  </h2>
                  {!activeDocument.processed && (
                    <Button
                      onClick={() => processDocument(activeDocument)}
                      disabled={isProcessing}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      {isProcessing ? 'Đang xử lý...' : 'Xử lý AI'}
                    </Button>
                  )}
                </div>

                <Tabs defaultValue="summary" className="h-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="summary">Tóm tắt</TabsTrigger>
                    <TabsTrigger value="notes">Ghi chú</TabsTrigger>
                    <TabsTrigger value="chat">Chat AI</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="mt-4">
                    <div className="h-96 overflow-y-auto">
                      {activeDocument.processed ? (
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {activeDocument.summary}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <FileText className="w-16 h-16 mb-4 opacity-50" />
                          <p>Tài liệu chưa được xử lý bởi AI</p>
                          <p className="text-sm">Nhấn "Xử lý AI" để tạo tóm tắt</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-4">
                    <div className="h-96 overflow-y-auto">
                      {activeDocument.processed ? (
                        <div className="prose max-w-none text-gray-800 leading-relaxed">
                          <ReactMarkdown >
                            {activeDocument.notes || ""}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                          <p>Chưa có ghi chú học tập</p>
                          <p className="text-sm">Nhấn "Xử lý AI" để tạo ghi chú</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="chat" className="mt-4">
                    <div className="flex flex-col h-96">
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                        {filteredMessages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                            <p>Bắt đầu chat với tài liệu</p>
                            <p className="text-sm">Hỏi AI về nội dung tài liệu</p>
                          </div>
                        ) : (
                          filteredMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  message.role === 'user'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                <ReactMarkdown className="text-sm leading-relaxed">
                                  {message.content}
                                </ReactMarkdown>
                                <p
                                  className={`text-xs mt-2 ${
                                    message.role === 'user' ? 'text-red-100' : 'text-gray-500'
                                  }`}
                                >
                                  {message.timestamp.toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))
                        )}

                        {isChatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Chat Input */}
                      <div className="flex gap-2">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                          placeholder="Hỏi AI về nội dung tài liệu..."
                          className="flex-1 border-red-200 focus:border-red-400"
                          disabled={isChatLoading || !activeDocument.processed}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!inputMessage.trim() || isChatLoading || !activeDocument.processed}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Upload className="w-20 h-20 mb-6 opacity-50" />
                <h3 className="text-xl font-medium mb-2">Chọn hoặc upload tài liệu</h3>
                <p className="text-center max-w-md">
                  Upload file PDF, video bài giảng hoặc ghi chú text để AI giúp bạn tóm tắt, 
                  tạo ghi chú và trả lời câu hỏi về nội dung.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
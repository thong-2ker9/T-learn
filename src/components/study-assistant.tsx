// StudyAssistant.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Upload, FileText, Video, Send, Download, Trash2, MessageCircle,
  BookOpen, ArrowLeft, Play, FileUp, Link, Brain, Sparkles,
  Settings, Users, Mic, Search, Filter, MoreVertical, Copy, Star,
  Clock, CheckCircle, AlertCircle, Loader2, Youtube, FileImage,
  Lightbulb, Target, FileCheck, Zap, Globe
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { EducationalBackground } from "./educational-background";

// pdfjs-dist (browser/legacy build)
import pdfParse from "pdf-parse";
// @ts-ignore - import worker entry (vite/webpack will bundle)

// docx-preview (browser-friendly) - render docx to a hidden element and extract text
// @ts-ignore
import { renderAsync as renderDocxToElement } from "docx-preview";

// Gemini SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

(pdfParse as any).GlobalWorkerOptions.workerSrc = pdfWorker;

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'audio' | 'image' | 'text' | 'youtube' | 'website';
  content: string; // extracted plain text (or note if no transcript)
  url?: string; // for YouTube/website links
  thumbnail?: string;
  uploadDate: Date;
  processed: boolean;
  summary?: string;
  notes?: string;
  flashcards?: Array<{ question: string; answer: string }>;
  quiz?: Array<{ question: string; options: string[]; correct: number }>;
  duration?: number;
  size?: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  documentId?: string;
}

interface StudyAssistantProps {
  onBack: () => void;
}

export function StudyAssistant({ onBack }: StudyAssistantProps) {
  // States
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [summaryType, setSummaryType] = useState("detailed");
  const [activeTab, setActiveTab] = useState("chat");

  // YOUR GEMINI KEY (you provided): note: storing in frontend is insecure for public apps
  const API_KEY = "AIzaSyBRFPXbiLH4gJS3bQ0Cy1Q1A8PAEz5Mxhw";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved data once
  useEffect(() => {
    const savedDocs = localStorage.getItem("studyDocuments");
    if (savedDocs) {
      try {
        const parsed = JSON.parse(savedDocs).map((doc: any) => ({
          ...doc,
          uploadDate: new Date(doc.uploadDate),
        }));
        setDocuments(parsed);
      } catch (e) { console.warn("Failed parse saved docs", e); }
    }

    const savedMessages = localStorage.getItem("studyChatMessages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setChatMessages(parsed);
      } catch (e) { console.warn("Failed parse saved messages", e); }
    }
  }, []);

  // Persist helpers
  const saveDocuments = (newDocs: Document[]) => {
    setDocuments(newDocs);
    localStorage.setItem("studyDocuments", JSON.stringify(newDocs));
  };
  const saveChatMessages = (newMessages: ChatMessage[]) => {
    setChatMessages(newMessages);
    localStorage.setItem("studyChatMessages", JSON.stringify(newMessages));
  };

  // ===== Helpers for extracting text =====

  // PDF (browser) using pdfjs-dist
  async function extractTextFromPdfFile(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await (pdfParse as any).getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((it: any) => (it.str ? it.str : "")).join(" ");
        fullText += strings + "\n";
      }
      return fullText;
    } catch (e) {
      console.error("PDF extract error", e);
      return "";
    }
  }

  // DOCX (browser) using docx-preview: render to hidden element then read innerText
  async function extractTextFromDocxFile(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      (document.body || document.documentElement).appendChild(wrapper);

      // renderDocxToElement supports ArrayBuffer / Blob
      // @ts-ignore
      await renderDocxToElement(arrayBuffer, wrapper, { /* options */ });
      const text = wrapper.innerText || wrapper.textContent || "";
      wrapper.remove();
      return text;
    } catch (e) {
      console.error("DOCX extract error", e);
      return "";
    }
  }

  // YouTube transcript via backend (browser CORS prevents reliable client fetch)
  async function fetchYouTubeTranscriptFromServer(url: string): Promise<string | null> {
    try {
      // Assumes backend at same origin; if running separately set REACT_APP_BACKEND_URL env and replace ''
      const backend = (import.meta.env.REACT_APP_BACKEND_URL) || "";
      const resp = await fetch(`${backend}/api/youtube-transcript?url=${encodeURIComponent(url)}`);
      if (!resp.ok) {
        console.warn("YT transcript fetch failed", await resp.text());
        return null;
      }
      const json = await resp.json();
      return json.transcript || null;
    } catch (e) {
      console.error("fetchYouTubeTranscriptFromServer error", e);
      return null;
    }
  }

  // Extract YouTube video ID (utility)
  const extractYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // ===== Upload handlers =====

  // File upload (PDF, TXT, DOCX, video/audio)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024 * 1024) {
      alert("File quá lớn! Vui lòng chọn file nhỏ hơn 200MB.");
      return;
    }

    let docType: Document["type"] = "text";
    if (file.type.includes("pdf") || file.name.endsWith(".pdf")) docType = "pdf";
    else if (file.type.includes("video")) docType = "video";
    else if (file.type.includes("audio")) docType = "audio";
    else if (file.type.includes("image")) docType = "image";
    else if (file.name.endsWith(".docx")) docType = "text"; // we'll detect docx by extension and extract
    else if (file.type.startsWith("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) docType = "text";

    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: docType,
      content: "",
      uploadDate: new Date(),
      processed: false,
    };

    const newDocs = [newDoc, ...documents];
    saveDocuments(newDocs);

    // Extract content depending on type
    let extracted = "";
    try {
      if (docType === "pdf") {
        extracted = await extractTextFromPdfFile(file);
      } else if (file.name.endsWith(".docx")) {
        extracted = await extractTextFromDocxFile(file);
      } else if (file.type.startsWith("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        extracted = await file.text();
      } else if (docType === "audio" || docType === "video") {
        // No STT in frontend - we store filename and a message. If you want STT, enable backend transcription.
        extracted = `Uploaded ${file.type} (${file.name}). (No transcription available in frontend. To transcribe, run the optional backend /api/transcribe using Whisper or Google STT.)`;
      } else {
        extracted = `Uploaded file ${file.name}. Unable to auto-extract text (unsupported type).`;
      }
    } catch (e) {
      console.error("extract error", e);
      extracted = `Lỗi khi trích xuất nội dung: ${(e as any).message || e}`;
    }

    const updatedDoc: Document = { ...newDoc, content: extracted };
    // update documents array with content
    const updatedDocs = newDocs.map((d) => (d.id === newDoc.id ? updatedDoc : d));
    saveDocuments(updatedDocs);

    // start processing (send to Gemini)
    await processDocument(updatedDoc);

    // reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // YouTube upload -> call backend to fetch transcript, then process
  const handleYouTubeUpload = async () => {
    if (!youtubeUrl.trim()) return;
    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      alert("URL YouTube không hợp lệ!");
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      name: `YouTube - ${videoId}`,
      type: 'youtube',
      content: `Fetching transcript for ${youtubeUrl}...`,
      url: youtubeUrl,
      uploadDate: new Date(),
      processed: false,
    };

    const newDocs = [newDoc, ...documents];
    saveDocuments(newDocs);
    setYoutubeUrl("");

    // call backend to fetch transcript
    const transcript = await fetchYouTubeTranscriptFromServer(youtubeUrl);
    const updatedDoc = {
      ...newDoc,
      content: transcript ? transcript : `Không lấy được transcript. Nội dung URL: ${youtubeUrl}`,
    };
    const replaced = newDocs.map((d) => d.id === newDoc.id ? updatedDoc : d);
    saveDocuments(replaced);

    await processDocument(updatedDoc);
  };

  // ===== Process document with Gemini (summary, notes, flashcards, quiz) =====
  const processDocument = async (doc: Document) => {
    setIsProcessing(true);
    setActiveDocument(doc);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      // choose model; keep same as your original usage
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // ensure we send a reasonable-sized prompt: if document is huge, send only first N chars or split.
      const textForModel = doc.content.length > 12000 ? doc.content.slice(0, 12000) + "\n\n[...content truncated]" : doc.content;

      const summaryPrompt = `Tóm tắt văn bản sau bằng tiếng Việt, đủ ý, rõ ràng:\n\n${textForModel}`;
      const notesPrompt = `Ghi chú chi tiết bằng tiếng Việt từ văn bản sau:\n\n${textForModel}`;
      const flashPrompt = `Tạo 5 flashcard từ văn bản sau. Format JSON: [{"question":"...","answer":"..."}]\n\n${textForModel}`;
      const quizPrompt = `Tạo 5 câu trắc nghiệm từ văn bản sau. Format JSON: [{"question":"...?","options":["A","B","C","D"],"correct":0}]\n\n${textForModel}`;

      // run the 4 calls (in sequence to avoid throttling); you can parallelize if you want
      const summaryResult = await model.generateContent(summaryPrompt);
      const summary = (summaryResult.response && typeof summaryResult.response.text === "function") ? summaryResult.response.text() : String(summaryResult);

      const notesResult = await model.generateContent(notesPrompt);
      const notes = (notesResult.response && typeof notesResult.response.text === "function") ? notesResult.response.text() : String(notesResult);

      let flashcards: any[] = [];
      try {
        const flashResult = await model.generateContent(flashPrompt);
        const flashText = flashResult.response.text();
        flashcards = JSON.parse(flashText);
      } catch (e) {
        console.warn("flashcards parsing error", e);
        // best-effort: put raw text into notes if JSON parse fails
      }

      let quiz: any[] = [];
      try {
        const quizResult = await model.generateContent(quizPrompt);
        const quizText = quizResult.response.text();
        quiz = JSON.parse(quizText);
      } catch (e) {
        console.warn("quiz parsing error", e);
      }

      const updatedDoc: Document = {
        ...doc,
        processed: true,
        summary,
        notes,
        flashcards,
        quiz,
      };

      const updatedDocs = documents.map((d) => (d.id === doc.id ? updatedDoc : d));
      saveDocuments(updatedDocs);
      setActiveDocument(updatedDoc);
    } catch (error) {
      console.error("Error processing document:", error);
      alert("Có lỗi xảy ra khi xử lý tài liệu. Vui lòng kiểm tra API key và kết nối mạng.");
      const revertedDocs = documents.map(d => d.id === doc.id ? { ...d, processed: false } : d);
      saveDocuments(revertedDocs);
      if (activeDocument?.id === doc.id) setActiveDocument({ ...doc, processed: false });
    } finally {
      setIsProcessing(false);
    }
  };

  // ===== Chat with Gemini (based on activeDocument.summary/content) =====
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
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Bạn là một trợ lý giải bài tập.
Tài liệu: ${activeDocument.name}
Tóm tắt nội dung: ${activeDocument.summary || ""}

Người dùng hỏi: "${inputMessage}"

→ Hãy trả lời như giáo viên, giải thích step-by-step, công thức đầy đủ, công tâm, nói vui vẻ hòa đồng với học sinh.`;

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

  // Delete document
  const deleteDocument = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
    const newDocs = documents.filter((doc) => doc.id !== id);
    saveDocuments(newDocs);
    if (activeDocument?.id === id) setActiveDocument(null);
    const newMessages = chatMessages.filter((msg) => msg.documentId !== id);
    saveChatMessages(newMessages);
  };

  const getDocumentIcon = (type: string) => {
    if (type.includes("pdf")) return FileText;
    if (type.includes("video")) return Video;
    if (type.includes("text")) return BookOpen;
    return FileText;
  };

  const getFilteredChatMessages = () => activeDocument ? chatMessages.filter((m) => m.documentId === activeDocument.id) : [];
  const filteredMessages = getFilteredChatMessages();

  // Auto-scroll chat
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // ---------- UI (keeps your original layout, only updated functions) ----------
  return (
    <div className="min-h-screen relative overflow-hidden">
      <EducationalBackground variant="secondary" />

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="outline" size="icon" className="shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Study Assistant</h1>
              <p className="text-gray-600">Tải tài liệu và học cùng AI thông minh</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Documents */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800">Tài liệu</h2>
                  <div className="text-xs text-gray-500">{documents.length} files</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <input ref={fileInputRef} type="file" accept=".pdf,.docx,.mp4,.avi,.mov,.txt,.md" onChange={handleFileUpload} className="hidden" id="file-upload" />
                    <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" onClick={() => fileInputRef.current?.click()}>
                      <FileUp className="w-4 h-4 mr-2" /> Upload File
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="YouTube URL..." className="flex-1 text-sm" />
                    <Button size="sm" onClick={handleYouTubeUpload} disabled={!youtubeUrl.trim()} className="bg-red-500 hover:bg-red-600 text-white">
                      <Youtube className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
                    Ghi chú: YouTube transcript được lấy qua backend (để tránh CORS). Nếu backend không chạy, hệ thống sẽ lưu URL thay vì transcript.
                  </div>
                </div>
              </div>

              {/* Documents List */}
              <div className="flex-1 overflow-y-auto p-6">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Chưa có tài liệu nào</p>
                    <p className="text-gray-400 text-xs">Upload file hoặc paste YouTube URL</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => {
                      const IconComponent = getDocumentIcon(doc.type);
                      return (
                        <div key={doc.id} className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${activeDocument?.id === doc.id ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md' : 'bg-gray-50/80 border-gray-200 hover:border-blue-200'}`} onClick={() => setActiveDocument(doc)}>
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${doc.type === 'youtube' ? 'bg-red-100' : doc.type === 'pdf' ? 'bg-orange-100' : doc.type === 'video' ? 'bg-blue-100' : 'bg-green-100'}`}>
                              <IconComponent className={`w-4 h-4 ${doc.type === 'youtube' ? 'text-red-600' : doc.type === 'pdf' ? 'text-orange-600' : doc.type === 'video' ? 'text-blue-600' : 'text-green-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-800 truncate">{doc.name}</div>
                              <div className="text-xs text-gray-500">{doc.uploadDate.toLocaleDateString('vi-VN')}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${doc.processed ? 'bg-green-100 text-green-700' : isProcessing && activeDocument?.id === doc.id ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {doc.processed ? (
                                    <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Processed</div>
                                  ) : isProcessing && activeDocument?.id === doc.id ? (
                                    <div className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Processing</div>
                                  ) : (
                                    <div className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Pending</div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteDocument(doc.id); }} variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeDocument ? (
              <Card className="h-full flex flex-col border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                {/* Document Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeDocument.type === 'youtube' ? 'bg-red-100' : activeDocument.type === 'pdf' ? 'bg-orange-100' : activeDocument.type === 'video' ? 'bg-blue-100' : 'bg-green-100'}`}>
                        {(() => {
                          const IconComponent = getDocumentIcon(activeDocument.type);
                          return <IconComponent className={`w-5 h-5 ${activeDocument.type === 'youtube' ? 'text-red-600' : activeDocument.type === 'pdf' ? 'text-orange-600' : activeDocument.type === 'video' ? 'text-blue-600' : 'text-green-600'}`} />;
                        })()}
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-800 truncate max-w-md">{activeDocument.name}</h2>
                        <p className="text-sm text-gray-500">{activeDocument.uploadDate.toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeDocument.processed && (
                        <Select value={summaryType} onValueChange={setSummaryType}>
                          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="detailed">Chi tiết</SelectItem>
                            <SelectItem value="brief">Tóm tắt</SelectItem>
                            <SelectItem value="key-points">Điểm chính</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {!activeDocument.processed && (
                        <Button onClick={() => processDocument(activeDocument)} disabled={isProcessing} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                          {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang xử lý...</>) : (<><Zap className="w-4 h-4 mr-2" />Xử lý AI</>)}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1 mt-4 p-1 bg-gray-100 rounded-lg">
                    {[
                      { id: 'chat', label: 'Trò chuyện', icon: MessageCircle },
                      { id: 'summary', label: 'Tóm tắt', icon: FileText },
                      { id: 'notes', label: 'Ghi chú', icon: BookOpen },
                      { id: 'flashcards', label: 'Thẻ nhớ', icon: Lightbulb },
                      { id: 'quiz', label: 'Bài kiểm tra', icon: Target }
                    ].map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
                          <IconComponent className="w-4 h-4" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                  {activeTab === 'chat' && (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {filteredMessages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                              <MessageCircle className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="font-semibold mb-2">Bắt đầu trò chuyện</h3>
                            <p className="text-center text-sm">Hỏi AI về nội dung tài liệu để hiểu sâu hơn</p>
                            {!activeDocument.processed && (<p className="text-xs text-orange-500 mt-2">Vui lòng xử lý tài liệu trước khi chat</p>)}
                          </div>
                        ) : (
                          <>
                            {filteredMessages.map((message) => (
                              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl ${message.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                              </div>
                            ))}

                            {isChatLoading && (
                              <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-2xl p-4">
                                  <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      <div className="p-6 border-t border-gray-100">
                        <div className="flex gap-3">
                          <Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder="Hỏi AI về nội dung tài liệu..." className="flex-1 border-gray-200 focus:border-blue-400 rounded-xl" disabled={isChatLoading || !activeDocument?.processed} />
                          <Button onClick={sendMessage} disabled={!inputMessage.trim() || isChatLoading || !activeDocument?.processed} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1"><Globe className="w-3 h-3" />AI-powered</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'summary' && (
                    <div className="h-full overflow-y-auto p-6">
                      {activeDocument.processed ? (
                        <div className="prose max-w-none"><div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{activeDocument.summary}</div></div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center mb-4"><FileText className="w-8 h-8 text-orange-500" /></div>
                          <h3 className="font-semibold mb-2">Chưa có tóm tắt</h3>
                          <p className="text-center text-sm">Nhấn "Xử lý AI" để tạo tóm tắt thông minh</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="h-full overflow-y-auto p-6">
                      {activeDocument.processed ? (
                        <div className="prose max-w-none"><div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{activeDocument.notes}</div></div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center mb-4"><BookOpen className="w-8 h-8 text-green-500" /></div>
                          <h3 className="font-semibold mb-2">Chưa có ghi chú</h3>
                          <p className="text-center text-sm">AI sẽ tạo ghi chú học tập chi tiết sau khi xử lý</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'flashcards' && (
                    <div className="h-full overflow-y-auto p-6">
                      {activeDocument.processed && activeDocument.flashcards ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeDocument.flashcards.map((card, index) => (
                            <Card key={index} className="p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                              <div className="mb-3">
                                <div className="text-sm font-medium text-blue-600 mb-2">Câu hỏi {index + 1}</div>
                                <div className="font-semibold text-gray-800">{card.question}</div>
                              </div>
                              <div className="text-gray-600 text-sm leading-relaxed">{card.answer}</div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center justify-center mb-4"><Lightbulb className="w-8 h-8 text-yellow-500" /></div>
                          <h3 className="font-semibold mb-2">Chưa có flashcard</h3>
                          <p className="text-center text-sm">AI sẽ tạo flashcards để ôn tập hiệu quả</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'quiz' && (
                    <div className="h-full overflow-y-auto p-6">
                      {activeDocument.processed && activeDocument.quiz ? (
                        <div className="space-y-6">
                          {activeDocument.quiz.map((question, index) => (
                            <Card key={index} className="p-6 border-2 border-gray-100">
                              <div className="mb-4">
                                <div className="text-sm font-medium text-purple-600 mb-2">Câu {index + 1}</div>
                                <div className="font-semibold text-gray-800 text-lg">{question.question}</div>
                              </div>
                              <div className="space-y-2">
                                {question.options.map((option, optIndex) => (
                                  <div key={optIndex} className={`p-3 rounded-lg border transition-colors ${optIndex === question.correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                                    <div className="flex items-center gap-3">
                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${optIndex === question.correct ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-gray-500'}`}>{String.fromCharCode(65 + optIndex)}</div>
                                      <span>{option}</span>
                                      {optIndex === question.correct && (<CheckCircle className="w-4 h-4 text-green-500 ml-auto" />)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-4"><Target className="w-8 h-8 text-purple-500" /></div>
                          <h3 className="font-semibold mb-2">Chưa có bài kiểm tra</h3>
                          <p className="text-center text-sm">AI sẽ tạo quiz để kiểm tra kiến thức</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-6"><Upload className="w-12 h-12 text-blue-500" /></div>
                <h3 className="text-xl font-semibold mb-4">Chọn hoặc tải tài liệu</h3>
                <p className="text-center max-w-md leading-relaxed">Tải lên file PDF, video bài giảng, ghi chú hoặc paste link YouTube để AI giúp bạn tóm tắt, tạo ghi chú và trả lời câu hỏi về nội dung.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2"><FileText className="w-6 h-6 text-orange-600" /></div>
                    <div className="text-sm font-medium">PDF</div><div className="text-xs text-gray-500">Tài liệu</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2"><Video className="w-6 h-6 text-blue-600" /></div>
                    <div className="text-sm font-medium">Video</div><div className="text-xs text-gray-500">Bài giảng</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2"><Youtube className="w-6 h-6 text-red-600" /></div>
                    <div className="text-sm font-medium">YouTube</div><div className="text-xs text-gray-500">Link video</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2"><BookOpen className="w-6 h-6 text-green-600" /></div>
                    <div className="text-sm font-medium">Text</div><div className="text-xs text-gray-500">Ghi chú</div>
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

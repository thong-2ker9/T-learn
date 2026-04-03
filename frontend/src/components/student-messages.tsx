import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Search, Circle, ArrowLeft, Image, Video, FileText } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  online: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  senderId: string;
  text?: string;
  timestamp: string;
  isStudent: boolean;
  type?: 'text' | 'image' | 'video' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface StudentMessagesProps {
  onBack: () => void;
}

export function StudentMessages({ onBack }: StudentMessagesProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [messagesState, setMessagesState] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const teachers: Teacher[] = [
    {
      id: "1",
      name: "Thầy Nguyễn Văn A",
      subject: "Toán học",
      online: true,
      lastMessage: "Bài tập ngày mai nhớ nộp nhé!",
      lastMessageTime: "14:30",
      unreadCount: 1,
    },
    {
      id: "2",
      name: "Cô Trần Thị B",
      subject: "Văn học",
      online: true,
      lastMessage: "Em làm tốt lắm!",
      lastMessageTime: "Hôm qua",
    },
    {
      id: "3",
      name: "Thầy Lê Văn C",
      subject: "Tiếng Anh",
      online: false,
      lastMessage: "Chúc em học tốt!",
      lastMessageTime: "2 ngày trước",
    },
  ];

  // Initialize messages with mock data
  useEffect(() => {
    if (selectedTeacher) {
      const initialMessages: Message[] = [
        {
          id: "1",
          senderId: "student",
          text: "Thầy ơi, em có thể hỏi về bài tập hôm nay không ạ?",
          timestamp: "10:00",
          isStudent: true,
          type: 'text',
        },
        {
          id: "2",
          senderId: selectedTeacher.id,
          text: "Được chứ em, em hỏi đi!",
          timestamp: "10:01",
          isStudent: false,
          type: 'text',
        },
        {
          id: "3",
          senderId: "student",
          text: "Dạ, em không hiểu bài số 5 ạ. Thầy có thể giải thích lại được không?",
          timestamp: "10:02",
          isStudent: true,
          type: 'text',
        },
        {
          id: "4",
          senderId: selectedTeacher.id,
          text: "Được, bài số 5 là về phương trình bậc 2. Em cần thầy giải thích phần nào?",
          timestamp: "10:03",
          isStudent: false,
          type: 'text',
        },
      ];
      setMessagesState(initialMessages);
    }
  }, [selectedTeacher]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesState]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedTeacher) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "student",
      text: messageText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isStudent: true,
      type: 'text',
    };

    setMessagesState((prev) => [...prev, newMessage]);
    setMessageText("");
    toast.success("Đã gửi tin nhắn!");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const handleFileUpload = (type: 'image' | 'video' | 'file') => {
    if (!selectedTeacher) return;
    
    setShowFileOptions(false);
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const fakeUrl = URL.createObjectURL(file);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: "student",
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isStudent: true,
        type: type,
        fileUrl: fakeUrl,
        fileName: type === 'file' ? file.name : undefined,
      };
      
      setMessagesState((prev) => [...prev, newMessage]);
      toast.success(`Đã gửi ${type === 'image' ? 'ảnh' : type === 'video' ? 'video' : 'file'}!`);
    };
    
    input.click();
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {!selectedTeacher ? (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-3 rounded-2xl transition-all bg-white hover:bg-red-50 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-6 h-6 text-red-600" />
            </button>
            <div>
              <h1 className="text-3xl text-gray-800">Tin nhắn</h1>
              <p className="text-gray-600">Trò chuyện với giáo viên</p>
            </div>
          </div>

          <Card className="border-0 shadow-lg rounded-3xl bg-white">
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm giáo viên..."
                  className="pl-10 rounded-2xl border-gray-200"
                />
              </div>

              <div className="space-y-2">
                {filteredTeachers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Không tìm thấy giáo viên</p>
                  </div>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <button
                      key={teacher.id}
                      onClick={() => setSelectedTeacher(teacher)}
                      className="w-full p-4 flex items-center gap-3 rounded-2xl transition-all hover:bg-red-50"
                    >
                      <div className="relative">
                        <Avatar className="w-14 h-14">
                          <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white">
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>
                        {teacher.online && (
                          <Circle className="absolute bottom-0 right-0 w-4 h-4 fill-green-500 text-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="truncate text-gray-800">
                            {teacher.name}
                          </p>
                          {teacher.lastMessageTime && (
                            <span className="text-xs ml-2 shrink-0 text-gray-500">
                              {teacher.lastMessageTime}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm truncate text-gray-500">
                            {teacher.lastMessage || teacher.subject}
                          </p>
                          {teacher.unreadCount && teacher.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white rounded-full h-5 px-2 text-xs ml-2">
                              {teacher.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="fixed inset-0 flex flex-col bg-white animate-fade-in">
          <div className="p-4 border-b flex items-center gap-3 border-gray-100 bg-white">
            <button
              onClick={() => setSelectedTeacher(null)}
              className="p-2 rounded-xl transition-colors -ml-2 hover:bg-red-100"
            >
              <ArrowLeft className="w-5 h-5 text-red-600" />
            </button>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white">
                {getInitials(selectedTeacher.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-gray-800">
                {selectedTeacher.name}
              </p>
              <p className="text-sm flex items-center gap-1 text-gray-500">
                {selectedTeacher.online ? (
                  <>
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                    <span>Đang hoạt động</span>
                  </>
                ) : (
                  <span>{selectedTeacher.subject}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-red-50/30">
            {messagesState.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isStudent ? "justify-end" : "justify-start"} message-slide-up`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-3xl ${
                    message.isStudent
                      ? "bg-gradient-to-br from-red-400 to-red-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                  }`}
                >
                  {message.type === 'image' && message.fileUrl && (
                    <img 
                      src={message.fileUrl} 
                      alt="Shared image"
                      className="rounded-2xl mb-2 max-w-full"
                    />
                  )}
                  {message.type === 'video' && message.fileUrl && (
                    <video 
                      src={message.fileUrl} 
                      controls
                      className="rounded-2xl mb-2 max-w-full"
                    />
                  )}
                  {message.type === 'file' && message.fileName && (
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm">{message.fileName}</span>
                    </div>
                  )}
                  {message.text && <p>{message.text}</p>}
                  <p
                    className={`text-xs mt-2 ${
                      message.isStudent ? "text-red-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="p-4 rounded-3xl rounded-bl-md bg-white text-gray-800 shadow-sm">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-2xl shrink-0"
                  onClick={() => setShowFileOptions(!showFileOptions)}
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                
                {showFileOptions && (
                  <div className="absolute bottom-full left-0 mb-2 rounded-2xl shadow-lg border p-2 space-y-1 min-w-[160px] bg-white border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleFileUpload('image')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left hover:bg-red-50"
                    >
                      <Image className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-700">Ảnh</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileUpload('video')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left hover:bg-red-50"
                    >
                      <Video className="w-5 h-5 text-purple-500" />
                      <span className="text-sm text-gray-700">Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileUpload('file')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left hover:bg-red-50"
                    >
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-gray-700">File</span>
                    </button>
                  </div>
                )}
              </div>
              <Input
                value={messageText}
                onChange={handleInputChange}
                placeholder="Nhập tin nhắn..."
                className="rounded-3xl flex-1"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl shrink-0"
                disabled={!messageText.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

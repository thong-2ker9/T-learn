import { useState } from "react";
import { Send, Paperclip, Search, Circle, ArrowLeft, Image, Video, FileText } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface Student {
  id: string;
  name: string;
  class: string;
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
  isTeacher: boolean;
  type?: 'text' | 'image' | 'video' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export function TeacherMessages() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);

  const students: Student[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      class: "10A1",
      online: true,
      lastMessage: "Em cảm ơn thầy ạ!",
      lastMessageTime: "10:30",
      unreadCount: 2,
    },
    {
      id: "2",
      name: "Trần Thị B",
      class: "10A2",
      online: false,
      lastMessage: "Dạ em hiểu rồi ạ",
      lastMessageTime: "Hôm qua",
    },
    {
      id: "3",
      name: "Lê Văn C",
      class: "11A1",
      online: true,
      lastMessage: "Thầy ơi, em có thắc mắc...",
      lastMessageTime: "9:15",
      unreadCount: 1,
    },
  ];

  const messages: Message[] = selectedStudent
    ? [
        {
          id: "1",
          senderId: selectedStudent.id,
          text: "Thầy ơi, em có thể hỏi về bài tập hôm nay không ạ?",
          timestamp: "10:00",
          isTeacher: false,
          type: 'text',
        },
        {
          id: "2",
          senderId: "teacher",
          text: "Được chứ em, em hỏi đi!",
          timestamp: "10:01",
          isTeacher: true,
          type: 'text',
        },
        {
          id: "3",
          senderId: selectedStudent.id,
          text: "Dạ, em không hiểu bài số 5 ạ. Thầy có thể giải thích lại được không?",
          timestamp: "10:02",
          isTeacher: false,
          type: 'text',
        },
        {
          id: "4",
          senderId: "teacher",
          text: "Được, bài số 5 là về phương trình bậc 2. Em cần thầy giải thích phần nào?",
          timestamp: "10:03",
          isTeacher: true,
          type: 'text',
        },
        {
          id: "5",
          senderId: selectedStudent.id,
          text: "Em cảm ơn thầy ạ!",
          timestamp: "10:30",
          isTeacher: false,
          type: 'text',
        },
      ]
    : [];

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
    if (!messageText.trim()) return;

    console.log("Sending message:", messageText);
    setMessageText("");
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const handleFileUpload = (type: 'image' | 'video' | 'file') => {
    console.log(`Uploading ${type}`);
    setShowFileOptions(false);
    // TODO: Implement file upload logic
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="fixed inset-0 bg-white animate-fade-in">
      {/* Student List View */}
      {!selectedStudent ? (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <h2 className="text-gray-800 text-xl mb-4">Tin nhắn</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm học sinh..."
                className="pl-10 rounded-2xl"
              />
            </div>
          </div>

          {/* Students List */}
          <div className="flex-1 overflow-y-auto">
            {students
              .filter(student => 
                student.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="w-full p-4 flex items-center space-x-3 hover:bg-red-50 transition-colors border-b border-gray-50"
                >
                  <div className="relative">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white">
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                    {student.online && (
                      <Circle className="absolute bottom-0 right-0 w-4 h-4 fill-green-500 text-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-800 truncate">{student.name}</p>
                      {student.lastMessageTime && (
                        <span className="text-gray-500 text-xs ml-2 shrink-0">
                          {student.lastMessageTime}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500 text-sm truncate">
                        {student.lastMessage || `Lớp ${student.class}`}
                      </p>
                      {student.unreadCount && student.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white rounded-full h-5 px-2 text-xs ml-2">
                          {student.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ) : (
        /* Chat View */
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-white">
            <button
              onClick={handleBackToList}
              className="p-2 hover:bg-red-100 rounded-xl transition-colors -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-red-600" />
            </button>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white">
                {getInitials(selectedStudent.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 truncate">{selectedStudent.name}</p>
              <p className="text-gray-500 text-sm flex items-center space-x-1">
                {selectedStudent.online && (
                  <>
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                    <span>Đang hoạt động</span>
                  </>
                )}
                {!selectedStudent.online && <span>Lớp {selectedStudent.class}</span>}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-red-50/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isTeacher ? "justify-end" : "justify-start"} message-slide-up`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-3xl ${
                    message.isTeacher
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
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm">{message.fileName}</span>
                    </div>
                  )}
                  {message.text && <p>{message.text}</p>}
                  <p
                    className={`text-xs mt-2 ${
                      message.isTeacher ? "text-red-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 p-4 rounded-3xl rounded-bl-md shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
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
                
                {/* File Options Popup */}
                {showFileOptions && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-2 space-y-1 min-w-[160px]">
                    <button
                      type="button"
                      onClick={() => handleFileUpload('image')}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <Image className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-700">Ảnh</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileUpload('video')}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <Video className="w-5 h-5 text-purple-500" />
                      <span className="text-sm text-gray-700">Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileUpload('file')}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-gray-700">File</span>
                    </button>
                  </div>
                )}
              </div>
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .message-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Book, MessageCircle, Send, Check, X, Calendar, User as UserIcon, FileText, Clock, CheckCircle2, Star, Search, Circle, Image, Video, Paperclip } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { useSocket } from "./socket-context";

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

interface Assignment {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  submittedAt?: string;
}

interface MyClassroomProps {
  onBack: () => void;
}

export function MyClassroom({ onBack }: MyClassroomProps) {
  const [currentView, setCurrentView] = useState<"main" | "chat">("main");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [messagesState, setMessagesState] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { socket, isConnected, joinRoom, sendMessage, onMessageReceived, onTyping, emitTyping, leaveRoom } = useSocket();

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

  const assignments: Assignment[] = [
    {
      id: "1",
      teacherId: "1",
      teacherName: "Thầy Nguyễn Văn A",
      subject: "Toán học",
      title: "Bài tập về phương trình bậc 2",
      description: "Hoàn thành các bài tập từ 1-10 trong sách giáo khoa trang 45",
      dueDate: "2025-11-20",
      status: "pending",
    },
    {
      id: "2",
      teacherId: "2",
      teacherName: "Cô Trần Thị B",
      subject: "Văn học",
      title: "Phân tích tác phẩm 'Chiếc lược ngà'",
      description: "Viết bài phân tích chi tiết về tác phẩm, tối thiểu 500 từ",
      dueDate: "2025-11-18",
      status: "submitted",
      submittedAt: "2025-11-15 10:30",
    },
    {
      id: "3",
      teacherId: "1",
      teacherName: "Thầy Nguyễn Văn A",
      subject: "Toán học",
      title: "Bài kiểm tra giữa kỳ",
      description: "Ôn tập chương 1, 2, 3",
      dueDate: "2025-11-10",
      status: "graded",
      grade: 9.5,
      submittedAt: "2025-11-10 08:00",
    },
  ];

  // Initialize messages with mock data khi chọn teacher
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

  // Socket connection và event listeners
  useEffect(() => {
    if (!socket || !selectedTeacher) return;

    // Join room khi chọn teacher - sử dụng cùng roomId format với teacher
    // Teacher ID là "1" thì student id tương ứng sẽ là "1"
    const roomId = `teacher-teacher-student-${selectedTeacher.id}`;
    joinRoom(roomId, selectedTeacher.id, "student");
    console.log(`Student joined room: ${roomId}`);

    // Listen for incoming messages
    onMessageReceived((message: Message) => {
      console.log("Student received message:", message);
      setMessagesState((prev) => [...prev, message]);
      scrollToBottom();
    });

    // Listen for typing indicator
    onTyping((data: { userId: string; isTyping: boolean }) => {
      if (data.userId === "teacher") {
        setIsTyping(data.isTyping);
      }
    });

    // Cleanup: leave room khi unmount hoặc đổi teacher
    return () => {
      leaveRoom(roomId);
      console.log(`Student left room: ${roomId}`);
    };
  }, [socket, selectedTeacher]);

  // Auto scroll to bottom when new messages arrive
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
      senderId: selectedTeacher.id,
      text: messageText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isStudent: true,
      type: 'text',
    };

    // Add message to local state immediately (optimistic update)
    setMessagesState((prev) => [...prev, newMessage]);

    // Send via socket
    const roomId = `teacher-teacher-student-${selectedTeacher.id}`;
    sendMessage(roomId, newMessage);
    
    console.log("Student sending message:", newMessage);
    setMessageText("");
    
    // Stop typing indicator
    emitTyping(roomId, selectedTeacher.id, false);
    
    toast.success("Đã gửi tin nhắn!");
  };

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    if (!selectedTeacher) return;
    
    const roomId = `teacher-teacher-student-${selectedTeacher.id}`;
    
    // Emit typing
    emitTyping(roomId, selectedTeacher.id, true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(roomId, selectedTeacher.id, false);
    }, 2000);
  };

  const handleFileUpload = (type: 'image' | 'video' | 'file') => {
    if (!selectedTeacher) return;
    
    console.log(`Uploading ${type}`);
    setShowFileOptions(false);
    
    // Create input element for file selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      // TODO: Upload file to server and get URL
      // For now, create a fake URL
      const fakeUrl = URL.createObjectURL(file);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: selectedTeacher.id,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isStudent: true,
        type: type,
        fileUrl: fakeUrl,
        fileName: type === 'file' ? file.name : undefined,
      };
      
      // Add message to local state
      setMessagesState((prev) => [...prev, newMessage]);
      
      // Send via socket
      const roomId = `teacher-teacher-student-${selectedTeacher.id}`;
      sendMessage(roomId, newMessage);
      
      toast.success(`Đã gửi ${type === 'image' ? 'ảnh' : type === 'video' ? 'video' : 'file'}!`);
    };
    
    input.click();
  };

  const handleBackToMain = () => {
    setCurrentView("main");
    setSelectedTeacher(null);
  };

  const handleSelectTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setCurrentView("chat");
  };

  const handleSubmitAssignment = (assignmentId: string) => {
    console.log("Submitting assignment:", assignmentId);
    toast.success("Đã nộp bài tập thành công!");
  };

  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 text-white"><Clock className="w-3 h-3 mr-1" />Chưa nộp</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Đã nộp</Badge>;
      case 'graded':
        return <Badge className="bg-green-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Đã chấm</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {currentView === "main" ? (
        <div className="max-w-6xl mx-auto p-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-3 rounded-2xl transition-all bg-white hover:bg-red-50 shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-6 h-6 text-red-600" />
              </button>
              <div>
                <h1 className="text-3xl text-gray-800">Lớp học của tôi</h1>
                <p className="text-gray-600">
                  Kết nối với giáo viên và theo dõi bài tập
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="assignments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assignments">
                <Book className="w-4 h-4 mr-2" />
                Bài tập
              </TabsTrigger>
              <TabsTrigger value="teachers">
                <Send className="w-4 h-4 mr-2" />
                Tin nhắn
              </TabsTrigger>
            </TabsList>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-4">
              {assignments.length === 0 ? (
                <Card className="border-0 shadow-lg rounded-3xl bg-white">
                  <CardContent className="p-12 text-center">
                    <Book className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg text-gray-600">
                      Chưa có bài tập nào
                    </p>
                  </CardContent>
                </Card>
              ) : (
                assignments.map((assignment) => (
                  <Card key={assignment.id} className="border-0 shadow-lg rounded-3xl hover:shadow-xl transition-all bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white">
                              {assignment.subject}
                            </Badge>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <h3 className="text-xl mb-2 text-gray-800">
                            {assignment.title}
                          </h3>
                          <p className="mb-3 text-gray-600">
                            {assignment.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            {assignment.submittedAt && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Nộp lúc: {assignment.submittedAt}</span>
                              </div>
                            )}
                            {assignment.grade !== undefined && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-yellow-600">Điểm: {assignment.grade}/10</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          {assignment.teacherName}
                        </p>
                        {assignment.status === 'pending' && (
                          <Button
                            onClick={() => handleSubmitAssignment(assignment.id)}
                            className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl"
                          >
                            Nộp bài
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Teachers/Messages Tab */}
            <TabsContent value="teachers" className="space-y-4">
              <Card className="border-0 shadow-lg rounded-3xl bg-white">
                <CardContent className="p-6">
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm giáo viên..."
                      className="pl-10 rounded-2xl"
                    />
                  </div>

                  {/* Teachers List */}
                  <div className="space-y-2">
                    {teachers
                      .filter(teacher => 
                        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((teacher) => (
                        <button
                          key={teacher.id}
                          onClick={() => handleSelectTeacher(teacher)}
                          className="w-full p-4 flex items-center space-x-3 rounded-2xl transition-all hover:bg-red-50"
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
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        /* Chat View */
        <div className="fixed inset-0 flex flex-col bg-white animate-fade-in">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center space-x-3 border-gray-100 bg-white">
            <button
              onClick={handleBackToMain}
              className="p-2 rounded-xl transition-colors -ml-2 hover:bg-red-100"
            >
              <ArrowLeft className="w-5 h-5 text-red-600" />
            </button>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white">
                {selectedTeacher && getInitials(selectedTeacher.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-gray-800">
                {selectedTeacher?.name}
              </p>
              <p className="text-sm flex items-center space-x-1 text-gray-500">
                {selectedTeacher?.online && (
                  <>
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                    <span>Đang hoạt động</span>
                  </>
                )}
                {!selectedTeacher?.online && <span>{selectedTeacher?.subject}</span>}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-red-50/30">
            {!isConnected && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-4 text-center">
                <p className="text-sm text-blue-800">💬 Chat đang hoạt động ở chế độ offline</p>
                <p className="text-xs text-blue-600 mt-1">Tin nhắn vẫn hoạt động bình thường. Xem Settings để kích hoạt realtime chat.</p>
              </div>
            )}
            
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
                    <div className="flex items-center space-x-2 mb-2">
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
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: "300ms" }}></div>
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
                  <div className="absolute bottom-full left-0 mb-2 rounded-2xl shadow-lg border p-2 space-y-1 min-w-[160px] bg-white border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleFileUpload('image')}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-colors text-left hover:bg-red-50"
                    >
                      <Image className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-700">Ảnh</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileUpload('video')}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-colors text-left hover:bg-red-50"
                    >
                      <Video className="w-5 h-5 text-purple-500" />
                      <span className="text-sm text-gray-700">Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileUpload('file')}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-colors text-left hover:bg-red-50"
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
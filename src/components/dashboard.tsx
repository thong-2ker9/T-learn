import { 
  Brain, 
  MessageCircle, 
  Layers, 
  CheckSquare, 
  AlarmClock, 
  Calendar, 
  Shirt, 
  Upload, 
  Timer,
  Heart,
  User,
  Camera,
  Archive,
  StickyNote,
  TrendingUp,
  BookOpen,
  Languages,
  Volume2
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { EducationalBackground } from "./educational-background";

interface DashboardProps {
  onFeatureSelect: (feature: string) => void;
}

const aiFeatures = [
  {
    id: "homework-solver",
    title: "AI Giải Bài Tập",
    description: "Giải mọi bài tập mọi lĩnh vực",
    icon: Brain,
    color: "bg-purple-500 hover:bg-purple-600"
  },
  {
    id: "chat-support",
    title: "AI Tâm Lý",
    description: "Hỗ trợ trò chuyện và tâm lý",
    icon: MessageCircle,
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    id: "study-assistant",
    title: "Giải Tài Liệu Cùng AI",
    description: "Upload file và tương tác AI",
    icon: Upload,
    color: "bg-red-500 hover:bg-red-600"
  }
];

const supportTools = [
  {
    id: "flashcards",
    title: "Flashcard",
    description: "Tạo và ôn tập thẻ ghi nhớ",
    icon: Layers,
    color: "bg-blue-500 hover:bg-blue-600"
  },
  {
    id: "tasks",
    title: "Nhiệm vụ",
    description: "Quản lý học tập và thông báo",
    icon: CheckSquare,
    color: "bg-orange-500 hover:bg-orange-600"
  },
  {
    id: "alarm",
    title: "Báo thức",
    description: "Gọi dậy và bấm giờ",
    icon: AlarmClock,
    color: "bg-pink-500 hover:bg-pink-600"
  },
  {
    id: "schedule",
    title: "Thời khóa biểu",
    description: "Upload ảnh thời khóa biểu",
    icon: Calendar,
    color: "bg-yellow-500 hover:bg-yellow-600"
  },
  {
    id: "uniform",
    title: "Đồng phục",
    description: "Nhắc nhở mặc đồ theo ngày",
    icon: Shirt,
    color: "bg-indigo-500 hover:bg-indigo-600"
  },
  {
    id: "pomodoro",
    title: "Tập trung",
    description: "Pomodoro Timer",
    icon: Timer,
    color: "bg-red-500 hover:bg-red-600"
  },
  {
    id: "health",
    title: "Sức khỏe",
    description: "Nhắc nhở uống nước, tập thể dục, thiền",
    icon: Heart,
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    id: "storage",
    title: "Lưu trữ",
    description: "Quản lý tài liệu học tập",
    icon: Archive,
    color: "bg-cyan-500 hover:bg-cyan-600"
  },
  {
    id: "notes",
    title: "Ghi chú",
    description: "Ghi chú nhanh phong cách iPhone",
    icon: StickyNote,
    color: "bg-amber-500 hover:bg-amber-600"
  }
];

export function Dashboard({ onFeatureSelect }: DashboardProps) {
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [todayStudyTime, setTodayStudyTime] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarImage(result);
        localStorage.setItem('userAvatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load saved avatar, name and study time on component mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    const savedName = localStorage.getItem('userName');
    if (savedAvatar) {
      setAvatarImage(savedAvatar);
    }
    if (savedName) {
      setUserName(savedName);
    }
    
    // Calculate today's study time
    const savedSessions = localStorage.getItem('studySessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      const today = new Date().toDateString();
      const todaySessions = sessions.filter((s: any) => s.date === today);
      const totalMinutes = todaySessions.reduce((sum: number, s: any) => sum + s.duration, 0);
      setTodayStudyTime(totalMinutes);
    }
    
    // Trigger entrance animation
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);
  
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className={`min-h-screen relative p-4 overflow-hidden transition-all duration-1000 ${isLoaded ? 'animate-dashboard-entrance' : 'opacity-0 scale-95'}`}>
      <EducationalBackground variant="secondary" />
      
      {/* Main decorative elements scattered around the entire screen */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top area decorations */}
        <div className="absolute top-16 left-12 text-2xl opacity-10 educational-float">🎯</div>
        <div className="absolute top-24 right-16 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '0.7s' }}>🚀</div>
        <div className="absolute top-40 left-20 text-lg opacity-10 twinkle-animation" style={{ animationDelay: '1.2s' }}>🌈</div>
        <div className="absolute top-48 right-24 text-lg opacity-15 dance-animation" style={{ animationDelay: '0.4s' }}>🎨</div>
        
        {/* Middle area decorations */}
        <div className="absolute top-1/3 left-8 text-xl opacity-10 dance-animation" style={{ animationDelay: '1.8s' }}>🔬</div>
        <div className="absolute top-1/3 right-12 text-lg opacity-15 twinkle-animation" style={{ animationDelay: '2.3s' }}>⚗️</div>
        <div className="absolute top-1/2 left-16 text-md opacity-10 gentle-pulse" style={{ animationDelay: '0.6s' }}>🧪</div>
        <div className="absolute top-1/2 right-20 text-md opacity-15 educational-float" style={{ animationDelay: '1.5s' }}>🔍</div>
        
        {/* Bottom area decorations */}
        <div className="absolute bottom-32 left-10 text-lg opacity-10 educational-float" style={{ animationDelay: '2.1s' }}>🎪</div>
        <div className="absolute bottom-28 right-14 text-lg opacity-15 gentle-pulse" style={{ animationDelay: '1.4s' }}>🎭</div>
        <div className="absolute bottom-24 left-24 text-md opacity-10 subtle-bounce" style={{ animationDelay: '0.8s' }}>🎊</div>
        <div className="absolute bottom-20 right-28 text-md opacity-15 sparkle-animation" style={{ animationDelay: '1.9s' }}>🎈</div>
        
        {/* Corner decorations */}
        <div className="absolute top-8 left-4 text-lg opacity-15 educational-float" style={{ animationDelay: '0.3s' }}>⭐</div>
        <div className="absolute top-12 right-8 text-lg opacity-10 gentle-pulse" style={{ animationDelay: '1.7s' }}>💫</div>
        <div className="absolute bottom-16 left-6 text-lg opacity-15 subtle-bounce" style={{ animationDelay: '2.5s' }}>✨</div>
        <div className="absolute bottom-12 right-4 text-lg opacity-10 sparkle-animation" style={{ animationDelay: '1.3s' }}>🌟</div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className={`relative flex items-center mb-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-3xl overflow-hidden transition-all duration-700 ${isLoaded ? 'animate-slide-down' : 'opacity-0 -translate-y-10'}`}>
          {/* Enhanced header decorative elements */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute -top-2 -right-2 text-6xl educational-float">📚</div>
            <div className="absolute -bottom-2 -left-2 text-4xl sparkle-animation" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute top-2 right-1/3 text-3xl gentle-pulse" style={{ animationDelay: '1s' }}>🎯</div>
            <div className="absolute top-4 left-1/4 text-2xl subtle-bounce" style={{ animationDelay: '1.5s' }}>🚀</div>
            <div className="absolute bottom-4 right-1/4 text-2xl educational-float" style={{ animationDelay: '2s' }}>🏆</div>
            <div className="absolute top-6 right-12 text-xl gentle-pulse" style={{ animationDelay: '0.7s' }}>💡</div>
            <div className="absolute bottom-6 left-12 text-xl sparkle-animation" style={{ animationDelay: '1.8s' }}>⚡</div>
          </div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div 
              className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer group hover:bg-gray-100 transition-colors"
              onClick={handleAvatarClick}
            >
              {avatarImage ? (
                <img 
                  src={avatarImage} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-red-500" />
              )}
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Xin chào{userName ? ` ${userName}` : ""}!</h2>
              <p className="text-red-100 text-sm">Chào mừng đến với T-learn</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>



        {/* AI Features Section */}
        <div className={`mb-8 relative transition-all duration-900 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          {/* Decorative icons around AI section */}
          <div className="absolute -top-4 -left-4 text-2xl opacity-20 educational-float">🤖</div>
          <div className="absolute -top-2 -right-6 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '0.5s' }}>🧠</div>
          <div className="absolute top-8 -left-6 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '1s' }}>💡</div>
          <div className="absolute top-12 -right-4 text-lg opacity-15 sparkle-animation">⚡</div>
          <div className="absolute bottom-2 -left-2 text-md opacity-10 educational-float" style={{ animationDelay: '1.5s' }}>🔮</div>
          <div className="absolute bottom-4 -right-2 text-md opacity-15 gentle-pulse" style={{ animationDelay: '2s' }}>🎪</div>

          <h3 className="text-lg font-semibold text-gray-700 mb-4">Tiện ích AI</h3>
          <div className="grid grid-cols-3 gap-4">
            {aiFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={feature.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-0 shadow-sm ${isLoaded ? 'animate-card-appear' : 'opacity-0 scale-75'}`}
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                  onClick={() => onFeatureSelect(feature.id)}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-3 transition-colors duration-200 relative`}>
                      <IconComponent className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{feature.title}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Progress Tracking Section */}
        <div className={`mb-8 relative transition-all duration-1000 ${isLoaded ? 'animate-slide-left' : 'opacity-0 -translate-x-10'}`}>
          {/* Decorative icons around Progress section */}
          <div className="absolute -top-6 -left-8 text-2xl opacity-20 educational-float" style={{ animationDelay: '0.3s' }}>📊</div>
          <div className="absolute -top-4 -right-8 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '0.8s' }}>📈</div>
          <div className="absolute top-4 -left-10 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '1.3s' }}>⏰</div>
          <div className="absolute top-8 -right-6 text-lg opacity-15 sparkle-animation" style={{ animationDelay: '0.2s' }}>🏆</div>
          <div className="absolute bottom-0 -left-4 text-md opacity-10 educational-float" style={{ animationDelay: '1.8s' }}>📋</div>
          <div className="absolute bottom-2 -right-8 text-md opacity-15 gentle-pulse" style={{ animationDelay: '2.3s' }}>💪</div>

          <h3 className="text-lg font-semibold text-gray-700 mb-4">Theo dõi tiến độ</h3>
          <div className="grid grid-cols-1 gap-4">
            <Card
              className="p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-0 shadow-sm bg-gradient-to-r from-red-50 to-blue-50"
              onClick={() => onFeatureSelect('progress-tracker')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Tiến độ học tập</p>
                    <p className="text-sm text-gray-600">Theo dõi thời gian và hiệu quả học tập</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Hôm nay</p>
                  <p className="font-semibold text-red-500">{formatStudyTime(todayStudyTime)}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Dictionary Section */}
        <div className={`mb-8 relative transition-all duration-1050 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          {/* Decorative icons around Dictionary section */}
          <div className="absolute -top-6 -left-6 text-2xl opacity-20 educational-float" style={{ animationDelay: '0.5s' }}>📚</div>
          <div className="absolute -top-4 -right-8 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '1s' }}>🌐</div>
          <div className="absolute top-4 -left-10 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '1.5s' }}>🔤</div>
          <div className="absolute top-8 -right-6 text-lg opacity-15 sparkle-animation" style={{ animationDelay: '0.3s' }}>💬</div>
          <div className="absolute bottom-2 -left-4 text-md opacity-10 educational-float" style={{ animationDelay: '2s' }}>🎯</div>
          <div className="absolute bottom-4 -right-8 text-md opacity-15 gentle-pulse" style={{ animationDelay: '2.5s' }}>✨</div>
          <div className="absolute top-12 left-1/4 text-md opacity-10 twinkle-animation" style={{ animationDelay: '1.2s' }}>🔍</div>
          <div className="absolute bottom-6 right-1/3 text-md opacity-15 dance-animation" style={{ animationDelay: '1.8s' }}>🎪</div>

          <h3 className="text-lg font-semibold text-gray-700 mb-4">Tra cứu từ điển</h3>
          <div className="grid grid-cols-1 gap-4">
            <Card
              className="p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 relative overflow-hidden"
              onClick={() => onFeatureSelect('dictionary')}
            >
              {/* Background decorative elements */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-8 text-4xl educational-float">📖</div>
                <div className="absolute top-6 right-12 text-3xl gentle-pulse" style={{ animationDelay: '0.7s' }}>🌍</div>
                <div className="absolute bottom-4 left-12 text-2xl subtle-bounce" style={{ animationDelay: '1.4s' }}>🔤</div>
                <div className="absolute bottom-6 right-8 text-2xl sparkle-animation" style={{ animationDelay: '0.9s' }}>💭</div>
                <div className="absolute top-8 left-1/3 text-xl twinkle-animation" style={{ animationDelay: '1.8s' }}>🎵</div>
                <div className="absolute bottom-8 right-1/3 text-xl dance-animation" style={{ animationDelay: '1.1s' }}>🗣️</div>
                <div className="absolute top-10 right-1/4 text-lg educational-float" style={{ animationDelay: '2.2s' }}>🔊</div>
                <div className="absolute bottom-10 left-1/4 text-lg gentle-pulse" style={{ animationDelay: '1.6s' }}>📝</div>
                <div className="absolute top-12 left-1/2 text-md subtle-bounce" style={{ animationDelay: '0.5s' }}>🎯</div>
                <div className="absolute bottom-12 right-1/2 text-md sparkle-animation" style={{ animationDelay: '2.7s' }}>✏️</div>
              </div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center relative">
                      <BookOpen className="w-7 h-7 text-white" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Languages className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                      <Volume2 className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Tra cứu từ điển</p>
                    <p className="text-sm text-gray-600">Dịch và phiên âm Anh-Việt, Việt-Anh</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">🇺🇸 Tiếng Anh</span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">🇻🇳 Tiếng Việt</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">🔊 Phiên âm</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center">
                      <span className="text-white text-xl">🌐</span>
                    </div>
                    <p className="text-xs text-gray-500">Miễn phí</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Support Tools Section */}
        <div className={`mb-8 relative transition-all duration-1100 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          {/* Decorative icons around Support Tools section */}
          <div className="absolute -top-6 -left-6 text-2xl opacity-20 educational-float" style={{ animationDelay: '0.4s' }}>🛠️</div>
          <div className="absolute -top-4 -right-10 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '0.9s' }}>⚙️</div>
          <div className="absolute top-6 -left-12 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '1.4s' }}>🎲</div>
          <div className="absolute top-12 -right-8 text-lg opacity-15 sparkle-animation" style={{ animationDelay: '0.7s' }}>🧩</div>
          <div className="absolute top-20 -left-8 text-md opacity-10 educational-float" style={{ animationDelay: '1.9s' }}>🎨</div>
          <div className="absolute top-24 -right-10 text-md opacity-15 gentle-pulse" style={{ animationDelay: '2.4s' }}>🎪</div>
          <div className="absolute bottom-8 -left-6 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '0.6s' }}>🎭</div>
          <div className="absolute bottom-4 -right-4 text-lg opacity-15 sparkle-animation" style={{ animationDelay: '1.2s' }}>🎊</div>
          <div className="absolute bottom-0 left-1/4 text-md opacity-10 educational-float" style={{ animationDelay: '2.1s' }}>🎈</div>
          <div className="absolute bottom-2 right-1/3 text-md opacity-15 gentle-pulse" style={{ animationDelay: '1.7s' }}>🎀</div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Công cụ hỗ trợ</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {supportTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-0 shadow-sm ${isLoaded ? 'animate-card-appear' : 'opacity-0 scale-75'}`}
                  style={{ animationDelay: `${index * 80 + 800}ms` }}
                  onClick={() => onFeatureSelect(tool.id)}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-2xl ${tool.color} flex items-center justify-center mx-auto mb-3 transition-colors duration-200`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">{tool.title}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 relative">
          {/* Footer decorative elements */}
          <div className="absolute -top-4 left-10 text-lg opacity-15 educational-float" style={{ animationDelay: '1.1s' }}>🌟</div>
          <div className="absolute -top-2 right-10 text-lg opacity-10 gentle-pulse" style={{ animationDelay: '1.6s' }}>🎓</div>
          <div className="absolute -bottom-2 left-1/4 text-md opacity-15 subtle-bounce" style={{ animationDelay: '2.2s' }}>📖</div>
          <div className="absolute -bottom-4 right-1/4 text-md opacity-10 sparkle-animation" style={{ animationDelay: '0.9s' }}>✏️</div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              @Bản quyền thuộc về Anh Thông😎😎
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
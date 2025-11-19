import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { 
  Brain, 
  MessageCircle, 
  Upload, 
  Layers, 
  CheckSquare, 
  AlarmClock, 
  Calendar, 
  Shirt, 
  Timer, 
  Heart, 
  Archive,
  StickyNote,
  User,
  Camera,
  Bell,
  Settings as SettingsIcon,
  TrendingUp,
  BookOpen,
  Languages,
  Volume2,
  Users
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { EducationalBackground } from "./educational-background";
import { AIBannerCarousel } from "./ai-banner-carousel";
import { Settings } from "./settings";

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
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nhắc nhở học tập",
      message: "Đã đến giờ ôn tập môn Toán!",
      time: "5 phút trước",
      read: false,
      type: "study" as const
    },
    {
      id: 2,
      title: "Báo thức",
      message: "Báo thức lúc 7:00 sẽ rung sau 30 phút",
      time: "30 phút trước",
      read: false,
      type: "alarm" as const
    },
    {
      id: 3,
      title: "Đồng phục",
      message: "Hôm nay mặc đồng phục thể dục",
      time: "1 giờ trước",
      read: true,
      type: "uniform" as const
    },
    {
      id: 4,
      title: "Nhiệm vụ hoàn thành",
      message: "Bạn đã hoàn thành bài tập Văn",
      time: "2 giờ trước",
      read: true,
      type: "task" as const
    }
  ]);
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

  const handleClearAllData = () => {
    // Clear all app data from localStorage except userName and avatar
    const keysToRemove = [
      'slangDictionary_customWords',
      'studySchedules',
      'storage_files',
      'studyTasks',
      'userNotes',
      'flashcard-decks',
      'flashcards',
      'flashcard-user-stats',
      'studyAlarms',
      'uniformRules'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    toast.success("Đã xóa dữ liệu!", {
      description: "Tất cả dữ liệu học tập đã được xóa. Tên và ảnh đại diện vẫn được giữ nguyên.",
      duration: 3000,
    });
    
    setShowDataDialog(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("studyai_auth");
    window.location.reload();
  };

  return (
    <div className={`min-h-screen relative p-4 overflow-hidden transition-all duration-1000 ${isLoaded ? 'animate-dashboard-entrance' : 'opacity-0 scale-95'} bg-white`}>
      <EducationalBackground variant="secondary" />
      
      {/* Main decorative elements scattered around the entire screen */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top area decorations */}
        <div className="absolute top-16 left-12 text-2xl opacity-10 educational-float">🎯</div>
        <div className="absolute top-24 right-16 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '0.7s' }}>🚀</div>
        <div className="absolute top-40 left-20 text-lg opacity-10 twinkle-animation" style={{ animationDelay: '1.2s' }}>🌈</div>
        <div className="absolute top-48 right-24 text-lg opacity-15 dance-animation" style={{ animationDelay: '0.4s' }}></div>
        
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
        <div className={`relative flex items-center mb-2 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-3xl overflow-hidden transition-all duration-700 ${isLoaded ? 'animate-slide-down' : 'opacity-0 -translate-y-10'}`}>
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
          
          <div className="relative z-10 flex items-center justify-between flex-1">
            <div className="flex items-center gap-4">
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
                <p className="text-red-100 text-sm">Chào mừng đến vi T-learn</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setShowNotifications(true)}
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/20 hover:bg-white/30 text-white relative"
                title="Thông báo"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-red-600 rounded-full text-xs flex items-center justify-center animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
              
              <Button
                onClick={() => setShowSettingsDialog(true)}
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/20 hover:bg-white/30 text-white"
                title="Cài đặt"
              >
                <SettingsIcon className="w-5 h-5" />
              </Button>
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
        <div className={`mb-3 relative transition-all duration-900 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          {/* Decorative icons around AI section */}
          <div className="absolute -top-4 -left-4 text-2xl opacity-20 educational-float">🤖</div>
          <div className="absolute -top-2 -right-6 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '0.5s' }}>🧠</div>
          <div className="absolute top-8 -left-6 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '1s' }}>💡</div>
          <div className="absolute top-12 -right-4 text-lg opacity-15 sparkle-animation">⚡</div>
          <div className="absolute bottom-2 -left-2 text-md opacity-10 educational-float" style={{ animationDelay: '1.5s' }}>🔮</div>
          <div className="absolute bottom-4 -right-2 text-md opacity-15 gentle-pulse" style={{ animationDelay: '2s' }}>🎪</div>

          <h3 className="text-lg font-semibold mb-2 text-gray-700">Tiện ích AI</h3>
          <div className="grid grid-cols-3 gap-2">
            {aiFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={feature.id}
                  className={`p-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-0 shadow-sm ${isLoaded ? 'animate-card-appear' : 'opacity-0 scale-75'} bg-white`}
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                  onClick={() => onFeatureSelect(feature.id)}
                >
                  <div className="text-center">
                    <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mx-auto mb-2 transition-colors duration-200 relative`}>
                      <IconComponent className="w-5 h-5 text-white" />
                      <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px]">!</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-800">{feature.title}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI Banner Carousel Section */}
        <div className={`mb-3 relative transition-all duration-1050 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          {/* Decorative icons around Banner section */}
          <div className="absolute -top-6 -left-6 text-2xl opacity-20 educational-float" style={{ animationDelay: '0.6s' }}>🎯</div>
          <div className="absolute -top-4 -right-8 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '1.1s' }}>🚀</div>
          <div className="absolute top-6 -left-8 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '1.6s' }}>💡</div>
          <div className="absolute top-12 -right-6 text-lg opacity-15 sparkle-animation" style={{ animationDelay: '0.4s' }}>⚡</div>
          <div className="absolute bottom-4 -left-4 text-md opacity-10 educational-float" style={{ animationDelay: '2.1s' }}>🌟</div>
          <div className="absolute bottom-6 -right-8 text-md opacity-15 gentle-pulse" style={{ animationDelay: '2.6s' }}>🎨</div>

          
          <AIBannerCarousel onBannerClick={onFeatureSelect} />
        </div>

        {/* Progress Tracking Section */}
        <div className={`mb-3 relative transition-all duration-1000 ${isLoaded ? 'animate-slide-left' : 'opacity-0 -translate-x-10'}`}>
          {/* Decorative icons around Progress section */}
          <div className="absolute -top-6 -left-8 text-2xl opacity-20 educational-float" style={{ animationDelay: '0.3s' }}>📊</div>
          <div className="absolute -top-4 -right-8 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '0.8s' }}>📈</div>
          <div className="absolute top-4 -left-10 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '1.3s' }}>⏰</div>
          <div className="absolute top-8 -right-6 text-lg opacity-15 sparkle-animation" style={{ animationDelay: '0.2s' }}>🏆</div>
          <div className="absolute bottom-0 -left-4 text-md opacity-10 educational-float" style={{ animationDelay: '1.8s' }}>📋</div>
          <div className="absolute bottom-2 -right-8 text-md opacity-15 gentle-pulse" style={{ animationDelay: '2.3s' }}>💪</div>

          
          <div className="grid grid-cols-1 gap-2">
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
                    <p className="text-sm text-gray-600">Theo dõi thời gian học tập</p>
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
        <div className={`mb-3 relative transition-all duration-1050 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          {/* Decorative icons around Dictionary section */}
          <div className="absolute -top-6 -left-6 text-2xl opacity-20 educational-float" style={{ animationDelay: '0.5s' }}>📚</div>
          <div className="absolute -top-4 -right-8 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '1s' }}>🌐</div>
          <div className="absolute top-4 -left-10 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '1.5s' }}>🔤</div>
          <div className="absolute top-8 -right-6 text-lg opacity-15 sparkle-animation" style={{ animationDelay: '0.3s' }}>💬</div>
          <div className="absolute bottom-2 -left-4 text-md opacity-10 educational-float" style={{ animationDelay: '2s' }}>🎯</div>
          <div className="absolute bottom-4 -right-8 text-md opacity-15 gentle-pulse" style={{ animationDelay: '2.5s' }}>✨</div>
          <div className="absolute top-12 left-1/4 text-md opacity-10 twinkle-animation" style={{ animationDelay: '1.2s' }}>🔍</div>
          <div className="absolute bottom-6 right-1/3 text-md opacity-15 dance-animation" style={{ animationDelay: '1.8s' }}>🎪</div>

          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tra cứu </h3>
          <div className="grid grid-cols-1 gap-2">
            <Card
              className="p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 relative overflow-hidden"
              onClick={() => onFeatureSelect('dictionary')}
            >
              {/* Background decorative elements */}
              <div className="absolute inset-0 opacity-5 overflow-hidden">
                <div className="absolute top-2 left-4 text-xl sm:text-2xl educational-float">📖</div>
                <div className="absolute top-4 right-6 text-lg sm:text-xl gentle-pulse" style={{ animationDelay: '0.7s' }}>🌍</div>
                <div className="absolute bottom-2 left-6 text-base sm:text-lg subtle-bounce" style={{ animationDelay: '1.4s' }}>🔤</div>
                <div className="absolute bottom-4 right-4 text-base sm:text-lg sparkle-animation" style={{ animationDelay: '0.9s' }}>💭</div>
                <div className="absolute top-6 left-1/3 text-sm sm:text-base twinkle-animation" style={{ animationDelay: '1.8s' }}>🎵</div>
                <div className="absolute bottom-6 right-1/3 text-sm sm:text-base dance-animation" style={{ animationDelay: '1.1s' }}>🗣️</div>
                <div className="absolute top-8 right-1/4 text-xs sm:text-sm educational-float hidden sm:block" style={{ animationDelay: '2.2s' }}>🔊</div>
                <div className="absolute bottom-8 left-1/4 text-xs sm:text-sm gentle-pulse hidden sm:block" style={{ animationDelay: '1.6s' }}>📝</div>
                <div className="absolute top-10 left-1/2 text-xs sm:text-sm subtle-bounce hidden md:block" style={{ animationDelay: '0.5s' }}>🎯</div>
                <div className="absolute bottom-10 right-1/2 text-xs sm:text-sm sparkle-animation hidden md:block" style={{ animationDelay: '2.7s' }}>✏️</div>
              </div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center relative">
                      <BookOpen className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Languages className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Tra cứu từ điển</p>
                    <p className="text-sm text-gray-600">Dịch và phiên âm Anh-Việt, Việt-Anh</p>
                    <div className="flex gap-2 mt-1.5">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">🇺🇸 Tiếng Anh</span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">🇻🇳 Tiếng Việt</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">🔊 Phiên âm</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Slang Dictionary Section */}
        <div className={`mb-3 relative transition-all duration-1150 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Từ điển Tiếng Lóng</h3>
          <div className="grid grid-cols-1 gap-2">
            <Card
              className="p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg border-0 shadow-sm"
              style={{ 
                background: 'linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 100%)',
              }}
              onClick={() => onFeatureSelect('slang-dictionary')}
            >
              <div className="flex items-center gap-4">
                <div className="flex gap-2 flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                    style={{ background: 'linear-gradient(135deg, #D2691E 0%, #8B4513 100%)' }}
                  >
                    <span className="text-xl">🇻🇳</span>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                    style={{ background: 'linear-gradient(135deg, #CD853F 0%, #A0826D 100%)' }}
                  >
                    <span className="text-xl">💬</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">Từ điển Tiếng Lóng Việt Nam</p>
                  <p className="text-sm text-gray-600">Khám phá tiếng lóng đầy màu sắc của Việt Nam</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-xs whitespace-nowrap" style={{ backgroundColor: '#FFE4B5', color: '#8B4513' }}>
                      Gen Z
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs whitespace-nowrap" style={{ backgroundColor: '#F5DEB3', color: '#8B4513' }}>
                      Trending
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs whitespace-nowrap" style={{ backgroundColor: '#FFDAB9', color: '#8B4513' }}>
                      Địa phương
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Support Tools Section */}
        <div className={`mb-3 relative transition-all duration-1100 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          {/* Decorative icons around Support Tools section */}
          <div className="absolute -top-6 -left-6 text-2xl opacity-20 educational-float" style={{ animationDelay: '0.4s' }}>🛠️</div>
          <div className="absolute -top-4 -right-10 text-xl opacity-15 gentle-pulse" style={{ animationDelay: '0.9s' }}>️</div>
          <div className="absolute top-6 -left-12 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '1.4s' }}>🎲</div>
          <div className="absolute top-12 -right-8 text-lg opacity-15 sparkle-animation" style={{ animationDelay: '0.7s' }}>🧩</div>
          <div className="absolute top-20 -left-8 text-md opacity-10 educational-float" style={{ animationDelay: '1.9s' }}>🎨</div>
          <div className="absolute top-24 -right-10 text-md opacity-15 gentle-pulse" style={{ animationDelay: '2.4s' }}>🎪</div>
          <div className="absolute bottom-8 -left-6 text-lg opacity-10 subtle-bounce" style={{ animationDelay: '0.6s' }}>🎭</div>
          <div className="absolute bottom-4 -right-4 text-lg opacity-15 sparkle-animation" style={{ animationDelay: '1.2s' }}>🎊</div>
          <div className="absolute bottom-0 left-1/4 text-md opacity-10 educational-float" style={{ animationDelay: '2.1s' }}>🎈</div>
          <div className="absolute bottom-2 right-1/3 text-md opacity-15 gentle-pulse" style={{ animationDelay: '1.7s' }}>🎀</div>

          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Công cụ hỗ trợ</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {supportTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-0 shadow-sm ${isLoaded ? 'animate-card-appear' : 'opacity-0 scale-75'} bg-white`}
                  style={{ animationDelay: `${index * 80 + 800}ms` }}
                  onClick={() => onFeatureSelect(tool.id)}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`p-3 rounded-2xl ${tool.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">{tool.title}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* My Classroom Section */}
        <div className={`mb-3 relative transition-all duration-1150 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '1200ms' }}>
          {/* Decorative elements */}
          <div className="absolute top-2 right-6 text-lg opacity-15 gentle-float" style={{ animationDelay: '0.8s' }}>👨‍🏫</div>
          <div className="absolute -top-2 left-12 text-sm opacity-15 educational-float" style={{ animationDelay: '1.2s' }}>📝</div>
          <div className="absolute bottom-4 -right-8 text-md opacity-15 gentle-pulse" style={{ animationDelay: '2.4s' }}>🏫</div>

          <h3 className="text-lg font-semibold mb-2 text-gray-700">Lớp học</h3>
          <div className="grid grid-cols-1 gap-2">
            <Card
              className="p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-0 shadow-sm relative overflow-hidden bg-gradient-to-r from-green-50 to-blue-50"
              onClick={() => onFeatureSelect('my-classroom')}
            >
              {/* Decorative elements */}
              <div className="absolute top-1 right-2 text-md opacity-10">📚</div>
              <div className="absolute bottom-1 left-2 text-xs opacity-10">✏️</div>

              {/* Top row - Icons */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-md">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-md">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Lớp học của tôi</p>
                    <p className="text-sm text-gray-600">Nhận bài tập và chat trực tiếp với giáo viên</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t relative border-gray-200">
          {/* Footer decorative elements */}
          <div className="absolute -top-4 left-10 text-lg opacity-15 educational-float" style={{ animationDelay: '1.1s' }}>🌟</div>
          <div className="absolute -top-3 right-16 text-md opacity-15 gentle-pulse" style={{ animationDelay: '1.5s' }}>💡</div>
          <div className="absolute -bottom-2 right-1/3 text-sm opacity-15 dance-animation" style={{ animationDelay: '2.0s' }}>🎨</div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              @Bản quyền thuộc về Anh Thông😎😎
            </p>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 p-0 overflow-y-auto bg-white border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Cài đặt</DialogTitle>
            <DialogDescription>Quản lý thông tin cá nhân và cài đặt tài khoản</DialogDescription>
          </DialogHeader>
          <Settings userName={userName} onLogout={handleLogout} />
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Thông báo
            </DialogTitle>
            <DialogDescription>
              {notifications.filter(n => !n.read).length > 0 
                ? `Bạn có ${notifications.filter(n => !n.read).length} thông báo chưa đọc`
                : "Không có thông báo mới"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 py-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const iconMap = {
                  study: <BookOpen className="w-5 h-5 text-blue-500" />,
                  alarm: <AlarmClock className="w-5 h-5 text-orange-500" />,
                  uniform: <Shirt className="w-5 h-5 text-purple-500" />,
                  task: <CheckSquare className="w-5 h-5 text-green-500" />,
                };

                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border transition-all ${
                      notification.read
                        ? "bg-gray-50 border-gray-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="shrink-0 mt-0.5">{iconMap[notification.type]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm mb-2 text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-4 border-t flex gap-2 border-gray-200">
            <Button
              onClick={() => {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
                toast.success("Đã đánh dấu tất cả là đã đọc");
              }}
              variant="outline"
              className="flex-1"
            >
              Đánh dấu đã đọc
            </Button>
            <Button
              onClick={() => {
                setNotifications([]);
                toast.success("Đã xóa tất cả thông báo");
              }}
              variant="outline"
              className="flex-1"
            >
              Xóa tất cả
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
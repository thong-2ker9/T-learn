import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Play,
  BookOpen,
  Brain,
  Star,
  Trophy,
  Target,
  Lightbulb,
  CheckCircle,
  XCircle,
  Filter,
  FlipVertical,
  ChevronRight,
  ChevronLeft,
  Upload,
  FileText,
  Crown,
  Flame,
  BarChart3,
  Settings,
  Zap,
} from "lucide-react";
import { EducationalBackground } from "./educational-background";
import { toast } from "sonner@2.0.3";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  category: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  createdAt: Date;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewed?: Date;
  priority: number;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  createdAt: Date;
  totalCards: number;
  studiedToday: number;
  averageScore: number;
}

interface StudySession {
  id: string;
  deckId: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: number;
  correctAnswers: number;
  totalTime: number;
  score: number;
}

interface UserStats {
  level: number;
  experience: number;
  streak: number;
  totalCardsStudied: number;
  badges: string[];
  achievements: string[];
  lastActiveDate: string;
}

interface FlashcardsProps {
  onBack: () => void;
}

// Modern Flip Card Component
const ModernFlashCard = ({
  card,
  showAnswer,
  onFlip,
  onMarkCard,
  isAnimating,
}: {
  card: Flashcard;
  showAnswer: boolean;
  onFlip: () => void;
  onMarkCard: (isCorrect: boolean) => void;
  isAnimating: boolean;
}) => {
  const [swipeDirection, setSwipeDirection] = useState<
    "left" | "right" | null
  >(null);
  const [touchStart, setTouchStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!showAnswer || isAnimating) return;

    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!showAnswer || !touchStart || isAnimating) return;

    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };

    setTouchEnd(currentTouch);

    const deltaX = currentTouch.x - touchStart.x;
    const deltaY = currentTouch.y - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffset(deltaX);
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (
      !touchStart ||
      !touchEnd ||
      !showAnswer ||
      isAnimating
    ) {
      setDragOffset(0);
      return;
    }

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe =
      Math.abs(distanceX) > Math.abs(distanceY);

    if (
      isHorizontalSwipe &&
      Math.abs(distanceX) > minSwipeDistance
    ) {
      const direction = distanceX > 0 ? "left" : "right";
      handleSwipe(direction);
    }

    setTouchStart(null);
    setTouchEnd(null);
    setDragOffset(0);
  };

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);

    setTimeout(() => {
      onMarkCard(direction === "right");
      setSwipeDirection(null);
    }, 300);
  };

  const getCardStyle = () => {
    if (swipeDirection) {
      return {
        transform: `translateX(${swipeDirection === "left" ? "-120%" : "120%"}) rotate(${swipeDirection === "left" ? "-20deg" : "20deg"})`,
        opacity: 0,
        transition: "all 0.3s ease-out",
      };
    }

    if (dragOffset !== 0) {
      const rotation = dragOffset * 0.1;
      const opacity = Math.max(
        0.7,
        1 - Math.abs(dragOffset) / 200,
      );
      return {
        transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
        opacity,
        transition: "none",
      };
    }

    return {};
  };

  const getBackgroundColor = () => {
    if (dragOffset > 50)
      return "bg-gradient-to-br from-green-400 to-emerald-500";
    if (dragOffset < -50)
      return "bg-gradient-to-br from-red-400 to-rose-500";
    return "bg-gradient-to-br from-blue-400 to-purple-500";
  };

  return (
    <div className="relative w-full max-w-sm mx-auto h-[350px] sm:h-[400px] perspective-1000">
      {/* Swipe Indicators */}
      {showAnswer && !isAnimating && (
        <>
          <div
            className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-200 ${dragOffset < -50 ? "scale-125 opacity-100" : "scale-100 opacity-60"}`}
          >
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs text-red-600 mt-1 text-center font-medium">
              Đang học 
            </div>
          </div>
          <div
            className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-200 ${dragOffset > 50 ? "scale-125 opacity-100" : "scale-100 opacity-60"}`}
          >
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs text-green-600 mt-1 text-center font-medium">
              Đã nhớ
            </div>
          </div>
        </>
      )}

      {/* Main Card */}
      <div
        className={`flip-card w-full h-full cursor-pointer ${showAnswer ? "flipped" : ""}`}
        onClick={!showAnswer ? onFlip : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          ...getCardStyle(),
          touchAction: showAnswer ? "none" : "auto",
        }}
      >
        {/* Front Side - Question */}
        <div className="flip-card-front absolute inset-0">
          <div
            className={`w-full h-full ${getBackgroundColor()} rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center text-white relative overflow-hidden`}
          >
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Brain className="w-3 h-3" />
              </div>
              <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                {card.reviewCount} lần
              </div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <div className="text-xs sm:text-sm mb-3 sm:mb-4 flex items-center justify-center gap-2 opacity-90">
                <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
                CÂU HỎI
              </div>
              <div className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 leading-relaxed max-h-40 overflow-y-auto">
                {card.front}
              </div>
              <div className="text-xs sm:text-sm opacity-75 flex items-center justify-center gap-2">
                <FlipVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                Nhấn để lật thẻ
              </div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-16 left-16 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute bottom-16 right-16 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute top-24 right-24 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Back Side - Answer */}
        <div className="flip-card-back absolute inset-0">
          <div className="w-full h-full bg-white rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">
                  ĐÁP ÁN
                </span>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                📂 {card.category}
              </div>
            </div>

            {/* Answer Content */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="text-base sm:text-lg text-gray-800 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-32 sm:max-h-40 w-full text-center">
                {card.back}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <Button
                onClick={() => handleSwipe("left")}
                variant="outline"
                size="sm"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 active:scale-95 transition-all text-xs sm:text-sm"
                disabled={isAnimating}
              >
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Đang học
              </Button>
              <Button
                onClick={() => handleSwipe("right")}
                size="sm"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white active:scale-95 transition-all text-xs sm:text-sm"
                disabled={isAnimating}
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Đã nhớ
              </Button>
            </div>

            {/* Swipe hint */}
            <div className="mt-3 sm:mt-4 text-xs text-gray-400 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" />
                <span>Vuốt trái: Đang học</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Vuốt phải: Đã nhớ</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Quiz Card Component
const QuizCard = ({
  card,
  quizMode,
  onAnswer,
}: {
  card: Flashcard;
  quizMode: any;
  onAnswer: (answer: string) => void;
}) => {
  const [selectedOption, setSelectedOption] = useState<
    string | null
  >(null);

  const handleOptionClick = (option: string) => {
    if (quizMode.showResult) return;

    setSelectedOption(option);
    setTimeout(() => {
      onAnswer(option);
      setSelectedOption(null);
    }, 200);
  };

  return (
    <div className="w-full max-w-md mx-auto h-[400px] sm:h-[450px]">
      <div className="h-full bg-gradient-to-br from-red-400 to-red-600 rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-8 left-8 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-2 text-purple-200 mb-3 sm:mb-4">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">
                TRẮC NGHIỆM
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold mb-2 leading-relaxed">
              {card.front}
            </div>
          </div>

          {/* Options Container with Custom Scrollbar */}
          <div className="flex-1 relative">
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-2 sm:space-y-3">
                {quizMode.options.map(
                  (option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      disabled={quizMode.showResult}
                      className={`w-full p-3 sm:p-4 text-left rounded-xl sm:rounded-2xl transition-all duration-300 ${
                        selectedOption === option
                          ? "bg-white/30 scale-98"
                          : quizMode.showResult
                            ? option === quizMode.correctAnswer
                              ? "bg-green-500 shadow-lg animate-quiz-correct"
                              : option ===
                                    quizMode.selectedAnswer &&
                                  option !==
                                    quizMode.correctAnswer
                                ? "bg-red-500 animate-quiz-incorrect"
                                : "bg-white/10 opacity-60"
                            : "bg-white/20 hover:bg-white/30 active:scale-98"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${
                            quizMode.showResult &&
                            option === quizMode.correctAnswer
                              ? "bg-white border-white text-green-500"
                              : quizMode.showResult &&
                                  option ===
                                    quizMode.selectedAnswer &&
                                  option !==
                                    quizMode.correctAnswer
                                ? "bg-white border-white text-red-500"
                                : "border-white text-white"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-xs sm:text-sm leading-tight flex-1 break-words">
                          {option}
                        </span>
                        {quizMode.showResult &&
                          option === quizMode.correctAnswer && (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          )}
                        {quizMode.showResult &&
                          option === quizMode.selectedAnswer &&
                          option !== quizMode.correctAnswer && (
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          )}
                      </div>
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Custom Scrollbar */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20 rounded-full">
              <div className="w-full h-1/3 bg-white/60 rounded-full"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20 text-center">
            <div className="flex items-center justify-center gap-4 text-xs sm:text-sm opacity-80">
              <span>📚 {card.category}</span>
              <span>👁️ {card.reviewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Flashcards({ onBack }: FlashcardsProps) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(
    null,
  );
  const [currentCard, setCurrentCard] =
    useState<Flashcard | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<
    "learn" | "quiz" | null
  >(null);
  const [studySession, setStudySession] =
    useState<StudySession | null>(null);
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('flashcard-user-stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if it's a new day and update streak accordingly
      const lastActiveDate = new Date(parsed.lastActiveDate || Date.now());
      const today = new Date();
      const isNewDay = lastActiveDate.toDateString() !== today.toDateString();
      
      if (isNewDay) {
        const daysDiff = Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...parsed,
          streak: daysDiff > 1 ? 0 : parsed.streak, // Reset streak if more than 1 day gap
          lastActiveDate: today.toISOString(),
        };
      }
      return { ...parsed, lastActiveDate: today.toISOString() };
    }
    
    return {
      level: 1,
      experience: 0,
      streak: 0,
      totalCardsStudied: 0,
      badges: [],
      achievements: [],
      lastActiveDate: new Date().toISOString(),
    };
  });
  const [showCongrats, setShowCongrats] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [isCreateDeckOpen, setIsCreateDeckOpen] =
    useState(false);
  const [isCreateCardOpen, setIsCreateCardOpen] =
    useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    "grid",
  );
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] =
    useState("all");

  const [newDeck, setNewDeck] = useState({
    name: "",
    description: "",
    category: "",
    color: "blue",
  });

  const [newCard, setNewCard] = useState({
    front: "",
    back: "",
    category: "",
    tags: "",
    difficulty: "medium" as const,
  });

  const [quizMode, setQuizMode] = useState({
    options: [] as string[],
    correctAnswer: "",
    selectedAnswer: "",
    showResult: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const deckColors = [
    {
      name: "blue",
      bg: "bg-gradient-to-br from-blue-400 to-blue-600",
      text: "text-white",
    },
    {
      name: "purple",
      bg: "bg-gradient-to-br from-purple-400 to-purple-600",
      text: "text-white",
    },
    {
      name: "green",
      bg: "bg-gradient-to-br from-green-400 to-green-600",
      text: "text-white",
    },
    {
      name: "orange",
      bg: "bg-gradient-to-br from-orange-400 to-orange-600",
      text: "text-white",
    },
    {
      name: "pink",
      bg: "bg-gradient-to-br from-pink-400 to-pink-600",
      text: "text-white",
    },
    {
      name: "cyan",
      bg: "bg-gradient-to-br from-cyan-400 to-cyan-600",
      text: "text-white",
    },
  ];

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Save data
  useEffect(() => {
    if (decks.length > 0) {
      localStorage.setItem(
        "flashcard-decks",
        JSON.stringify(decks),
      );
    }
  }, [decks]);

  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem(
        "flashcards",
        JSON.stringify(flashcards),
      );
    }
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem(
      "flashcard-user-stats",
      JSON.stringify(userStats),
    );
  }, [userStats]);

  const loadData = () => {
    // Load decks
    const savedDecks = localStorage.getItem("flashcard-decks");
    if (savedDecks) {
      const parsed = JSON.parse(savedDecks).map(
        (deck: any) => ({
          ...deck,
          createdAt: new Date(deck.createdAt),
        }),
      );
      setDecks(parsed);
    } else {
      // Sample decks
      const sampleDecks: Deck[] = [
        {
          id: "1",
          name: "Toán học cơ bản",
          description:
            "Các công thức và định lý toán học cơ bản",
          category: "Toán học",
          color: "blue",
          createdAt: new Date(),
          totalCards: 3,
          studiedToday: 2,
          averageScore: 85,
        },
        {
          id: "2",
          name: "Vật lý 12",
          description: "Chương trình vật lý lớp 12",
          category: "Vật lý",
          color: "purple",
          createdAt: new Date(),
          totalCards: 2,
          studiedToday: 1,
          averageScore: 72,
        },
      ];
      setDecks(sampleDecks);
    }

    // Load cards
    const savedCards = localStorage.getItem("flashcards");
    if (savedCards) {
      const parsed = JSON.parse(savedCards).map(
        (card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          lastReviewed: card.lastReviewed
            ? new Date(card.lastReviewed)
            : undefined,
        }),
      );
      setFlashcards(parsed);
    } else {
      // Sample cards
      const sampleCards: Flashcard[] = [
        {
          id: "1",
          front: "Công thức tính diện tích hình tròn?",
          back: "S = π × r²\n\nTrong đó:\n- S: diện tích\n- π ≈ 3.14159\n- r: bán kính",
          deckId: "1",
          category: "Hình học",
          tags: ["công thức", "diện tích", "hình tròn"],
          difficulty: "easy",
          createdAt: new Date(),
          reviewCount: 5,
          correctCount: 4,
          incorrectCount: 1,
          priority: 1,
        },
        {
          id: "2",
          front: "Định luật Ohm",
          back: "V = I × R\n\nTrong đó:\n- V: điện áp (Volt)\n- I: cường độ dòng điện (Ampere)\n- R: điện trở (Ohm)",
          deckId: "2",
          category: "Điện học",
          tags: ["định luật", "điện", "ohm"],
          difficulty: "medium",
          createdAt: new Date(),
          reviewCount: 3,
          correctCount: 2,
          incorrectCount: 1,
          priority: 2,
        },
        {
          id: "3",
          front: "Công thức tính chu vi hình tròn?",
          back: "C = 2 × π × r\nhoặc C = π × d\n\nTrong đó:\n- C: chu vi\n- π ≈ 3.14159\n- r: bán kính\n- d: đường kính",
          deckId: "1",
          category: "Hình học",
          tags: ["công thức", "chu vi", "hình tròn"],
          difficulty: "easy",
          createdAt: new Date(),
          reviewCount: 2,
          correctCount: 1,
          incorrectCount: 1,
          priority: 3,
        },
        {
          id: "4",
          front: "Định luật bảo toàn năng lượng",
          back: "Năng lượng không thể tự sinh ra hoặc tự mất đi, chỉ có thể chuyển h  a từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác.\n\nE₁ = E₂ + Q",
          deckId: "2",
          category: "Cơ học",
          tags: ["định luật", "năng lượng", "bảo toàn"],
          difficulty: "medium",
          createdAt: new Date(),
          reviewCount: 1,
          correctCount: 1,
          incorrectCount: 0,
          priority: 4,
        },
        {
          id: "5",
          front: "Công thức tính thể tích hình cầu?",
          back: "V = (4/3) × π × r³\n\nTrong đó:\n- V: thể tích\n- π ≈ 3.14159\n- r: bán kính",
          deckId: "1",
          category: "Hình học",
          tags: ["công thức", "thể tích", "hình cầu"],
          difficulty: "hard",
          createdAt: new Date(),
          reviewCount: 0,
          correctCount: 0,
          incorrectCount: 0,
          priority: 5,
        },
      ];
      setFlashcards(sampleCards);
    }

    // Load user stats
    const savedStats = localStorage.getItem("user-stats");
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  };

  // File import functionality
  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      try {
        await parseImportedContent(content, file.name);
        toast.success("Import thành công!");
      } catch (error) {
        toast.error(
          "Có lỗi xảy ra khi import file. Vui lòng kiểm tra định dạng.",
        );
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const parseImportedContent = async (
    content: string,
    fileName: string,
  ) => {
    // Create new deck for imported cards
    const newDeck: Deck = {
      id: Date.now().toString(),
      name: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
      description: `Imported from ${fileName}`,
      category: "Imported",
      color: "cyan",
      createdAt: new Date(),
      totalCards: 0,
      studiedToday: 0,
      averageScore: 0,
    };

    const newCards: Flashcard[] = [];

    // Parse different formats
    const lines = content
      .split("\n")
      .filter((line) => line.trim());

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      let front = "";
      let back = "";

      // Try comma-separated format: "Question, Answer"
      if (line.includes(",")) {
        const parts = line.split(",");
        if (parts.length >= 2) {
          front = parts[0].trim();
          back = parts.slice(1).join(",").trim();
        }
      }
      // Try tab-separated format
      else if (line.includes("\t")) {
        const parts = line.split("\t");
        if (parts.length >= 2) {
          front = parts[0].trim();
          back = parts[1].trim();
        }
      }
      // Try semicolon-separated format
      else if (line.includes(";")) {
        const parts = line.split(";");
        if (parts.length >= 2) {
          front = parts[0].trim();
          back = parts[1].trim();
        }
      }
      // Try pipe-separated format
      else if (line.includes("|")) {
        const parts = line.split("|");
        if (parts.length >= 2) {
          front = parts[0].trim();
          back = parts[1].trim();
        }
      }

      if (front && back) {
        const card: Flashcard = {
          id: `imported-${Date.now()}-${i}`,
          front,
          back,
          deckId: newDeck.id,
          category: "Imported",
          tags: ["imported"],
          difficulty: "medium",
          createdAt: new Date(),
          reviewCount: 0,
          correctCount: 0,
          incorrectCount: 0,
          priority: i + 1,
        };
        newCards.push(card);
      }
    }

    if (newCards.length === 0) {
      throw new Error("No valid cards found in file");
    }

    // Update deck with correct card count
    newDeck.totalCards = newCards.length;

    // Save to state
    setDecks((prev) => [newDeck, ...prev]);
    setFlashcards((prev) => [...newCards, ...prev]);

    setIsImportDialogOpen(false);
    toast.success(
      `Đã import ${newCards.length} thẻ thành công!`,
    );
  };

  const createDeck = () => {
    if (!newDeck.name.trim()) {
      toast.error("Vui lòng nhập tên bộ thẻ!");
      return;
    }

    const deck: Deck = {
      id: Date.now().toString(),
      name: newDeck.name.trim(),
      description: newDeck.description.trim(),
      category: newDeck.category.trim() || "Chung",
      color: newDeck.color,
      createdAt: new Date(),
      totalCards: 0,
      studiedToday: 0,
      averageScore: 0,
    };

    setDecks((prev) => [deck, ...prev]);
    setNewDeck({
      name: "",
      description: "",
      category: "",
      color: "blue",
    });
    setIsCreateDeckOpen(false);
    toast.success("Tạo bộ thẻ thành công!");
  };

  const createCard = () => {
    if (
      !currentDeck ||
      !newCard.front.trim() ||
      !newCard.back.trim()
    ) {
      toast.error(
        "Vui lòng chọn bộ thẻ và điền đầy đủ thông tin!",
      );
      return;
    }

    const card: Flashcard = {
      id: Date.now().toString(),
      front: newCard.front.trim(),
      back: newCard.back.trim(),
      deckId: currentDeck.id,
      category: newCard.category.trim() || currentDeck.category,
      tags: newCard.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      difficulty: newCard.difficulty,
      createdAt: new Date(),
      reviewCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      priority:
        flashcards.filter((c) => c.deckId === currentDeck.id)
          .length + 1,
    };

    setFlashcards((prev) => [card, ...prev]);

    // Update deck total cards
    setDecks((prev) =>
      prev.map((deck) =>
        deck.id === currentDeck.id
          ? { ...deck, totalCards: deck.totalCards + 1 }
          : deck,
      ),
    );

    setNewCard({
      front: "",
      back: "",
      category: "",
      tags: "",
      difficulty: "medium",
    });
    setIsCreateCardOpen(false);
    toast.success("Tạo thẻ thành công!");
  };

  const deleteDeck = (deckId: string) => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa bộ thẻ này? Tất cả thẻ trong bộ sẽ bị xóa.",
      )
    ) {
      setDecks((prev) =>
        prev.filter((deck) => deck.id !== deckId),
      );
      setFlashcards((prev) =>
        prev.filter((card) => card.deckId !== deckId),
      );
      if (currentDeck?.id === deckId) {
        setCurrentDeck(null);
      }
      toast.success("Xóa bộ thẻ thành công!");
    }
  };

  const deleteCard = (cardId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa thẻ này?")) {
      const card = flashcards.find((c) => c.id === cardId);
      setFlashcards((prev) =>
        prev.filter((c) => c.id !== cardId),
      );

      if (card) {
        // Update deck total cards
        setDecks((prev) =>
          prev.map((deck) =>
            deck.id === card.deckId
              ? {
                  ...deck,
                  totalCards: Math.max(0, deck.totalCards - 1),
                }
              : deck,
          ),
        );
      }
      toast.success("Xóa thẻ thành công!");
    }
  };

  const startStudySession = (mode: "learn" | "quiz") => {
    if (!currentDeck) return;

    const deckCards = flashcards.filter(
      (card) => card.deckId === currentDeck.id,
    );
    if (deckCards.length === 0) {
      toast.error("Bộ thẻ này chưa có thẻ nào!");
      return;
    }

    setStudyMode(mode);
    setCurrentIndex(0);
    setCurrentCard(deckCards[0]);
    setShowAnswer(false);
    setIsAnimating(false);
    
    // Reset session notifications
    setSessionAchievements([]);
    setSessionLevelUps([]);
    setHasShownSessionSummary(false);

    const session: StudySession = {
      id: Date.now().toString(),
      deckId: currentDeck.id,
      startTime: new Date(),
      cardsStudied: 0,
      correctAnswers: 0,
      totalTime: 0,
      score: 0,
    };
    setStudySession(session);

    if (mode === "quiz") {
      generateQuizOptions(deckCards[0], deckCards);
    }

    toast.success(
      `Bắt đầu ${mode === "learn" ? "học" : "quiz"}!`,
    );
  };

  const generateQuizOptions = (
    card: Flashcard,
    allCards: Flashcard[],
  ) => {
    const otherCards = allCards.filter((c) => c.id !== card.id);
    const wrongOptions = otherCards
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.back);

    const options = [card.back, ...wrongOptions].sort(
      () => Math.random() - 0.5,
    );

    setQuizMode({
      options,
      correctAnswer: card.back,
      selectedAnswer: "",
      showResult: false,
    });
  };

  const handleQuizAnswer = (answer: string) => {
    setQuizMode((prev) => ({
      ...prev,
      selectedAnswer: answer,
      showResult: true,
    }));

    const isCorrect = answer === quizMode.correctAnswer;
    updateCardStats(currentCard!.id, isCorrect);

    setTimeout(() => {
      nextCard();
    }, 2000);
  };

  const markCard = (isCorrect: boolean) => {
    if (!currentCard || isAnimating) return;

    setIsAnimating(true);
    updateCardStats(currentCard.id, isCorrect);

    setTimeout(() => {
      nextCard();
      setIsAnimating(false);
    }, 300);
  };

  const checkAchievements = (newStats: UserStats) => {
    const achievements = [
      {
        id: "beginner",
        name: "Người mới bắt đầu",
        description: "Hoàn thành 10 thẻ đầu tiên",
        threshold: 10,
        icon: "👤",
        unlocked: newStats.totalCardsStudied >= 10,
      },
      {
        id: "studious",
        name: "Học sinh chăm chỉ", 
        description: "Học 50 thẻ",
        threshold: 50,
        icon: "🎓",
        unlocked: newStats.totalCardsStudied >= 50,
      },
      {
        id: "master",
        name: "Bậc thầy ôn tập",
        description: "Học 100 thẻ",
        threshold: 100,
        icon: "👨‍🏫",
        unlocked: newStats.totalCardsStudied >= 100,
      },
      {
        id: "streak_master",
        name: "Streak Master",
        description: "Streak 7 ngày",
        threshold: 7,
        icon: "🔥",
        unlocked: newStats.streak >= 7,
      },
      {
        id: "scholar",
        name: "Học giả",
        description: "Học 200 thẻ",
        threshold: 200,
        icon: "📚",
        unlocked: newStats.totalCardsStudied >= 200,
      },
      {
        id: "perfectionist",
        name: "Người hoàn hảo",
        description: "Đạt 95% độ chính xác",
        threshold: 95,
        icon: "⭐",
        unlocked: calculateAccuracy() >= 95,
      },
    ];

    const newAchievements = achievements.filter(
      achievement => 
        achievement.unlocked && 
        !userStats.achievements.includes(achievement.id)
    );

    return {
      achievements: [
        ...userStats.achievements,
        ...newAchievements.map(a => a.id)
      ],
      newAchievements
    };
  };

  const calculateAccuracy = () => {
    const totalAnswered = flashcards.reduce((sum, card) => 
      sum + card.correctCount + card.incorrectCount, 0
    );
    const totalCorrect = flashcards.reduce((sum, card) => 
      sum + card.correctCount, 0
    );
    
    return totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  };

  // Temporary storage for achievements during session
  const [sessionAchievements, setSessionAchievements] = useState<any[]>([]);
  const [sessionLevelUps, setSessionLevelUps] = useState<number[]>([]);
  const [hasShownSessionSummary, setHasShownSessionSummary] = useState(false);

  // Show session summary notifications
  const showSessionSummary = () => {
    if (hasShownSessionSummary) return; // Prevent duplicate notifications
    
    if (sessionLevelUps.length > 0 || sessionAchievements.length > 0) {
      setHasShownSessionSummary(true);
      
      setTimeout(() => {
        // Show level ups first
        if (sessionLevelUps.length > 0) {
          const highestLevel = Math.max(...sessionLevelUps);
          toast.success(`🎊 Chúc mừng! Bạn đã lên Level ${highestLevel}!`, {
            description: `Bạn đã nhận được bonus XP! Tiếp tục học để lên level cao hơn.`,
            duration: 4000,
          });
        }

        // Show achievements summary
        if (sessionAchievements.length > 0) {
          setTimeout(() => {
            if (sessionAchievements.length === 1) {
              const achievement = sessionAchievements[0];
              toast.success(`🏆 Thành tích mới: ${achievement.name}`, {
                description: achievement.description,
                duration: 5000,
              });
            } else {
              toast.success(`🎉 Bạn đã mở khóa ${sessionAchievements.length} thành tích mới!`, {
                description: sessionAchievements.map(a => a.icon + " " + a.name).join(", "),
                duration: 6000,
              });
            }
          }, sessionLevelUps.length > 0 ? 2000 : 0);
        }
      }, 2500); // Delay to show after completion toast
    }

    // Clear session data
    setSessionAchievements([]);
    setSessionLevelUps([]);
  };

  const updateCardStats = (
    cardId: string,
    isCorrect: boolean,
  ) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              reviewCount: card.reviewCount + 1,
              correctCount: isCorrect
                ? card.correctCount + 1
                : card.correctCount,
              incorrectCount: isCorrect
                ? card.incorrectCount
                : card.incorrectCount + 1,
              lastReviewed: new Date(),
            }
          : card,
      ),
    );

    if (studySession) {
      setStudySession((prev) =>
        prev
          ? {
              ...prev,
              cardsStudied: prev.cardsStudied + 1,
              correctAnswers: isCorrect
                ? prev.correctAnswers + 1
                : prev.correctAnswers,
            }
          : null,
      );
    }

    // Update user stats with level progression (no notifications during session)
    setUserStats((prev) => {
      const newExperience = prev.experience + (isCorrect ? 10 : 5);
      const newLevel = Math.floor(newExperience / 100) + 1;
      const newTotalStudied = prev.totalCardsStudied + 1;
      
      // Store level up for later notification
      if (newLevel > prev.level) {
        setSessionLevelUps(prevLevels => [...prevLevels, newLevel]);
      }

      // Check if it's the first study session today for streak
      const today = new Date().toDateString();
      const lastActiveDate = new Date(prev.lastActiveDate).toDateString();
      const isFirstStudyToday = today !== lastActiveDate;
      
      const newStreak = isCorrect 
        ? (isFirstStudyToday ? prev.streak + 1 : prev.streak)
        : Math.max(0, prev.streak - 1);

      const newStats = {
        ...prev,
        level: newLevel,
        totalCardsStudied: newTotalStudied,
        experience: newExperience + (newLevel > prev.level ? newLevel * 10 : 0),
        streak: newStreak,
        lastActiveDate: new Date().toISOString(),
      };

      // Check for new achievements (store for later notification)
      const achievementResult = checkAchievements(newStats);
      if (achievementResult.newAchievements.length > 0) {
        setSessionAchievements(prev => [...prev, ...achievementResult.newAchievements]);
      }
      
      return {
        ...newStats,
        achievements: achievementResult.achievements,
      };
    });
  };

  const nextCard = () => {
    if (!currentDeck) return;

    const deckCards = flashcards.filter(
      (card) => card.deckId === currentDeck.id,
    );
    const nextIndex = (currentIndex + 1) % deckCards.length;

    if (nextIndex === 0 && studySession) {
      // Completed session
      finishStudySession();
      return;
    }

    setCurrentIndex(nextIndex);
    setCurrentCard(deckCards[nextIndex]);
    setShowAnswer(false);

    if (studyMode === "quiz") {
      generateQuizOptions(deckCards[nextIndex], deckCards);
    }
  };

  const finishStudySession = () => {
    if (!studySession) return;

    const endTime = new Date();
    const totalTime = Math.round(
      (endTime.getTime() - studySession.startTime.getTime()) /
        1000,
    );
    const score = Math.round(
      (studySession.correctAnswers /
        Math.max(studySession.cardsStudied, 1)) *
        100,
    );

    const completedSession = {
      ...studySession,
      endTime,
      totalTime,
      score,
    };

    setStudySession(completedSession);

    // Update deck stats
    if (currentDeck) {
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === currentDeck.id
            ? {
                ...deck,
                studiedToday:
                  deck.studiedToday + studySession.cardsStudied,
                averageScore: Math.round(
                  (deck.averageScore + score) / 2,
                ),
              }
            : deck,
        ),
      );
    }

    // Show congratulations modal immediately
    setShowCongrats(true);
    
    // Show completion toast only if no special achievements
    if (sessionLevelUps.length === 0 && sessionAchievements.length === 0) {
      toast.success(`🎉 Phiên học hoàn thành! Điểm số: ${score}%`, {
        description: `Bạn đã học ${studySession.cardsStudied} thẻ với ${studySession.correctAnswers} câu trả lời đúng.`,
        duration: 4000,
      });
    }
    
    // Show session summary with achievements and level ups
    showSessionSummary();
  };

  const getColorClasses = (colorName: string) => {
    return (
      deckColors.find((c) => c.name === colorName) ||
      deckColors[0]
    );
  };

  const filteredCards = currentDeck
    ? flashcards.filter((card) => {
        if (card.deckId !== currentDeck.id) return false;
        if (
          filterCategory !== "all" &&
          card.category !== filterCategory
        )
          return false;
        if (
          filterDifficulty !== "all" &&
          card.difficulty !== filterDifficulty
        )
          return false;
        return true;
      })
    : [];

  const categories = Array.from(
    new Set(flashcards.map((card) => card.category)),
  );

  // Study Mode View
  if (studyMode && currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <EducationalBackground variant="secondary" />

        <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Button
              onClick={() => {
                setStudyMode(null);
                setShowAnswer(false);
                setIsAnimating(false);
              }}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {studyMode === "learn" ? "Học thẻ" : "Quiz"}
              </h2>
              <p className="text-sm text-gray-600">
                {currentDeck?.name}
              </p>
            </div>

            <div className="text-sm text-gray-600 min-w-0">
              {currentIndex + 1} /{" "}
              {
                flashcards.filter(
                  (card) => card.deckId === currentDeck?.id,
                ).length
              }
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4 sm:mb-6">
            <Progress
              value={
                ((currentIndex + 1) /
                  flashcards.filter(
                    (card) => card.deckId === currentDeck?.id,
                  ).length) *
                100
              }
              className="h-2"
            />
          </div>

          {/* Card Container */}
          <div className="flex justify-center items-center min-h-[350px] sm:min-h-[400px]">
            {studyMode === "learn" ? (
              <ModernFlashCard
                card={currentCard}
                showAnswer={showAnswer}
                onFlip={() => setShowAnswer(true)}
                onMarkCard={markCard}
                isAnimating={isAnimating}
              />
            ) : (
              <QuizCard
                card={currentCard}
                quizMode={quizMode}
                onAnswer={handleQuizAnswer}
              />
            )}
          </div>

          {/* Study Session Stats */}
          {studySession && (
            <div className="mt-4 sm:mt-6">
              <Card className="p-4 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">
                      {studySession.correctAnswers}
                    </div>
                    <div className="text-gray-600">Đã nhớ</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-red-600">
                      {studySession.cardsStudied -
                        studySession.correctAnswers}
                    </div>
                    <div className="text-gray-600">Đang học</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-600">
                      {studySession.cardsStudied}
                    </div>
                    <div className="text-gray-600">Tổng</div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Congratulations Modal */}
        {showCongrats && studySession && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="p-8 max-w-sm w-full text-center bg-white rounded-3xl relative overflow-hidden">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowCongrats(false);
                  setStudyMode(null);
                  setCurrentCard(null);
                  setCurrentIndex(0);
                  setShowAnswer(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              >
                ✕
              </button>

              {/* Celebration Icon */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative">
                  {/* Sparkles */}
                  <div className="absolute -top-2 -left-2 text-yellow-400 text-xl animate-bounce">
                    ✨
                  </div>
                  <div
                    className="absolute -top-1 -right-3 text-yellow-400 text-lg animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  >
                    ⭐
                  </div>
                  <div
                    className="absolute -bottom-2 -right-1 text-yellow-400 text-sm animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  >
                    💫
                  </div>

                  {/* Main Icon */}
                  <span className="text-3xl animate-success-celebration">
                    🎉
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Chúc mừng! 🎊
                </h3>
                <p className="text-gray-600 text-sm">
                  Bạn đã hoàn thành phiên học tập
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {studySession.cardsStudied}
                  </div>
                  <div className="text-xs text-gray-600">
                    Thẻ đã học
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {studySession.score}%
                  </div>
                  <div className="text-xs text-gray-600">
                    Điểm số
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {studySession.correctAnswers}
                  </div>
                  <div className="text-xs text-gray-600">
                    Đúng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {Math.round((studySession.totalTime || 0) / 60) || 0}m
                  </div>
                  <div className="text-xs text-gray-600">
                    Thời gian
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowCongrats(false);
                    setStudyMode(null);
                    setCurrentCard(null);
                    setCurrentIndex(0);
                    setShowAnswer(false);
                  }}
                  variant="outline"
                  className="flex-1 rounded-2xl"
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    setShowCongrats(false);
                    startStudySession(
                      studyMode === "learn" ? "learn" : "quiz",
                    );
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl"
                >
                  Học tiếp
                </Button>
              </div>

              {/* Background decoration */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-4 left-4 w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
                <div
                  className="absolute top-12 right-8 w-1 h-1 bg-purple-300 rounded-full opacity-40 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-50 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-16 right-4 w-1 h-1 bg-yellow-300 rounded-full opacity-30 animate-pulse"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Main View
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
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-purple-700 truncate">
                Flashcard Manager
              </h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                Quản lý và học tập với thẻ ghi nhớ thông minh
              </p>
            </div>
          </div>

          {/* User Stats */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2 bg-orange-100 text-orange-700 px-2 sm:px-3 py-1 rounded-full">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">
                Lv{userStats.level}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full">
              <Flame className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">
                {userStats.streak}
              </span>
            </div>
          </div>
        </div>

        {!currentDeck ? (
          /* Deck Selection View */
          <div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger
                    value="overview"
                    className="text-xs sm:text-sm"
                  >
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">
                      Tổng quan
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="text-xs sm:text-sm"
                  >
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">
                      Thống kê
                    </span>
                  </TabsTrigger>
                </TabsList>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Dialog
                    open={isCreateDeckOpen}
                    onOpenChange={setIsCreateDeckOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs sm:text-sm">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Tạo bộ thẻ mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Tạo bộ thẻ mới
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Tên bộ thẻ"
                          value={newDeck.name}
                          onChange={(e) =>
                            setNewDeck({
                              ...newDeck,
                              name: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Mô tả (tùy chọn)"
                          value={newDeck.description}
                          onChange={(e) =>
                            setNewDeck({
                              ...newDeck,
                              description: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Danh mục"
                          value={newDeck.category}
                          onChange={(e) =>
                            setNewDeck({
                              ...newDeck,
                              category: e.target.value,
                            })
                          }
                        />
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Màu sắc
                          </label>
                          <div className="flex gap-2">
                            {deckColors.map((color) => (
                              <button
                                key={color.name}
                                onClick={() =>
                                  setNewDeck({
                                    ...newDeck,
                                    color: color.name,
                                  })
                                }
                                className={`w-8 h-8 rounded-full ${color.bg} ${
                                  newDeck.color === color.name
                                    ? "ring-2 ring-offset-2 ring-gray-400"
                                    : ""
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={createDeck}
                          className="w-full"
                        >
                          Tạo bộ thẻ
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={isImportDialogOpen}
                    onOpenChange={setIsImportDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-xs sm:text-sm"
                      >
                        <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Import từ file
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Import thẻ từ file
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                          <p className="mb-2">
                            Định dạng file được hỗ trợ:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>CSV: "Câu hỏi, Câu trả lời"</li>
                            <li>
                              Text với dấu phẩy: "Câu hỏi, Câu
                              trả lời"
                            </li>
                            <li>
                              Text với tab: "Câu hỏi Câu trả
                              lời"
                            </li>
                            <li>
                              Text với dấu chấm phẩy: "Câu hỏi;
                              Câu trả lời"
                            </li>
                            <li>
                              Text với dấu |: "Câu hỏi | Câu trả
                              lời"
                            </li>
                          </ul>
                        </div>
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".txt,.csv,.tsv"
                            onChange={handleFileImport}
                            className="hidden"
                          />
                          <Button
                            onClick={() =>
                              fileInputRef.current?.click()
                            }
                            variant="outline"
                            className="w-full"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Chọn file
                          </Button>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                          <p>
                            <strong>Ví dụ:</strong>
                          </p>
                          <p>
                            Công thức tính diện tích hình tròn?,
                            S = π × r²
                          </p>
                          <p>Định luật Ohm, V = I × R</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {decks.map((deck) => {
                    const colorClasses = getColorClasses(
                      deck.color,
                    );
                    const deckCardCount = flashcards.filter(
                      (card) => card.deckId === deck.id,
                    ).length;

                    return (
                      <Card
                        key={deck.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={() => setCurrentDeck(deck)}
                      >
                        <div
                          className={`${colorClasses.bg} ${colorClasses.text} p-4 sm:p-6 rounded-t-lg`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-base sm:text-lg mb-1 truncate">
                                {deck.name}
                              </h3>
                              <p className="text-xs sm:text-sm opacity-90 line-clamp-2">
                                {deck.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20 ml-2 p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDeck(deck.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span>{deckCardCount} thẻ</span>
                            <Badge
                              variant="secondary"
                              className="bg-white/20 text-white border-0"
                            >
                              {deck.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4 bg-white">
                          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-3">
                            <span>
                              Đã học: {deck.studiedToday}
                            </span>
                            <span>
                              Điểm TB: {deck.averageScore}%
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentDeck(deck);
                                startStudySession("learn");
                              }}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Học
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentDeck(deck);
                                startStudySession("quiz");
                              }}
                            >
                              <Target className="w-3 h-3 mr-1" />
                              Quiz
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="stats">
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Level Card */}
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {userStats.level}
                          </div>
                          <div className="text-sm text-blue-600/80">
                            Level
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Experience Card */}
                    <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {userStats.experience}
                          </div>
                          <div className="text-sm text-orange-600/80">
                            Kinh nghiệm
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Streak Card */}
                    <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {userStats.streak}
                          </div>
                          <div className="text-sm text-green-600/80">
                            Streak
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Cards Studied Card */}
                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {userStats.totalCardsStudied}
                          </div>
                          <div className="text-sm text-purple-600/80">
                            Thẻ đã học
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Achievement Section */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-bold text-lg">
                        Huy hiệu & Thành tích
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {[
                        {
                          id: "beginner",
                          name: "Người mới bắt đầu",
                          description: "Hoàn thành 10 thẻ đầu tiên",
                          threshold: 10,
                          icon: "👤",
                          unlocked: userStats.totalCardsStudied >= 10,
                          progress: Math.min(userStats.totalCardsStudied, 10),
                        },
                        {
                          id: "studious",
                          name: "Học sinh chăm chỉ", 
                          description: "Học 50 thẻ",
                          threshold: 50,
                          icon: "🎓",
                          unlocked: userStats.totalCardsStudied >= 50,
                          progress: Math.min(userStats.totalCardsStudied, 50),
                        },
                        {
                          id: "master",
                          name: "Bậc thầy ôn tập",
                          description: "Học 100 thẻ",
                          threshold: 100,
                          icon: "👨‍🏫",
                          unlocked: userStats.totalCardsStudied >= 100,
                          progress: Math.min(userStats.totalCardsStudied, 100),
                        },
                        {
                          id: "streak_master",
                          name: "Streak Master",
                          description: "Streak 7 ngày",
                          threshold: 7,
                          icon: "🔥",
                          unlocked: userStats.streak >= 7,
                          progress: Math.min(userStats.streak, 7),
                        },
                        {
                          id: "scholar",
                          name: "Học giả",
                          description: "Học 200 thẻ",
                          threshold: 200,
                          icon: "📚",
                          unlocked: userStats.totalCardsStudied >= 200,
                          progress: Math.min(userStats.totalCardsStudied, 200),
                        },
                        {
                          id: "perfectionist",
                          name: "Người hoàn hảo",
                          description: "Đạt 95% độ chính xác",
                          threshold: 95,
                          icon: "⭐",
                          unlocked: calculateAccuracy() >= 95,
                          progress: Math.min(calculateAccuracy(), 95),
                        },
                      ].map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`text-center p-4 rounded-2xl transition-all duration-300 ${
                            achievement.unlocked
                              ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300 shadow-lg animate-gentle-pulse"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div 
                            className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              achievement.unlocked 
                                ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md" 
                                : "bg-gray-200"
                            }`}
                          >
                            <span className={`text-2xl ${achievement.unlocked ? "animate-bounce" : ""}`}>
                              {achievement.icon}
                            </span>
                          </div>
                          <div className={`font-medium text-sm ${
                            achievement.unlocked ? "text-orange-800" : "text-gray-600"
                          }`}>
                            {achievement.name}
                          </div>
                          <div className={`text-xs mt-1 ${
                            achievement.unlocked ? "text-orange-600" : "text-gray-500"
                          }`}>
                            {achievement.description}
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  achievement.unlocked 
                                    ? "bg-gradient-to-r from-yellow-400 to-orange-500" 
                                    : "bg-gradient-to-r from-blue-400 to-blue-500"
                                }`}
                                style={{
                                  width: `${(achievement.progress / achievement.threshold) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {achievement.progress}/{achievement.threshold}
                            </div>
                          </div>
                          
                          {achievement.unlocked && (
                            <div className="mt-2">
                              <Badge className="bg-yellow-500 text-white text-xs">
                                ✓ Đã mở khóa
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Progress Section */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      <h3 className="font-bold text-lg">
                        Tiến độ học tập
                      </h3>
                    </div>

                    {/* Level Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          Tiến độ đến Level{" "}
                          {userStats.level + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                          {userStats.experience}/100 XP
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${userStats.experience % 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Daily Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer">
                        <div className="text-2xl font-bold text-blue-600">
                          {calculateAccuracy()}%
                        </div>
                        <div className="text-sm text-blue-600/80">
                          Tỷ lệ đúng
                        </div>
                        <div className="text-xs text-blue-500/60 mt-1">
                          {flashcards.reduce((sum, card) => sum + card.correctCount, 0)}/
                          {flashcards.reduce((sum, card) => sum + card.correctCount + card.incorrectCount, 0)} đúng
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors cursor-pointer">
                        <div className="text-2xl font-bold text-green-600">
                          {userStats.totalCardsStudied}
                        </div>
                        <div className="text-sm text-green-600/80">
                          Tổng thẻ học
                        </div>
                        <div className="text-xs text-green-500/60 mt-1">
                          Level {userStats.level}
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
                        <div className="text-2xl font-bold text-purple-600">
                          {userStats.streak}
                        </div>
                        <div className="text-sm text-purple-600/80">
                          Streak hiện tại
                        </div>
                        <div className="text-xs text-purple-500/60 mt-1">
                          🔥 ngày liên tiếp
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-800">Thành tích</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {userStats.achievements.length}/6
                        </div>
                        <div className="text-xs text-orange-600/80">
                          Huy hiệu đã mở khóa
                        </div>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-indigo-600" />
                          <span className="font-medium text-indigo-800">Kinh nghiệm</span>
                        </div>
                        <div className="text-2xl font-bold text-indigo-600 mb-1">
                          {userStats.experience}
                        </div>
                        <div className="text-xs text-indigo-600/80">
                          Tổng XP đã kiếm
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          /* Deck Detail View */
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Button
                onClick={() => setCurrentDeck(null)}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[200px] sm:max-w-none">
                  {currentDeck.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {filteredCards.length} thẻ
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => startStudySession("learn")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Học
                </Button>
                <Button
                  onClick={() => startStudySession("quiz")}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 text-xs sm:text-sm"
                >
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Quiz
                </Button>
                <Dialog
                  open={isCreateCardOpen}
                  onOpenChange={setIsCreateCardOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex text-xs sm:text-sm"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Thêm
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm thẻ mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Câu hỏi / Mặt trước"
                        value={newCard.front}
                        onChange={(e) =>
                          setNewCard({
                            ...newCard,
                            front: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        placeholder="Câu trả lời / Mặt sau"
                        value={newCard.back}
                        onChange={(e) =>
                          setNewCard({
                            ...newCard,
                            back: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Danh mục"
                        value={newCard.category}
                        onChange={(e) =>
                          setNewCard({
                            ...newCard,
                            category: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Tags (phân cách bằng dấu phẩy)"
                        value={newCard.tags}
                        onChange={(e) =>
                          setNewCard({
                            ...newCard,
                            tags: e.target.value,
                          })
                        }
                      />
                      <Select
                        value={newCard.difficulty}
                        onValueChange={(
                          value: "easy" | "medium" | "hard",
                        ) =>
                          setNewCard({
                            ...newCard,
                            difficulty: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Độ khó" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">
                            Dễ
                          </SelectItem>
                          <SelectItem value="medium">
                            Trung bình
                          </SelectItem>
                          <SelectItem value="hard">
                            Khó
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={createCard}
                        className="w-full"
                      >
                        Tạo thẻ
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto">
              <Select
                value={filterCategory}
                onValueChange={setFilterCategory}
              >
                <SelectTrigger className="w-32 sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Tất cả danh mục
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filterDifficulty}
                onValueChange={setFilterDifficulty}
              >
                <SelectTrigger className="w-32 sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Tất cả độ khó
                  </SelectItem>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">
                    Trung bình
                  </SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map((card) => (
                <Card
                  key={card.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant={
                          card.difficulty === "easy"
                            ? "secondary"
                            : card.difficulty === "medium"
                              ? "default"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {card.difficulty === "easy"
                          ? "Dễ"
                          : card.difficulty === "medium"
                            ? "TB"
                            : "Khó"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500 p-1"
                        onClick={() => deleteCard(card.id)}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                    <h4 className="font-medium text-sm mb-2 line-clamp-2">
                      {card.front}
                    </h4>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {card.back}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>📂 {card.category}</span>
                      <span>👁️ {card.reviewCount}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Chưa có thẻ nào
                </h3>
                <p className="text-gray-400 mb-4">
                  Thêm thẻ đầu tiên để bắt đầu học tập
                </p>
                <Button
                  onClick={() => setIsCreateCardOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm thẻ mới
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
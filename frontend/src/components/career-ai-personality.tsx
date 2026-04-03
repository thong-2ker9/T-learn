import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import type { PersonalityScore } from "./career-ai";

interface CareerAIPersonalityProps {
  onComplete: (scores: PersonalityScore) => void;
  onBack: () => void;
}

const personalityTasks = [
  {
    id: 1,
    title: "Sắp xếp ưu tiên",
    description: "Kéo thả để sắp xếp các hoạt động theo mức độ yêu thích",
    emoji: "🎯",
    items: [
      { id: "design", label: "Thiết kế giao diện đẹp mắt", trait: "creativity", icon: "🎨" },
      { id: "code", label: "Viết code giải quyết bài toán", trait: "technical", icon: "💻" },
      { id: "present", label: "Thuyết trình ý tưởng", trait: "communication", icon: "🎤" },
      { id: "organize", label: "Tổ chức và lãnh đạo team", trait: "leadership", icon: "👥" },
      { id: "analyze", label: "Phân tích dữ liệu & số liệu", trait: "analytical", icon: "📊" }
    ]
  },
  {
    id: 2,
    title: "Chọn hình ảnh",
    description: "Chọn 3 hình ảnh thu hút bạn nhất",
    emoji: "🖼️",
    items: [
      { id: "art", label: "Nghệ thuật & Design", trait: "creativity", icon: "🎨" },
      { id: "tech", label: "Công nghệ & Code", trait: "technical", icon: "⚙️" },
      { id: "people", label: "Giao tiếp & Mọi người", trait: "communication", icon: "💬" },
      { id: "leader", label: "Lãnh đạo & Quản lý", trait: "leadership", icon: "🏆" },
      { id: "data", label: "Dữ liệu & Phân tích", trait: "analytical", icon: "📈" },
      { id: "creative", label: "Sáng tạo nội dung", trait: "creativity", icon: "✨" }
    ]
  }
];

export function CareerAIPersonality({ onComplete, onBack }: CareerAIPersonalityProps) {
  const [currentTask, setCurrentTask] = useState(0);
  const [taskResults, setTaskResults] = useState<Record<number, string[]>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const task = personalityTasks[currentTask];
  const isLastTask = currentTask === personalityTasks.length - 1;

  const handleSelectItem = (itemId: string) => {
    if (task.id === 2) {
      // Task 2: Select up to 3 items
      if (selectedItems.includes(itemId)) {
        setSelectedItems(selectedItems.filter(id => id !== itemId));
      } else if (selectedItems.length < 3) {
        setSelectedItems([...selectedItems, itemId]);
      }
    } else {
      // Task 1: Single selection (we'll simulate ranking)
      if (!selectedItems.includes(itemId)) {
        setSelectedItems([...selectedItems, itemId]);
      }
    }
  };

  const handleNext = () => {
    const newResults = {
      ...taskResults,
      [task.id]: selectedItems
    };
    setTaskResults(newResults);
    setSelectedItems([]);

    if (isLastTask) {
      // Calculate personality scores
      setIsAnalyzing(true);
      setTimeout(() => {
        const scores = calculateScores(newResults);
        onComplete(scores);
      }, 2500);
    } else {
      setCurrentTask(currentTask + 1);
    }
  };

  const canProceed = task.id === 2 ? selectedItems.length === 3 : selectedItems.length >= 3;

  if (isAnalyzing) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card 
          className="p-12 border-0 shadow-xl bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white"
          style={{ borderRadius: "20px" }}
        >
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-10 h-10 animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-semibold">Đang phân tích tính cách của bạn...</h2>
            <p className="text-purple-100">
              AI đang xử lý dữ liệu để tạo biểu đồ tính cách và tìm nghề phù hợp nhất
            </p>
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden mt-8">
              <div className="h-full bg-white rounded-full animate-progress-fill" />
            </div>
            <p className="text-sm text-purple-200">Vui lòng chờ 3-5 giây...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress */}
      <div className="text-center space-y-2 animate-fade-in">
        <p className="text-sm text-gray-600">Bài tập {currentTask + 1}/{personalityTasks.length}</p>
        <div className="flex gap-2 justify-center">
          {personalityTasks.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentTask ? 'w-8 bg-purple-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Task Card */}
      <Card 
        className="p-8 border-0 shadow-xl bg-white animate-slide-up"
        style={{ borderRadius: "20px" }}
      >
        <div className="text-center space-y-6">
          <div className="text-6xl animate-bounce-slow">{task.emoji}</div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>
            {task.id === 2 && (
              <p className="text-sm text-purple-600 mt-2">
                Đã chọn {selectedItems.length}/3
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {task.items.map((item, index) => {
              const isSelected = selectedItems.includes(item.id);
              const selectionIndex = selectedItems.indexOf(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 animate-card-appear ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <p className="font-medium text-gray-800 text-sm">{item.label}</p>
                    {isSelected && task.id === 1 && (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-semibold">
                        {selectionIndex + 1}
                      </div>
                    )}
                    {isSelected && task.id === 2 && (
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between animate-fade-in">
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full"
        >
          Quay lại
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="rounded-full bg-purple-600 hover:bg-purple-700"
        >
          {isLastTask ? "Phân tích kết quả" : "Tiếp theo"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Instruction */}
      <Card 
        className="p-4 bg-purple-50 border-purple-200 animate-slide-up"
        style={{ borderRadius: "16px", animationDelay: "200ms" }}
      >
        <p className="text-sm text-gray-700 text-center">
          {task.id === 1 ? (
            <>🎯 <strong>Hướng dẫn:</strong> Chọn ít nhất 3 hoạt động yêu thích. Thứ tự chọn thể hiện mức độ ưu tiên.</>
          ) : (
            <>🖼️ <strong>Hướng dẫn:</strong> Chọn đúng 3 hình ảnh thu hút bạn nhất để phân tích sở thích.</>
          )}
        </p>
      </Card>
    </div>
  );
}

function calculateScores(taskResults: Record<number, string[]>): PersonalityScore {
  const scores: PersonalityScore = {
    creativity: 0,
    technical: 0,
    communication: 0,
    leadership: 0,
    analytical: 0
  };

  // Combine all tasks
  const allItems = personalityTasks.flatMap(task => task.items);
  
  // Process task 1 (ranking - higher weight for earlier selections)
  const task1Selections = taskResults[1] || [];
  task1Selections.forEach((itemId, index) => {
    const item = allItems.find(i => i.id === itemId);
    if (item) {
      const weight = task1Selections.length - index; // Higher weight for earlier picks
      scores[item.trait as keyof PersonalityScore] += weight * 15;
    }
  });

  // Process task 2 (selection of 3)
  const task2Selections = taskResults[2] || [];
  task2Selections.forEach(itemId => {
    const item = allItems.find(i => i.id === itemId);
    if (item) {
      scores[item.trait as keyof PersonalityScore] += 20;
    }
  });

  // Add some randomness for variety (10-15 points)
  Object.keys(scores).forEach(key => {
    scores[key as keyof PersonalityScore] += Math.floor(Math.random() * 16) + 10;
  });

  // Normalize to 0-100 scale
  const maxScore = Math.max(...Object.values(scores));
  Object.keys(scores).forEach(key => {
    scores[key as keyof PersonalityScore] = Math.round((scores[key as keyof PersonalityScore] / maxScore) * 100);
  });

  return scores;
}

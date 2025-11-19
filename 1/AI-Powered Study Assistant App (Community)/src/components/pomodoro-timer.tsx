import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coffee, CheckCircle, Settings, Dumbbell, X, Timer, ArrowLeft, Brain } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface PomodoroTimerProps {
  onBack: () => void;
  onNavigateToHealth?: () => void;
}

export function PomodoroTimer({ onBack, onNavigateToHealth }: PomodoroTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const [showMeditationPrompt, setShowMeditationPrompt] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseTime, setExerciseTime] = useState(30);
  
  // Customizable durations (in minutes)
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  
  // Exercise suggestions
  const exercises = [
    { name: "Duỗi cổ sang trái và phải", duration: 30, icon: "🧘‍♀️" },
    { name: "Xoay vai 10 lần về trước và sau", duration: 30, icon: "💪" },
    { name: "Đứng dậy và ngồi xuống 10 lần", duration: 30, icon: "🏃‍♂️" },
    { name: "Duỗi tay lên cao và hít thở sâu", duration: 30, icon: "🙆‍♀️" },
    { name: "Xoay cổ chân và cổ tay", duration: 30, icon: "🦵" },
    { name: "Massage thái dương và mắt", duration: 30, icon: "👀" }
  ];
  
  // Calculate timeLeft based on current mode and custom durations
  const getCurrentDuration = () => {
    switch (mode) {
      case 'work': return workDuration * 60;
      case 'shortBreak': return shortBreakDuration * 60;
      case 'longBreak': return longBreakDuration * 60;
      default: return workDuration * 60;
    }
  };
  
  const [timeLeft, setTimeLeft] = useState(getCurrentDuration);

  const modes = {
    work: { duration: workDuration * 60, label: "Tập Trung", color: "bg-red-500" },
    shortBreak: { duration: shortBreakDuration * 60, label: "Nghỉ Ngắn", color: "bg-green-500" },
    longBreak: { duration: longBreakDuration * 60, label: "Nghỉ Dài", color: "bg-blue-500" }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto switch mode
      if (mode === 'work') {
        const newCompleted = completedSessions + 1;
        setCompletedSessions(newCompleted);
        
        // Save Pomodoro session to localStorage for progress tracking
        const savedSessions = localStorage.getItem('studySessions');
        const sessions = savedSessions ? JSON.parse(savedSessions) : [];
        const sessionDuration = Math.floor(workDuration); // Duration in minutes
        
        sessions.push({
          date: new Date().toDateString(),
          duration: sessionDuration,
          type: 'pomodoro'
        });
        
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        
        // Show meditation prompt after work session
        setShowMeditationPrompt(true);
        if (newCompleted % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(modes.longBreak.duration);
        } else {
          setMode('shortBreak');
          setTimeLeft(modes.shortBreak.duration);
        }
      } else {
        setMode('work');
        setTimeLeft(modes.work.duration);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, completedSessions]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsActive(false);
  };

  const saveSettings = () => {
    // Update timeLeft if currently in the mode that was changed
    const newDuration = getCurrentDuration();
    if (!isActive) {
      setTimeLeft(newDuration);
    }
    setIsSettingsOpen(false);
  };

  const resetToDefaults = () => {
    setWorkDuration(25);
    setShortBreakDuration(5);
    setLongBreakDuration(15);
  };

  const skipExercise = () => {
    setShowExercise(false);
  };

  const completeExercise = () => {
    setShowExercise(false);
  };

  const handleMeditationYes = () => {
    setShowMeditationPrompt(false);
    if (onNavigateToHealth) {
      onNavigateToHealth();
    }
  };

  const handleMeditationNo = () => {
    setShowMeditationPrompt(false);
    // Show exercise suggestion instead
    setCurrentExercise(Math.floor(Math.random() * exercises.length));
    setShowExercise(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tomatoEmojis = Array(8).fill('🍅');

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 sm:p-6 overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-3xl opacity-20 educational-float">🎯</div>
        <div className="absolute top-20 right-20 text-2xl opacity-15 gentle-pulse">⏰</div>
        <div className="absolute bottom-20 left-20 text-2xl opacity-15 subtle-bounce">📚</div>
        <div className="absolute bottom-10 right-10 text-3xl opacity-20 educational-float">✨</div>
        <div className="absolute top-1/2 left-10 text-xl opacity-10 gentle-pulse">💡</div>
        <div className="absolute top-1/3 right-10 text-xl opacity-10 subtle-bounce">⭐</div>
      </div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* Enhanced Tomato decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {tomatoEmojis.map((_, index) => (
            <div
              key={index}
              className="absolute text-4xl opacity-10 animate-pulse"
              style={{
                top: `${15 + (index * 8)}%`,
                left: `${5 + (index * 11)}%`,
                animationDelay: `${index * 0.7}s`,
                transform: `rotate(${index * 15}deg)`,
              }}
            >
              🍅
            </div>
          ))}
        </div>

        <div className="text-center mb-6 sm:mb-8 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-5xl sm:text-6xl">🍅</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Pomodoro Timer
            </h1>
            <span className="text-5xl sm:text-6xl">🍅</span>
          </div>
          <p className="text-base sm:text-lg text-red-600">Tập trung hiệu quả - Nghỉ ngơi đúng lúc</p>
        </div>

        <Card className="p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-red-300 relative z-10 rounded-2xl">
          {/* Mode Selector */}
          <div className="flex flex-col sm:flex-row gap-2 mb-8 justify-center">
            <Button
              onClick={() => switchMode('work')}
              variant={mode === 'work' ? 'default' : 'outline'}
              className={`text-sm sm:text-base px-3 sm:px-4 py-2 ${mode === 'work' ? 'bg-red-500 hover:bg-red-600' : 'border-red-300 text-red-600 hover:bg-red-50'}`}
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Tập Trung</span>
              <span className="sm:hidden">Tập Trung</span>
            </Button>
            <Button
              onClick={() => switchMode('shortBreak')}
              variant={mode === 'shortBreak' ? 'default' : 'outline'}
              className={`text-sm sm:text-base px-3 sm:px-4 py-2 ${mode === 'shortBreak' ? 'bg-green-500 hover:bg-green-600' : 'border-green-300 text-green-600 hover:bg-green-50'}`}
              size="sm"
            >
              <Coffee className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Nghỉ Ngắn</span>
              <span className="sm:hidden">Nghỉ Ngắn</span>
            </Button>
            <Button
              onClick={() => switchMode('longBreak')}
              variant={mode === 'longBreak' ? 'default' : 'outline'}
              className={`text-sm sm:text-base px-3 sm:px-4 py-2 ${mode === 'longBreak' ? 'bg-blue-500 hover:bg-blue-600' : 'border-blue-300 text-blue-600 hover:bg-blue-50'}`}
              size="sm"
            >
              <Coffee className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Nghỉ Dài</span>
              <span className="sm:hidden">Nghỉ Dài</span>
            </Button>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-6 sm:mb-8">
            <div className={`relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto rounded-full ${modes[mode].color} flex items-center justify-center mb-6 shadow-2xl border-8 border-white`}>
              {/* Tomato shape decoration */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl sm:text-5xl">🌿</div>
              <div className="text-5xl sm:text-6xl md:text-7xl font-mono font-bold text-white drop-shadow-lg">
                {formatTime(timeLeft)}
              </div>
              {/* Progress indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                {Array(4).fill(null).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index < (completedSessions % 4) ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {modes[mode].label}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === 'work' ? '💪 Tập trung cao độ!' : mode === 'shortBreak' ? '☕ Thư giãn chút thôi' : '🌴 Nghỉ ngơi kỹ đi'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8">
            <Button
              onClick={toggleTimer}
              className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Tạm dừng
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Bắt đầu
                </>
              )}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Đặt lại
            </Button>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Cài đặt
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-red-500" />
                    Cài đặt thời gian
                  </DialogTitle>
                  <DialogDescription>
                    Tùy chỉnh thời gian cho từng phiên làm việc
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="work-duration">Thời gian tập trung (phút)</Label>
                    <Input
                      id="work-duration"
                      type="number"
                      min="1"
                      max="60"
                      value={workDuration}
                      onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short-break">Nghỉ ngắn (phút)</Label>
                    <Input
                      id="short-break"
                      type="number"
                      min="1"
                      max="30"
                      value={shortBreakDuration}
                      onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 5)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="long-break">Nghỉ dài (phút)</Label>
                    <Input
                      id="long-break"
                      type="number"
                      min="1"
                      max="60"
                      value={longBreakDuration}
                      onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 15)}
                      className="w-full"
                    />
                  </div>
                  <Separator />
                  <div className="flex gap-3">
                    <Button onClick={saveSettings} className="flex-1 bg-red-500 hover:bg-red-600">
                      Lưu cài đặt
                    </Button>
                    <Button onClick={resetToDefaults} variant="outline" className="flex-1">
                      Đặt lại mặc định
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <Card className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <p className="text-sm text-gray-600 mb-1">Tổng hoàn thành</p>
              <p className="text-3xl font-bold text-red-600">{completedSessions}</p>
              <p className="text-xs text-gray-500 mt-1">🍅 sessions</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Tiến độ chu kỳ</p>
              <div className="flex justify-center gap-1 my-2">
                {Array(4).fill(null).map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index < (completedSessions % 4) ? 'bg-orange-500' : 'bg-orange-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">{completedSessions % 4}/4 để nghỉ dài</p>
            </Card>
          </div>
        </Card>

        {/* Meditation Prompt Dialog */}
        <Dialog open={showMeditationPrompt} onOpenChange={setShowMeditationPrompt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 justify-center text-center">
                <Brain className="w-6 h-6 text-purple-500" />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Chúc mừng! Bạn đã hoàn thành 1 phiên 🎉
                </span>
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                Sau khi tập trung cao độ, não bộ cần được thư giãn để tăng hiệu suất
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="text-center space-y-4">
                <div className="text-7xl">🧘‍♀️</div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                  <h3 className="font-semibold text-purple-700 mb-2">
                    Bạn có muốn thiền - thư giãn không?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Thiền giúp giảm stress, tăng khả năng tập trung và cải thiện trí nhớ hiệu quả
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <p className="text-2xl mb-1">🧠</p>
                      <p className="text-xs text-gray-600">Tăng tập trung</p>
                    </div>
                    <div className="text-center p-2 bg-pink-50 rounded-lg">
                      <p className="text-2xl mb-1">😌</p>
                      <p className="text-xs text-gray-600">Giảm căng thẳng</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleMeditationYes} 
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Brain className="w-4 h-4 mr-2" />
                Có, bắt đầu thiền
              </Button>
              <Button 
                onClick={handleMeditationNo} 
                variant="outline" 
                className="flex-1 border-gray-300"
              >
                Không, tập thể dục
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Exercise Suggestion Modal */}
        <Dialog open={showExercise} onOpenChange={setShowExercise}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-center">
                <Dumbbell className="w-6 h-6 text-green-500" />
                Tập thể dục nhẹ
              </DialogTitle>
              <DialogDescription className="text-center">
                Hãy dành {exerciseTime} giây để thư giãn cơ thể!
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="text-center space-y-4">
                <div className="text-6xl">{exercises[currentExercise]?.icon}</div>
                <h3 className="text-lg font-medium text-gray-800">
                  {exercises[currentExercise]?.name}
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700 text-sm">
                    💡 Tập thể dục nhẹ giúp giảm căng thẳng và tăng hiệu quả học tập
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={completeExercise} 
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Đã hoàn thành
              </Button>
              <Button 
                onClick={skipExercise} 
                variant="outline" 
                className="flex-1 border-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Bỏ qua
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coffee, CheckCircle, Settings, Dumbbell, X, Timer, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface PomodoroTimerProps {
  onBack: () => void;
}

export function PomodoroTimer({ onBack }: PomodoroTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
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
        
        // Show exercise suggestion after work session
        setCurrentExercise(Math.floor(Math.random() * exercises.length));
        setShowExercise(true);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tomatoEmojis = Array(8).fill('🍅');

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-red-100 via-red-50 to-orange-50 p-6 overflow-hidden">
      {/* Simple decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-2xl opacity-10 educational-float">💡</div>
        <div className="absolute top-20 right-20 text-xl opacity-15 gentle-pulse">⭐</div>
        <div className="absolute bottom-20 left-20 text-xl opacity-10 subtle-bounce">🎯</div>
        <div className="absolute bottom-10 right-10 text-2xl opacity-15 educational-float">✨</div>
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

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Pomodoro Timer</h1>
          <p className="text-red-500">Tập trung hiệu quả với kỹ thuật Pomodoro 🍅</p>
        </div>

        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-red-200 relative z-10">
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
          <div className="text-center mb-8">
            <div className={`w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-full ${modes[mode].color} flex items-center justify-center mb-6 shadow-2xl`}>
              <div className="text-4xl sm:text-6xl font-mono font-bold text-white">
                {formatTime(timeLeft)}
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
              {modes[mode].label}
            </h2>
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

          {/* Session Counter */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">
              Phiên hoàn thành: {completedSessions}
            </p>
            <div className="flex justify-center gap-1">
              {Array(4).fill(null).map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full ${
                    index < (completedSessions % 4) ? 'bg-red-500' : 'bg-red-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>

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
import { useState } from "react";
import { ArrowLeft, Droplets, Dumbbell, Users, Brain, Settings, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";

interface HealthProps {
  onBack: () => void;
}

interface WaterSettings {
  enabled: boolean;
  interval: number; // minutes
  startTime: string;
  endTime: string;
}

interface ExerciseSettings {
  enabled: boolean;
  type: 'ai' | 'sport';
  duration: number; // minutes
  time: string;
  sport?: string;
  customSport?: string;
}

interface MeditationSession {
  id: string;
  name: string;
  duration: number;
  audioUrl?: string;
}

const predefinedSports = [
  "Bóng đá", "Bóng rổ", "Cầu lông", "Tennis", "Bơi lội", 
  "Chạy bộ", "Xe đạp", "Yoga", "Boxing", "Võ thuật"
];

const meditationSessions: MeditationSession[] = [
  { id: "1", name: "Hơi thở sâu", duration: 10 },
  { id: "2", name: "Thư giãn toàn thân", duration: 15 },
  { id: "3", name: "Thiền chánh niệm", duration: 20 },
  { id: "4", name: "Giảm stress", duration: 12 },
  { id: "5", name: "Tập trung tinh thần", duration: 18 },
];

export function Health({ onBack }: HealthProps) {
  const [waterSettings, setWaterSettings] = useState<WaterSettings>({
    enabled: false,
    interval: 180, // 3 hours
    startTime: "07:00",
    endTime: "22:00"
  });

  const [exerciseSettings, setExerciseSettings] = useState<ExerciseSettings>({
    enabled: false,
    type: 'ai',
    duration: 30,
    time: "18:00"
  });

  const [selectedMeditation, setSelectedMeditation] = useState<MeditationSession | null>(null);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiExercisePrompt, setAiExercisePrompt] = useState("");

  const handleWaterNotification = () => {
    if (waterSettings.enabled) {
      // In a real app, this would set up actual notifications
      alert(`Đã cài đặt nhắc nhở uống nước mỗi ${waterSettings.interval} phút từ ${waterSettings.startTime} đến ${waterSettings.endTime}`);
    }
  };

  const handleExerciseNotification = () => {
    if (exerciseSettings.enabled) {
      const message = exerciseSettings.type === 'ai' 
        ? `Đã cài đặt nhắc nhở tập thể dục với AI vào lúc ${exerciseSettings.time} trong ${exerciseSettings.duration} phút`
        : `Đã cài đặt nhắc nhở chơi ${exerciseSettings.sport || exerciseSettings.customSport} vào lúc ${exerciseSettings.time}`;
      alert(message);
    }
  };

  const generateAIExercise = () => {
    // Mock AI response
    const exercises = [
      "20 Squats + 15 Push-ups + 30 giây Plank",
      "Chạy tại chỗ 2 phút + 10 Burpees + Stretching",
      "15 Lunges mỗi chân + 20 Jumping Jacks + Yoga cơ bản",
      "Cardio nhẹ 5 phút + 15 Sit-ups + Thở sâu"
    ];
    
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    setAiExercisePrompt(randomExercise);
  };

  const startMeditation = (session: MeditationSession) => {
    setSelectedMeditation(session);
    setMeditationTimer(session.duration * 60); // Convert to seconds
    setIsPlaying(true);
  };

  const toggleMeditation = () => {
    setIsPlaying(!isPlaying);
  };

  const resetMeditation = () => {
    setIsPlaying(false);
    setMeditationTimer(selectedMeditation ? selectedMeditation.duration * 60 : 0);
  };

  // Timer effect would go here in a real implementation
  // useEffect for countdown timer

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto px-1 sm:px-0">
        <div className="flex items-center mb-3 sm:mb-4 lg:mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-1 sm:mr-2 lg:mr-4 p-1 sm:p-2">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </Button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">Sức Khỏe</h1>
        </div>

        <Tabs defaultValue="water" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="water" className="flex flex-col items-center gap-1 p-1.5 sm:p-2 text-[10px] sm:text-xs min-h-0">
              <Droplets className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="leading-tight">Nước</span>
            </TabsTrigger>
            <TabsTrigger value="exercise" className="flex flex-col items-center gap-1 p-1.5 sm:p-2 text-[10px] sm:text-xs min-h-0">
              <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="leading-tight">Thể Dục</span>
            </TabsTrigger>
            <TabsTrigger value="meditation" className="flex flex-col items-center gap-1 p-1.5 sm:p-2 text-[10px] sm:text-xs min-h-0">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="leading-tight">Thiền</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="water">
            <Card className="p-3 sm:p-4 lg:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="text-sm sm:text-base lg:text-xl">Nhắc Nhở Uống Nước</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="water-enabled">Bật nhắc nhở</Label>
                  <Switch
                    id="water-enabled"
                    checked={waterSettings.enabled}
                    onCheckedChange={(checked) => 
                      setWaterSettings(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>

                {waterSettings.enabled && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="water-interval" className="text-sm">Khoảng thời gian (phút)</Label>
                        <Input
                          id="water-interval"
                          type="number"
                          value={waterSettings.interval}
                          onChange={(e) => 
                            setWaterSettings(prev => ({ ...prev, interval: parseInt(e.target.value) || 180 }))
                          }
                          min="30"
                          max="480"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Thời gian hiệu lực</Label>
                        <div className="flex gap-1 sm:gap-2 items-center">
                          <Input
                            type="time"
                            value={waterSettings.startTime}
                            onChange={(e) => 
                              setWaterSettings(prev => ({ ...prev, startTime: e.target.value }))
                            }
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={waterSettings.endTime}
                            onChange={(e) => 
                              setWaterSettings(prev => ({ ...prev, endTime: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleWaterNotification} className="w-full bg-blue-500 hover:bg-blue-600">
                      Lưu Cài Đặt Nhắc Nhở
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="exercise">
            <Card className="p-3 sm:p-4 lg:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                <span className="text-sm sm:text-base lg:text-xl">Tập Thể Dục</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="exercise-enabled">Bật nhắc nhở</Label>
                  <Switch
                    id="exercise-enabled"
                    checked={exerciseSettings.enabled}
                    onCheckedChange={(checked) => 
                      setExerciseSettings(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>

                {exerciseSettings.enabled && (
                  <>
                    <div>
                      <Label>Loại hoạt động</Label>
                      <Select 
                        value={exerciseSettings.type} 
                        onValueChange={(value: 'ai' | 'sport') => 
                          setExerciseSettings(prev => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ai">Tập thể dục với AI</SelectItem>
                          <SelectItem value="sport">Chơi thể thao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {exerciseSettings.type === 'ai' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="exercise-duration">Thời gian (phút)</Label>
                            <Input
                              id="exercise-duration"
                              type="number"
                              value={exerciseSettings.duration}
                              onChange={(e) => 
                                setExerciseSettings(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))
                              }
                              min="10"
                              max="120"
                            />
                          </div>
                          <div>
                            <Label htmlFor="exercise-time">Thời gian nhắc nhở</Label>
                            <Input
                              id="exercise-time"
                              type="time"
                              value={exerciseSettings.time}
                              onChange={(e) => 
                                setExerciseSettings(prev => ({ ...prev, time: e.target.value }))
                              }
                            />
                          </div>
                        </div>
                        
                        <Button onClick={generateAIExercise} variant="outline" className="w-full">
                          Tạo Bài Tập Ngẫu Nhiên
                        </Button>
                        
                        {aiExercisePrompt && (
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-700 mb-2">Bài tập được đề xuất:</h4>
                            <p className="text-green-600">{aiExercisePrompt}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label>Chọn môn thể thao</Label>
                          <Select 
                            value={exerciseSettings.sport} 
                            onValueChange={(value) => 
                              setExerciseSettings(prev => ({ ...prev, sport: value, customSport: undefined }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn môn thể thao" />
                            </SelectTrigger>
                            <SelectContent>
                              {predefinedSports.map(sport => (
                                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                              ))}
                              <SelectItem value="custom">Tự nhập môn khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {exerciseSettings.sport === 'custom' && (
                          <div>
                            <Label htmlFor="custom-sport">Nhập môn thể thao</Label>
                            <Input
                              id="custom-sport"
                              value={exerciseSettings.customSport || ''}
                              onChange={(e) => 
                                setExerciseSettings(prev => ({ ...prev, customSport: e.target.value }))
                              }
                              placeholder="Ví dụ: Bóng chuyền, Leo núi..."
                            />
                          </div>
                        )}

                        <div>
                          <Label htmlFor="sport-time">Thời gian nhắc nhở</Label>
                          <Input
                            id="sport-time"
                            type="time"
                            value={exerciseSettings.time}
                            onChange={(e) => 
                              setExerciseSettings(prev => ({ ...prev, time: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                    )}

                    <Button onClick={handleExerciseNotification} className="w-full bg-red-500 hover:bg-red-600">
                      Lưu Cài Đặt Nhắc Nhở
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="meditation">
            <div className="space-y-4 sm:space-y-6">
              <Card className="p-3 sm:p-4 lg:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  <span className="text-sm sm:text-base lg:text-xl">Thiền - Thư Giãn</span>
                </h2>

                {!selectedMeditation ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {meditationSessions.map(session => (
                      <Card key={session.id} className="p-3 sm:p-4 cursor-pointer hover:bg-purple-50" onClick={() => startMeditation(session)}>
                        <h3 className="text-sm sm:text-base font-semibold text-purple-700">{session.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{session.duration} phút</p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center space-y-4 sm:space-y-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-purple-700">{selectedMeditation.name}</h3>
                    
                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto bg-gradient-to-br from-purple-200 to-blue-200 rounded-full flex items-center justify-center">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-mono text-purple-700">
                        {formatTime(meditationTimer)}
                      </div>
                    </div>

                    <div className="flex justify-center gap-2 sm:gap-4">
                      <Button onClick={toggleMeditation} size="sm" className="bg-purple-500 hover:bg-purple-600 sm:size-default">
                        {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </Button>
                      <Button onClick={resetMeditation} variant="outline" size="sm" className="sm:size-default">
                        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                      <Button onClick={() => setSelectedMeditation(null)} variant="outline" size="sm" className="sm:size-default">
                        <span className="text-xs sm:text-sm">Thoát</span>
                      </Button>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto px-2">
                      <p>Hít vào sâu, thở ra chậm. Tập trung vào hơi thở và để tâm trí được thư giãn.</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
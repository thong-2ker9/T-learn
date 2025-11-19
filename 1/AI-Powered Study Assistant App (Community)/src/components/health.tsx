import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Droplets,
  Dumbbell,
  Users,
  Brain,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface HealthProps {
  onBack: () => void;
  defaultTab?: string;
}

interface WaterSettings {
  enabled: boolean;
  interval: number; // minutes
  startTime: string;
  endTime: string;
}

interface ExerciseSettings {
  enabled: boolean;
  type: "ai" | "sport";
  duration: number; // minutes
  time: string;
  sport?: string;
  customSport?: string;
}

interface MeditationSession {
  id: string;
  name: string;
  duration: number;
  audioUrl: string;
  description: string;
}

const predefinedSports = [
  "Bóng đá",
  "Bóng rổ",
  "Cầu lông",
  "Tennis",
  "Bơi lội",
  "Chạy bộ",
  "Xe đạp",
  "Yoga",
  "Boxing",
  "Võ thuật",
];

const meditationSessions: MeditationSession[] = [
  {
    id: "1",
    name: "Hít thở sâu",
    duration: 10,
    audioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description:
      "Thực hành hít thở sâu để thư giãn và giảm căng thẳng",
  },
  {
    id: "2",
    name: "Thư giãn toàn thân",
    duration: 15,
    audioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    description: "Thả lỏng từng phần cơ thể, từ đầu đến chân",
  },
  {
    id: "3",
    name: "Thiền chánh niệm",
    duration: 20,
    audioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    description:
      "Tập trung vào hiện tại, quan sát suy nghĩ không phán xét",
  },
  {
    id: "4",
    name: "Giảm stress",
    duration: 12,
    audioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    description:
      "Kỹ thuật thiền đặc biệt giúp giảm căng thẳng nhanh chóng",
  },
  {
    id: "5",
    name: "Tập trung tinh thần",
    duration: 18,
    audioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    description:
      "Tăng cường khả năng tập trung và sự tỉnh thức",
  },
];

export function Health({ onBack, defaultTab = "water" }: HealthProps) {
  const [waterSettings, setWaterSettings] =
    useState<WaterSettings>({
      enabled: false,
      interval: 180, // 3 hours
      startTime: "07:00",
      endTime: "22:00",
    });

  const [exerciseSettings, setExerciseSettings] =
    useState<ExerciseSettings>({
      enabled: false,
      type: "ai",
      duration: 30,
      time: "18:00",
    });

  const [selectedMeditation, setSelectedMeditation] =
    useState<MeditationSession | null>(null);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiExercisePrompt, setAiExercisePrompt] = useState("");
  const [customDuration, setCustomDuration] = useState(15);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showDurationDialog, setShowDurationDialog] = useState(false);
  const [selectedSessionForCustom, setSelectedSessionForCustom] = useState<MeditationSession | null>(null);
  const [tempDuration, setTempDuration] = useState(15);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleWaterNotification = () => {
    if (waterSettings.enabled) {
      // In a real app, this would set up actual notifications
      alert(
        `Đã cài đặt nhắc nhở uống nước mỗi ${waterSettings.interval} phút từ ${waterSettings.startTime} đến ${waterSettings.endTime}`,
      );
    }
  };

  const handleExerciseNotification = () => {
    if (exerciseSettings.enabled) {
      const message =
        exerciseSettings.type === "ai"
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
      "Cardio nhẹ 5 phút + 15 Sit-ups + Thở sâu",
    ];

    const randomExercise =
      exercises[Math.floor(Math.random() * exercises.length)];
    setAiExercisePrompt(randomExercise);
  };

  const startMeditation = (
    session: MeditationSession,
    customTime?: number,
  ) => {
    setSelectedMeditation(session);
    const duration = customTime || session.duration;
    setMeditationTimer(duration * 60); // Convert to seconds
    setIsPlaying(true);
    setIsMusicPlaying(true);

    // Start audio
    if (audioRef.current) {
      audioRef.current.src = session.audioUrl;
      audioRef.current.volume = volume / 100;
      audioRef.current.loop = true;
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play error:", err));
    }
  };

  const toggleMeditation = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((err) =>
            console.log("Audio play error:", err),
          );
      }
    }
  };

  const resetMeditation = () => {
    setIsPlaying(false);
    setMeditationTimer(
      selectedMeditation ? selectedMeditation.duration * 60 : 0,
    );
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((err) =>
            console.log("Audio play error:", err),
          );
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const startCustomMeditation = () => {
    const customSession: MeditationSession = {
      id: "custom",
      name: "Thiền tùy chỉnh",
      duration: customDuration,
      audioUrl: meditationSessions[0].audioUrl, // Use first session's audio
      description: "Session thiền với thời gian tùy chỉnh",
    };
    startMeditation(customSession, customDuration);
  };

  const handleSessionClick = (session: MeditationSession) => {
    setSelectedSessionForCustom(session);
    setTempDuration(session.duration);
    setShowDurationDialog(true);
  };

  const handleStartWithCustomDuration = () => {
    if (selectedSessionForCustom) {
      startMeditation(selectedSessionForCustom, tempDuration);
      setShowDurationDialog(false);
      setSelectedSessionForCustom(null);
    }
  };

  const handleStartWithDefaultDuration = () => {
    if (selectedSessionForCustom) {
      startMeditation(selectedSessionForCustom);
      setShowDurationDialog(false);
      setSelectedSessionForCustom(null);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && meditationTimer > 0) {
      interval = setInterval(() => {
        setMeditationTimer((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, meditationTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-green-600">
            Sức Khỏe
          </h1>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger
              value="water"
              className="flex items-center gap-1 sm:gap-2 flex-col sm:flex-row py-3"
            >
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">
                Uống Nước
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="exercise"
              className="flex items-center gap-1 sm:gap-2 flex-col sm:flex-row py-3"
            >
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">
                Tập Thể Dục
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="meditation"
              className="flex items-center gap-1 sm:gap-2 flex-col sm:flex-row py-3"
            >
              <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">
                Thiền - Thư Giãn
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="water">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                Nhắc Nhở Uống Nước
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="water-enabled">
                    Bật nhắc nhở
                  </Label>
                  <Switch
                    id="water-enabled"
                    checked={waterSettings.enabled}
                    onCheckedChange={(checked) =>
                      setWaterSettings((prev) => ({
                        ...prev,
                        enabled: checked,
                      }))
                    }
                  />
                </div>

                {waterSettings.enabled && (
                  <>
                    {/* Slider for interval */}
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-700">
                            Khoảng thời gian nhắc nhở
                          </h3>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label
                              htmlFor="water-interval-slider"
                              className="text-sm"
                            >
                              Nhắc nhở mỗi
                            </Label>
                            <span className="text-lg font-semibold text-blue-700">
                              {waterSettings.interval} phút
                            </span>
                          </div>
                          <Slider
                            id="water-interval-slider"
                            value={[waterSettings.interval]}
                            onValueChange={(value) =>
                              setWaterSettings((prev) => ({
                                ...prev,
                                interval: value[0],
                              }))
                            }
                            min={30}
                            max={480}
                            step={30}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>30 phút</span>
                            <span>8 giờ</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Time range */}
                    <div>
                      <Label className="mb-2 block">Thời gian hiệu lực</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="time"
                          value={waterSettings.startTime}
                          onChange={(e) =>
                            setWaterSettings((prev) => ({
                              ...prev,
                              startTime: e.target.value,
                            }))
                          }
                          className="flex-1"
                        />
                        <span className="text-gray-500">-</span>
                        <Input
                          type="time"
                          value={waterSettings.endTime}
                          onChange={(e) =>
                            setWaterSettings((prev) => ({
                              ...prev,
                              endTime: e.target.value,
                            }))
                          }
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Chỉ nhắc nhở trong khoảng thời gian này
                      </p>
                    </div>

                    <Button
                      onClick={handleWaterNotification}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      Lưu Cài Đặt Nhắc Nhở
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="exercise">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-red-500" />
                Tập Thể Dục & Thể Thao
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="exercise-enabled">
                    Bật nhắc nhở
                  </Label>
                  <Switch
                    id="exercise-enabled"
                    checked={exerciseSettings.enabled}
                    onCheckedChange={(checked) =>
                      setExerciseSettings((prev) => ({
                        ...prev,
                        enabled: checked,
                      }))
                    }
                  />
                </div>

                {exerciseSettings.enabled && (
                  <>
                    <div>
                      <Label>Loại hoạt động</Label>
                      <Select
                        value={exerciseSettings.type}
                        onValueChange={(
                          value: "ai" | "sport",
                        ) =>
                          setExerciseSettings((prev) => ({
                            ...prev,
                            type: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ai">
                            Tập thể dục với AI
                          </SelectItem>
                          <SelectItem value="sport">
                            Chơi thể thao
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {exerciseSettings.type === "ai" ? (
                      <div className="space-y-4">
                        {/* Slider for exercise duration */}
                        <Card className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-5 h-5 text-red-600" />
                              <h3 className="font-semibold text-red-700">
                                Thời gian tập luyện
                              </h3>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label
                                  htmlFor="exercise-duration-slider"
                                  className="text-sm"
                                >
                                  Thời lượng
                                </Label>
                                <span className="text-lg font-semibold text-red-700">
                                  {exerciseSettings.duration} phút
                                </span>
                              </div>
                              <Slider
                                id="exercise-duration-slider"
                                value={[exerciseSettings.duration]}
                                onValueChange={(value) =>
                                  setExerciseSettings((prev) => ({
                                    ...prev,
                                    duration: value[0],
                                  }))
                                }
                                min={10}
                                max={120}
                                step={5}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>10 phút</span>
                                <span>2 giờ</span>
                              </div>
                            </div>
                          </div>
                        </Card>

                        <div>
                          <Label htmlFor="exercise-time">
                            Thời gian nhắc nhở
                          </Label>
                          <Input
                            id="exercise-time"
                            type="time"
                            value={exerciseSettings.time}
                            onChange={(e) =>
                              setExerciseSettings((prev) => ({
                                ...prev,
                                time: e.target.value,
                              }))
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Nhắc nhở hàng ngày vào giờ này
                          </p>
                        </div>

                        <Button
                          onClick={generateAIExercise}
                          variant="outline"
                          className="w-full"
                        >
                          Tạo Bài Tập Ngẫu Nhiên
                        </Button>

                        {aiExercisePrompt && (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-700 mb-2">
                              Bài tập được đề xuất:
                            </h4>
                            <p className="text-green-600">
                              {aiExercisePrompt}
                            </p>
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
                              setExerciseSettings((prev) => ({
                                ...prev,
                                sport: value,
                                customSport: undefined,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn môn thể thao" />
                            </SelectTrigger>
                            <SelectContent>
                              {predefinedSports.map((sport) => (
                                <SelectItem
                                  key={sport}
                                  value={sport}
                                >
                                  {sport}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom">
                                Tự nhập môn khác
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {exerciseSettings.sport ===
                          "custom" && (
                          <div>
                            <Label htmlFor="custom-sport">
                              Nhập môn thể thao
                            </Label>
                            <Input
                              id="custom-sport"
                              value={
                                exerciseSettings.customSport ||
                                ""
                              }
                              onChange={(e) =>
                                setExerciseSettings((prev) => ({
                                  ...prev,
                                  customSport: e.target.value,
                                }))
                              }
                              placeholder="Ví dụ: Bóng chuyền, Leo núi..."
                            />
                          </div>
                        )}

                        <div>
                          <Label htmlFor="sport-time">
                            Thời gian nhắc nhở
                          </Label>
                          <Input
                            id="sport-time"
                            type="time"
                            value={exerciseSettings.time}
                            onChange={(e) =>
                              setExerciseSettings((prev) => ({
                                ...prev,
                                time: e.target.value,
                              }))
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Nhắc nhở hàng ngày vào giờ này
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleExerciseNotification}
                      className="w-full bg-red-500 hover:bg-red-600"
                    >
                      Lưu Cài Đặt Nhắc Nhở
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="meditation">
            <div className="space-y-6">
              {/* Hidden audio element */}
              <audio ref={audioRef} />

              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Thiền - Thư Giãn
                </h2>

                {!selectedMeditation ? (
                  <div className="space-y-6">
                    {/* Custom Duration Setter */}
                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-purple-700">
                            Thiền
                          </h3>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label
                              htmlFor="custom-duration"
                              className="text-sm"
                            >
                              Thời gian (phút)
                            </Label>
                            <span className="text-lg font-semibold text-purple-700">
                              {customDuration} phút
                            </span>
                          </div>
                          <Slider
                            id="custom-duration"
                            value={[customDuration]}
                            onValueChange={(value) =>
                              setCustomDuration(value[0])
                            }
                            min={5}
                            max={60}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>5 phút</span>
                            <span>60 phút</span>
                          </div>
                        </div>

                        <Button
                          onClick={startCustomMeditation}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Bắt đầu thiền
                        </Button>
                      </div>
                    </Card>

                    {/* Predefined Sessions */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">
                        Hoặc chọn session có sẵn:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {meditationSessions.map((session) => (
                          <Card
                            key={session.id}
                            className="p-3 sm:p-4 cursor-pointer hover:bg-purple-50 transition-colors border-purple-100 hover:border-purple-300"
                            onClick={() => handleSessionClick(session)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-purple-700 text-sm sm:text-base">
                                {session.name}
                              </h3>
                              <span className="text-xs sm:text-sm text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full whitespace-nowrap">
                                {session.duration} phút
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                              {session.description}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 sm:space-y-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-purple-700 break-words px-4">
                      {selectedMeditation.name}
                    </h3>

                    {/* Timer Display */}
                    <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-gradient-to-br from-purple-200 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
                      <div className="text-3xl sm:text-4xl font-mono text-purple-700">
                        {formatTime(meditationTimer)}
                      </div>
                    </div>

                    {/* Music Controls */}
                    <Card className="p-4 bg-purple-50 border-purple-200 max-w-sm mx-auto">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">
                              Nhạc nền
                            </span>
                          </div>
                          <Button
                            onClick={toggleMusic}
                            variant="outline"
                            size="sm"
                            className="border-purple-300"
                          >
                            {isMusicPlaying ? (
                              <Volume2 className="w-4 h-4" />
                            ) : (
                              <VolumeX className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs">
                              Âm lượng
                            </Label>
                            <span className="text-xs font-semibold text-purple-700">
                              {volume}%
                            </span>
                          </div>
                          <Slider
                            value={[volume]}
                            onValueChange={handleVolumeChange}
                            min={0}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Control Buttons */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
                      <Button
                        onClick={toggleMeditation}
                        size="lg"
                        className="bg-purple-500 hover:bg-purple-600 flex-shrink-0"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        onClick={resetMeditation}
                        variant="outline"
                        size="lg"
                        className="flex-shrink-0"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedMeditation(null);
                          if (audioRef.current) {
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                          }
                        }}
                        variant="outline"
                        size="lg"
                        className="flex-shrink-0"
                      >
                        Thoát
                      </Button>
                    </div>

                    {/* Description */}
                    <div className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto px-4">
                      <p className="break-words">
                        {selectedMeditation.description}
                      </p>
                      <p className="mt-2 italic">
                        Hít vào sâu, thở ra chậm. Tập trung vào
                        hơi thở và để tâm trí được thư giãn.
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Custom Duration Dialog for Predefined Sessions */}
              <Dialog open={showDurationDialog} onOpenChange={(open) => {
                if (!open) {
                  setShowDurationDialog(false);
                  setSelectedSessionForCustom(null);
                }
              }}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-500" />
                      Tùy chỉnh thời gian
                    </DialogTitle>
                    <DialogDescription>
                      {selectedSessionForCustom?.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="temp-duration" className="text-sm">
                          Thời gian (phút)
                        </Label>
                        <span className="text-lg font-semibold text-purple-700">
                          {tempDuration} phút
                        </span>
                      </div>
                      <Slider
                        id="temp-duration"
                        value={[tempDuration]}
                        onValueChange={(value) => setTempDuration(value[0])}
                        min={5}
                        max={60}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>5 phút</span>
                        <span>60 phút</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 p-3 bg-purple-50 rounded-lg">
                      {selectedSessionForCustom?.description}
                    </p>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleStartWithCustomDuration}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Bắt đầu
                      </Button>
                      <Button
                        onClick={() => {
                          setShowDurationDialog(false);
                          setSelectedSessionForCustom(null);
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
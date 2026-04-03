import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Trash2, AlarmClock, Sun, Moon, ArrowLeft, Play, Pause, Square, RotateCcw, Timer as TimerIcon } from "lucide-react";
import { Bell, Clock, StopCircle } from "lucide-react";
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { PermissionsManager } from '../utils/permissions';



interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  repeat: string[];
  sound: string;
  createdAt: Date;
}

interface AlarmProps {
  onBack: () => void;
}

export function Alarm({ onBack }: AlarmProps) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [newAlarm, setNewAlarm] = useState({
    time: "07:00",
    label: "",
    repeat: [] as string[],
    sound: "default"
  });
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [stopwatchLaps, setStopwatchLaps] = useState<number[]>([]);
  const stopwatchInterval = useRef<NodeJS.Timeout | null>(null);
  // tránh trigger liên tục: lưu thời điểm báo thức cuối cùng được kích hoạt
  const lastTriggeredRef = useRef<Record<string, number>>({});

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTime, setTimerTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerSet, setIsTimerSet] = useState(false);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const weekDays = [
    { key: 'mon', label: 'T2' },
    { key: 'tue', label: 'T3' },
    { key: 'wed', label: 'T4' },
    { key: 'thu', label: 'T5' },
    { key: 'fri', label: 'T6' },
    { key: 'sat', label: 'T7' },
    { key: 'sun', label: 'CN' }
  ];

  const alarmSounds = [
    { value: "alarm327234.mp3", label: "Chuông mặc định", file: "sounds/alarm327234.mp3" },
    { value: "alarm301729.mp3", label: "Nhẹ nhàng", file: "sounds/alarm301729.mp3" },
    { value: "clockalarm8761.mp3", label: "Năng động", file: "sounds/clockalarm8761.mp3" },
    { value: "notification18270129.mp3", label: "Thiên nhiên", file: "sounds/notification18270129.mp3" },
  ];

  // Load alarms từ localStorage + xin quyền thông báo khi app mở
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize permissions using PermissionsManager
        const permissions = await PermissionsManager.initializePermissions();
        console.log('Permissions initialized:', permissions);
        
        if (!permissions.notifications) {
          console.warn("⚠️ Notification permissions not granted");
        }

        // Load alarms từ localStorage
        const saved = localStorage.getItem("studyAlarms");
        if (saved) {
          const parsed = JSON.parse(saved).map((alarm: any) => ({
            ...alarm,
            createdAt: new Date(alarm.createdAt),
          }));
          setAlarms(parsed);
        } else {
          // Sample alarms
          const sampleAlarms: Alarm[] = [
            {
              id: "1",
              time: "06:30",
              label: "Dậy sớm đi học",
              enabled: true,
              repeat: ["mon", "tue", "wed", "thu", "fri"],
              sound: "alarm327234.mp3",
              createdAt: new Date(),
            },
            {
              id: "2",
              time: "07:45",
              label: "Chuẩn bị đến trường",
              enabled: true,
              repeat: ["mon", "tue", "wed", "thu", "fri", "sat"],
              sound: "alarm327234.mp3",
              createdAt: new Date(),
            },
          ];
          setAlarms(sampleAlarms);
          localStorage.setItem("studyAlarms", JSON.stringify(sampleAlarms));
        }
      } catch (err) {
        console.error("Error during alarm initialization:", err);
      }
    };

    init();
  }, []);

  // Save alarms to localStorage
  useEffect(() => {
    if (alarms.length > 0) {
      localStorage.setItem("studyAlarms", JSON.stringify(alarms));
    }
  }, [alarms]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for alarm triggers
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTimeStr = now.toTimeString().substring(0, 5);
      const currentDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
        now.getDay()
      ];

      alarms.forEach((alarm) => {
        const last = lastTriggeredRef.current[alarm.id] || 0;
        // nếu đã trigger trong 60s qua thì bỏ qua
        if (Date.now() - last < 60000) return;

        if (
          alarm.enabled &&
          alarm.time === currentTimeStr &&
          (alarm.repeat.length === 0 || alarm.repeat.includes(currentDay))
        ) {
          triggerAlarm(alarm);
        }
      });
    };

  const interval = setInterval(checkAlarms, 1000);
  return () => clearInterval(interval);
}, [alarms]);
  // Tạo báo thức mới

  const createAlarm = () => {
    if (!newAlarm.time) {
      alert('Vui lòng chọn thời gian báo thức!');
      return;
    }

    const alarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarm.time,
      label: newAlarm.label.trim() || 'Báo thức',
      enabled: true,
      repeat: [...newAlarm.repeat],
      sound: newAlarm.sound,
      createdAt: new Date()
    };

    setAlarms(prev => [alarm, ...prev]);
    setNewAlarm({
      time: "07:00",
      label: "",
      repeat: [],
      sound: "alarm327234.mp3"
    });
    setIsCreateDialogOpen(false);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const deleteAlarm = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa báo thức này?')) {
      setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    }
  };

  const toggleRepeatDay = (day: string) => {
    setNewAlarm(prev => ({
      ...prev,
      repeat: prev.repeat.includes(day) 
        ? prev.repeat.filter(d => d !== day)
        : [...prev.repeat, day]
    }));
  };

  const dismissAlarm = () => {
    if (activeAlarm) {
      // đánh dấu đã trigger để tránh trigger lại ngay
      lastTriggeredRef.current[activeAlarm.id] = Date.now();
    }
    setActiveAlarm(null);
    stopAlarmSound();
  };

  const snoozeAlarm = () => {
    if (!activeAlarm) return;
    const snoozedAlarm = activeAlarm;
    // tránh retrigger ngay sau khi snooze
    lastTriggeredRef.current[snoozedAlarm.id] = Date.now();
    // dừng ngay và ẩn modal
    setActiveAlarm(null);
    stopAlarmSound();
    // kích hoạt lại sau 5 phút
    setTimeout(() => {
      triggerAlarm(snoozedAlarm);
    }, 5 * 60 * 1000);
  };

  const getTimeUntilAlarm = (alarmTime: string, repeat: string[]) => {
    const now = new Date();
    const [hours, minutes] = alarmTime.split(':').map(Number);
    const alarmDate = new Date();
    alarmDate.setHours(hours, minutes, 0, 0);

    if (repeat.length === 0) {
      // One-time alarm
      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }
      const diff = alarmDate.getTime() - now.getTime();
      const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
      const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hoursUntil}h ${minutesUntil}m`;
    } else {
      // Recurring alarm
      const currentDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][now.getDay()];
      const dayIndices = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
      
      let nextAlarmDay = null;
      let daysUntil = 0;

      // Check if alarm is today and hasn't passed
      if (repeat.includes(currentDay) && alarmDate > now) {
        return 'Hôm nay';
      }

      // Find next day
      for (let i = 1; i <= 7; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() + i);
        const checkDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][checkDate.getDay()];
        
        if (repeat.includes(checkDay)) {
          daysUntil = i;
          break;
        }
      }

      if (daysUntil === 1) return 'Ngày mai';
      if (daysUntil <= 7) return `${daysUntil} ngày`;
      return 'Không xác định';
    }
  };

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Chào buổi sáng!', icon: Sun };
    if (hour < 18) return { text: 'Chào buổi chiều!', icon: Sun };
    return { text: 'Chào buổi tối!', icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Stopwatch functions
  const startStopwatch = () => {
    setIsStopwatchRunning(true);
    stopwatchInterval.current = setInterval(() => {
      setStopwatchTime(prev => prev + 10);
    }, 10);
  };

  const pauseStopwatch = () => {
    setIsStopwatchRunning(false);
    if (stopwatchInterval.current) {
      clearInterval(stopwatchInterval.current);
    }
  };

  const resetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setStopwatchLaps([]);
    if (stopwatchInterval.current) {
      clearInterval(stopwatchInterval.current);
    }
  };

  const addLap = () => {
    setStopwatchLaps(prev => [...prev, stopwatchTime]);
  };

  const formatStopwatchTime = (time: number) => {
    const centiseconds = Math.floor((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 60000) % 60);
    const hours = Math.floor(time / 3600000);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };
  
  const formatTimerTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  
  // file âm thanh báo thức
  const alarmAudio = useRef<HTMLAudioElement | null>(null);

  // Timer functions
  const startTimer = () => {
    if (!isTimerSet) {
      const totalTime = timerMinutes * 60 + timerSeconds;
      if (totalTime <= 0) {
        alert('Vui lòng đặt thời gian hợp lệ!');
        return;
      }
      setTimerTime(totalTime);
      setIsTimerSet(true);
    }
    
    setIsTimerRunning(true);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    timerInterval.current = setInterval(() => {
      setTimerTime(prev => {
        if (prev <= 1) {
          // Timer finished
          if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
          }
          setIsTimerRunning(false);
          setIsTimerSet(false);

          // Tạo 1 alarm tạm thời để sử dụng chung logic trigger/dismiss (debounce)
          const id = 'timer-' + Date.now().toString();
          const mins = Math.floor((timerMinutes * 60 + timerSeconds) / 60);
          const secs = (timerMinutes * 60 + timerSeconds) % 60;
          const timeLabel = `${mins}:${secs.toString().padStart(2, '0')}`;
          const timerAlarm: Alarm = {
            id,
            time: timeLabel,
            label: `Hết giờ (${timeLabel})`,
            enabled: true,
            repeat: [],
            sound: 'alarm301729.mp3',
            createdAt: new Date()
          };

          // Dùng triggerAlarm để play sound + set activeAlarm (và đánh dấu lastTriggeredRef)
          // Không cần await
          triggerAlarm(timerAlarm);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setIsTimerSet(false);
    setTimerTime(0);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    // Dừng âm nếu đang phát
    stopAlarmSound();
  };

  const playAlarmSound = async (sound: string) => {
    try {
      // Stop any existing audio first
      stopAlarmSound();
      
      if (Capacitor.getPlatform() === "web") {
        // Web platform - use HTML Audio API
        const selected = alarmSounds.find(s => s.value === sound) || alarmSounds[0];
        const fullPath = window.location.origin + '/' + selected.file;
        alarmAudio.current = new Audio(fullPath);
        alarmAudio.current.loop = true;
        alarmAudio.current.volume = 1.0;
        
        // Add event listeners for better error handling
        alarmAudio.current.addEventListener('canplaythrough', () => {
          console.log('Audio can play through');
        });
        
        alarmAudio.current.addEventListener('error', (e) => {
          console.error('Audio error:', e);
        });
        
        await alarmAudio.current.play();
      } else {
        // Mobile platform - let the notification handle the sound
        // The sound will be played by the Android notification system
        console.log('Mobile platform - sound handled by notification');
      }
    } catch (err) {
      console.warn("Không thể phát âm thanh:", err);
      // Fallback to system beep or vibration
      if (navigator.vibrate) {
        navigator.vibrate([1000, 500, 1000, 500, 1000]);
      }
    }
  };

  const stopAlarmSound = () => {
    if (alarmAudio.current) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
      alarmAudio.current.src = '';
      alarmAudio.current.removeEventListener('canplaythrough', () => {});
      alarmAudio.current.removeEventListener('error', () => {});
      alarmAudio.current = null;
    }
  };

  const triggerAlarm = async (alarm: Alarm) => {
    try {
      // đánh dấu ngay khi trigger để tránh trigger lại trong khoảng debounce
      lastTriggeredRef.current[alarm.id] = Date.now();
      setActiveAlarm(alarm);
      
      // Play sound (will handle platform differences internally)
      await playAlarmSound(alarm.sound);

      if (Capacitor.getPlatform() === "web") {
        // Web notifications
        if (Notification.permission === "granted") {
          new Notification(`🔔 ${alarm.label}`, {
            body: `${alarm.time} - Đã đến giờ!,chuẩn bị công việc mới tiếp nòa!`,
            icon: '/icon-192x192.png',
            tag: `alarm_${alarm.id}`,
            requireInteraction: true
          });
        } else if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification(`🔔 ${alarm.label}`, {
              body: `${alarm.time} - Đã đến giờ! ,chuẩn bị công việc mới tiếp nòa!`,
              icon: '/icon-192x192.png',// Đảm bảo có icon trong public folder (cnay ko bt là icon nào nx)
              tag: `alarm_${alarm.id}`,
              requireInteraction: true
            });
          }
        }
      } else {
        // Thông báo di động với mục đích toàn màn hình cho Android
        const isTimer = alarm.id.startsWith('timer-');
        const channelId = isTimer ? "timer_channel" : "alarm_channel";
        
        await LocalNotifications.schedule({
          notifications: [
            {
              title: isTimer ? "⏲️ Hết thời gian rồi,đang kêu nè" : "⏰ Báo thức đang kêu nè",
              body: `${alarm.time} - ${alarm.label}`,
              id: Math.floor(Math.random() * 2147483647), // Ensure unique ID
              schedule: { at: new Date(Date.now() + 100) }, // Schedule immediately
              channelId: channelId,
              smallIcon: "ic_stat_icon_config_sample",
              largeIcon: "ic_launcher",
              sound: undefined, // để hệ thống tự chọn sound đã khai báo trong channel (cái này chịu) hên thì nó kêu:))
              extra: {
                alarmId: alarm.id,
                isAlarm: true
              },
              actionTypeId: "ALARM_ACTION",
              attachments: [],
              ongoing: false,
              autoCancel: false,
            },
          ],
        });
        
        console.log(`Scheduled ${isTimer ? 'timer' : 'alarm'} notification for ${alarm.label}`);
      }

      // Vibrate on mobile devices
      if (navigator.vibrate) {
        // Vibration pattern: [vibrate, pause, vibrate, pause, ...]
        const vibrationPattern = [1000, 500, 1000, 500, 1000, 500, 1000];
        navigator.vibrate(vibrationPattern);
      }

      // Auto dismiss after 2 minutes instead of 1
      setTimeout(() => {
        setActiveAlarm(prev => (prev && prev.id === alarm.id ? null : prev));
        stopAlarmSound();
      }, 120000); // 2 minutes
      
    } catch (error) {
      console.error('Error triggering alarm:', error);
      // Fallback: still show the modal even if notification fails
      setActiveAlarm(alarm);
      
      // Try to vibrate as fallback
      if (navigator.vibrate) {
        navigator.vibrate([1000, 500, 1000]);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-red-600">Báo Thức & Đồng Hồ</h1>
        </div>

        <Tabs defaultValue="alarm" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alarm" className="flex items-center gap-2">
              <AlarmClock className="w-4 h-4" />
              Báo Thức
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Bấm Giờ
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <TimerIcon className="w-4 h-4" />
              Hẹn Giờ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alarm">
            <div className="space-y-6">

            {/* Current Time Display */}
            <Card className="p-6 mb-8 text-center border-2 border-red-100">
              <div className="flex items-center justify-center gap-3 mb-2">
                <GreetingIcon className="w-8 h-8 text-yellow-500" />
                <span className="text-xl font-medium text-gray-700">{greeting.text}</span>
              </div>
              <div className="text-4xl font-mono font-bold text-red-600 mb-2">
                {formatCurrentTime()}
              </div>
              <div className="text-gray-600">
                {currentTime.toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </Card>

            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-medium text-gray-700">
                Báo thức ({alarms.filter(a => a.enabled).length} đang hoạt động)
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm báo thức
                  </Button>
                </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm Báo Thức Mới</DialogTitle>
                <DialogDescription>
                  Thiết lập báo thức để nhắc nhở học tập
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian
                  </label>
                  <Input
                    type="time"
                    value={newAlarm.time}
                    onChange={(e) => setNewAlarm({...newAlarm, time: e.target.value})}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhãn báo thức
                  </label>
                  <Input
                    placeholder="VD: Dậy đi học, Ôn bài..."
                    value={newAlarm.label}
                    onChange={(e) => setNewAlarm({...newAlarm, label: e.target.value})}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lặp lại
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => (
                      <Button
                        key={day.key}
                        type="button"
                        size="sm"
                        variant={newAlarm.repeat.includes(day.key) ? "default" : "outline"}
                        onClick={() => toggleRepeatDay(day.key)}
                        className={newAlarm.repeat.includes(day.key) ? "bg-red-500 hover:bg-red-600" : "border-red-300 text-red-600 hover:bg-red-50"}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Không chọn ngày nào = chỉ báo 1 lần
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Âm thanh
                  </label>
                  <select
                    value={newAlarm.sound}
                    onChange={(e) => setNewAlarm({...newAlarm, sound: e.target.value})}
                    className="w-full p-2 border border-red-200 rounded-md focus:border-red-400 focus:outline-none"
                  >
                    {alarmSounds.map(sound => (
                      <option key={sound.value} value={sound.value}>
                        {sound.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button 
                  onClick={createAlarm}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Tạo báo thức
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

            {alarms.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">⏰</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Chưa có báo thức nào
                </h3>
                <p className="text-gray-500 mb-6">
                  Thêm báo thức đầu tiên để nhắc nhở học tập
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alarms.map((alarm) => (
                  <Card key={alarm.id} className={`p-6 border-2 transition-colors ${
                    alarm.enabled ? 'border-red-200 hover:border-red-300' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className={`text-3xl font-mono font-bold ${alarm.enabled ? 'text-red-600' : 'text-gray-400'}`}>
                            {alarm.time}
                          </div>
                          <div className={`text-sm ${alarm.enabled ? 'text-red-500' : 'text-gray-400'}`}>
                            {getTimeUntilAlarm(alarm.time, alarm.repeat)}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className={`font-medium mb-1 ${alarm.enabled ? 'text-gray-800' : 'text-gray-500'}`}>
                            {alarm.label}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {alarm.repeat.length > 0 ? (
                              alarm.repeat.map(day => (
                                <Badge key={day} variant="secondary" className="text-xs">
                                  {weekDays.find(d => d.key === day)?.label}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="secondary" className="text-xs">Một lần</Badge>
                            )}
                          </div>
                          <div className={`text-sm ${alarm.enabled ? 'text-gray-600' : 'text-gray-400'}`}>
                            {alarmSounds.find(s => s.value === alarm.sound)?.label}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch
                          checked={alarm.enabled}
                          onCheckedChange={() => toggleAlarm(alarm.id)}
                        />
                        <Button
                          onClick={() => deleteAlarm(alarm.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            </div>
          </TabsContent>

          <TabsContent value="stopwatch">
            <Card className="p-8">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Bấm Giờ</h2>
                
                <div className="text-6xl font-mono font-bold text-blue-600">
                  {formatStopwatchTime(stopwatchTime)}
                </div>

                <div className="flex justify-center gap-4">
                  {!isStopwatchRunning ? (
                    <Button 
                      onClick={startStopwatch} 
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Bắt đầu
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseStopwatch} 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Tạm dừng
                    </Button>
                  )}
                  
                  <Button 
                    onClick={addLap} 
                    disabled={!isStopwatchRunning}
                    variant="outline" 
                    className="px-8 py-3"
                  >
                    Lưu vòng
                  </Button>
                  
                  <Button 
                    onClick={resetStopwatch} 
                    variant="outline" 
                    className="px-8 py-3"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>

                {stopwatchLaps.length > 0 && (
                  <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-semibold mb-3">Các vòng đã lưu:</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {stopwatchLaps.map((lapTime, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Vòng {index + 1}</span>
                          <span className="font-mono text-blue-600">{formatStopwatchTime(lapTime)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="timer">
            <Card className="p-8">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Hẹn Giờ</h2>
                
                {!isTimerSet ? (
                  <div className="space-y-6">
                    <div className="flex justify-center gap-4 items-center">
                      <div className="text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phút</label>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={timerMinutes}
                          onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                          className="w-20 text-center text-2xl font-mono"
                        />
                      </div>
                      <div className="text-3xl font-bold text-gray-400 mt-6">:</div>
                      <div className="text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Giây</label>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={timerSeconds}
                          onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                          className="w-20 text-center text-2xl font-mono"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-3">
                      <Button onClick={() => { setTimerMinutes(5); setTimerSeconds(0); }} variant="outline">
                        5 phút
                      </Button>
                      <Button onClick={() => { setTimerMinutes(10); setTimerSeconds(0); }} variant="outline">
                        10 phút
                      </Button>
                      <Button onClick={() => { setTimerMinutes(25); setTimerSeconds(0); }} variant="outline">
                        25 phút
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-6xl font-mono font-bold text-red-600">
                    {formatTimerTime(timerTime)}
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {!isTimerRunning ? (
                    <Button 
                      onClick={startTimer} 
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {isTimerSet ? 'Tiếp tục' : 'Bắt đầu'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseTimer} 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Tạm dừng
                    </Button>
                  )}
                  
                  <Button 
                    onClick={resetTimer} 
                    variant="outline" 
                    className="px-8 py-3"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Active Alarm Modal */}
        {activeAlarm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="p-8 max-w-md w-full mx-4 text-center animate-pulse">
              <div className="text-6xl mb-4">🔔</div>
              <h2 className="text-3xl font-bold text-red-600 mb-2">
                {activeAlarm.time}
              </h2>
              <h3 className="text-xl font-medium text-gray-800 mb-6">
                {activeAlarm.label}
              </h3>
              <div className="flex gap-3">
                <Button
                  onClick={snoozeAlarm}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  5 phút nữa
                </Button>
                <Button
                  onClick={dismissAlarm}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  Tắt báo thức
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 

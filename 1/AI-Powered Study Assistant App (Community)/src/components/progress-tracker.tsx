import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Clock, Target, TrendingUp, Calendar, BarChart3, BookOpen, Timer, Zap } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Area, AreaChart } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ProgressTrackerProps {
  onBack: () => void;
}

interface StudySession {
  date: string;
  duration: number; // in minutes
  type: 'app' | 'pomodoro' | 'flashcard';
}

interface DailyStats {
  date: string;
  totalMinutes: number;
  pomodoroSessions: number;
  appUsage: number;
  flashcardTime: number;
}

export function ProgressTracker({ onBack }: ProgressTrackerProps) {
  const [todayStats, setTodayStats] = useState<DailyStats>({
    date: new Date().toDateString(),
    totalMinutes: 0,
    pomodoroSessions: 0,
    appUsage: 0,
    flashcardTime: 0
  });
  
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<DailyStats[]>([]);
  const [yearlyStats, setYearlyStats] = useState<DailyStats[]>([]);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [sessionStartTime] = useState<number>(Date.now());

  // Load data from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    const sessions: StudySession[] = savedSessions ? JSON.parse(savedSessions) : [];
    
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => s.date === today);
    
    const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const todayPomodoro = todaySessions.filter(s => s.type === 'pomodoro').length;
    const todayApp = todaySessions.filter(s => s.type === 'app').reduce((sum, s) => sum + s.duration, 0);
    const todayFlashcard = todaySessions.filter(s => s.type === 'flashcard').reduce((sum, s) => sum + s.duration, 0);
    
    setTodayStats({
      date: today,
      totalMinutes: todayTotal,
      pomodoroSessions: todayPomodoro,
      appUsage: todayApp,
      flashcardTime: todayFlashcard
    });

    // Calculate weekly stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    
    const weeklyData: DailyStats[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo);
      date.setDate(date.getDate() + i);
      const dateString = date.toDateString();
      
      const daySessions = sessions.filter(s => s.date === dateString);
      const dayTotal = daySessions.reduce((sum, s) => sum + s.duration, 0);
      const dayPomodoro = daySessions.filter(s => s.type === 'pomodoro').length;
      const dayApp = daySessions.filter(s => s.type === 'app').reduce((sum, s) => sum + s.duration, 0);
      const dayFlashcard = daySessions.filter(s => s.type === 'flashcard').reduce((sum, s) => sum + s.duration, 0);
      
      weeklyData.push({
        date: date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' }),
        totalMinutes: dayTotal,
        pomodoroSessions: dayPomodoro,
        appUsage: dayApp,
        flashcardTime: dayFlashcard
      });
    }
    
    setWeeklyStats(weeklyData);

    // Simple monthly stats (last 7 days for demo)
    const monthlyData: DailyStats[] = weeklyData.map((day, index) => ({
      ...day,
      date: `Day ${index + 1}`
    }));
    setMonthlyStats(monthlyData);

    // Simple yearly stats (aggregate weekly data)
    const totalWeekMinutes = weeklyData.reduce((sum, day) => sum + day.totalMinutes, 0);
    const totalWeekPomodoro = weeklyData.reduce((sum, day) => sum + day.pomodoroSessions, 0);
    const totalWeekApp = weeklyData.reduce((sum, day) => sum + day.appUsage, 0);
    const totalWeekFlashcard = weeklyData.reduce((sum, day) => sum + day.flashcardTime, 0);
    
    const yearlyData: DailyStats[] = [
      {
        date: 'Tuần này',
        totalMinutes: totalWeekMinutes,
        pomodoroSessions: totalWeekPomodoro,
        appUsage: totalWeekApp,
        flashcardTime: totalWeekFlashcard
      }
    ];
    setYearlyStats(yearlyData);
  }, [weeklyStats]);

  // Track app usage time - simplified
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const currentTime = Date.now();
        const sessionDuration = Math.floor((currentTime - startTime) / 60000);
        
        if (sessionDuration > 0) {
          const today = new Date().toDateString();
          const savedSessions = localStorage.getItem('studySessions') || '[]';
          const sessions: StudySession[] = JSON.parse(savedSessions);
          
          sessions.push({
            date: today,
            duration: 1,
            type: 'app'
          });
          
          // Keep only last 100 sessions to prevent memory issues
          if (sessions.length > 100) {
            sessions.splice(0, sessions.length - 100);
          }
          
          localStorage.setItem('studySessions', JSON.stringify(sessions));
          
          setTodayStats(prev => ({
            ...prev,
            totalMinutes: prev.totalMinutes + 1,
            appUsage: prev.appUsage + 1
          }));
          
          setStartTime(currentTime);
        }
      } catch (error) {
        console.error('Error tracking app usage:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Simple function to track flashcard time
  const trackFlashcardTime = (minutes: number) => {
    try {
      const today = new Date().toDateString();
      const savedSessions = localStorage.getItem('studySessions');
      const sessions: StudySession[] = savedSessions ? JSON.parse(savedSessions) : [];
      
      sessions.push({
        date: today,
        duration: minutes,
        type: 'flashcard'
      });
      
      localStorage.setItem('studySessions', JSON.stringify(sessions));
      
      setTodayStats(prev => ({
        ...prev,
        totalMinutes: prev.totalMinutes + minutes,
        flashcardTime: prev.flashcardTime + minutes
      }));
    } catch (error) {
      console.error('Error tracking flashcard time:', error);
    }
  };

  // Calculate current session time - memoized
  const getCurrentSessionTime = () => {
    try {
      return Math.floor((Date.now() - sessionStartTime) / 60000);
    } catch (error) {
      console.error('Error calculating session time:', error);
      return 0;
    }
  };

  // Circular chart data for today
  const circularData = [
    { name: 'Đã học', value: todayStats.totalMinutes, fill: '#ef4444' },
    { name: 'Còn lại', value: Math.max(0, 480 - todayStats.totalMinutes), fill: '#fee2e2' } // 8 hours = 480 minutes target
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent > 0.1) {
      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          className="text-sm font-medium"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getProgressColor = (minutes: number, target: number) => {
    const percentage = (minutes / target) * 100;
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 via-blue-50 to-cyan-100 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-16 text-3xl opacity-20 educational-float">
          📊
        </div>
        <div className="absolute top-32 right-20 text-2xl opacity-15 gentle-pulse" style={{ animationDelay: "0.5s" }}>
          ⏱️
        </div>
        <div className="absolute top-1/4 left-8 text-3xl opacity-25 sparkle-animation" style={{ animationDelay: "1s" }}>
          📈
        </div>
        <div className="absolute top-3/4 right-16 text-2xl opacity-20 twinkle-animation">
          🎯
        </div>
        <div className="absolute bottom-32 left-20 text-3xl opacity-15 dance-animation" style={{ animationDelay: "2s" }}>
          ⚡
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-6 rounded-3xl shadow-xl animate-slide-down">
          <Button
            onClick={onBack}
            className="mr-4 bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">📊 Theo dõi tiến độ học tập</h1>
              <p className="text-white/80 text-sm">
                ⏱️ Phiên hiện tại: {getCurrentSessionTime()} phút | 
                🔥 Phân tích thông minh thời gian học tập
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Today's Progress - Circular Chart */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-800">Tiến độ hôm nay</h3>
            </div>
            
            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={circularData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {circularData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getProgressColor(todayStats.totalMinutes, 480)}`}>
                    {formatMinutes(todayStats.totalMinutes)}
                  </div>
                  <div className="text-xs text-gray-500">/ 8h mục tiêu</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-semibold text-red-500">{todayStats.pomodoroSessions}</div>
                <div className="text-xs text-gray-500">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-500">{formatMinutes(todayStats.appUsage)}</div>
                <div className="text-xs text-gray-500">App Usage</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-500">{formatMinutes(todayStats.flashcardTime)}</div>
                <div className="text-xs text-gray-500">Flashcards</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-500">
                  {Math.round((todayStats.totalMinutes / 480) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Hoàn thành</div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-800">Thống kê nhanh</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700">Tổng thời gian tuần này</span>
                </div>
                <span className="font-semibold text-red-600">
                  {formatMinutes(weeklyStats.reduce((sum, day) => sum + day.totalMinutes, 0))}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">Sessions Pomodoro tuần</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {weeklyStats.reduce((sum, day) => sum + day.pomodoroSessions, 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Trung bình mỗi ngày</span>
                </div>
                <span className="font-semibold text-green-600">
                  {formatMinutes(Math.round(weeklyStats.reduce((sum, day) => sum + day.totalMinutes, 0) / 7))}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-700">Thời gian Flashcard tuần</span>
                </div>
                <span className="font-semibold text-purple-600">
                  {formatMinutes(weeklyStats.reduce((sum, day) => sum + day.flashcardTime, 0))}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">Ngày học nhiều nhất</span>
                </div>
                <span className="font-semibold text-orange-600">
                  {formatMinutes(Math.max(...weeklyStats.map(day => day.totalMinutes)))}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Multi-Period Charts */}
        <Card className="p-6 animate-card-appear" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800">📈 Biểu đồ theo thời gian</h3>
          </div>
          
          <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="day" className="text-sm">📅 Hôm nay</TabsTrigger>
              <TabsTrigger value="week" className="text-sm">🗓️ Tuần này</TabsTrigger>
              <TabsTrigger value="month" className="text-sm">📊 Tháng này</TabsTrigger>
              <TabsTrigger value="year" className="text-sm">📈 Năm này</TabsTrigger>
            </TabsList>
            
            <TabsContent value="day" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <Timer className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-sm text-gray-600">Tổng thời gian</div>
                  <div className="font-bold text-blue-600">{formatMinutes(todayStats.totalMinutes)}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="text-sm text-gray-600">Pomodoro</div>
                  <div className="font-bold text-green-600">{todayStats.pomodoroSessions} sessions</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-sm text-gray-600">Flashcards</div>
                  <div className="font-bold text-purple-600">{formatMinutes(todayStats.flashcardTime)}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-sm text-gray-600">App Usage</div>
                  <div className="font-bold text-orange-600">{formatMinutes(todayStats.appUsage)}</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="week" className="mt-0">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={weeklyStats}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFlashcard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatMinutes(value),
                      name === 'totalMinutes' ? 'Tổng thời gian' : 
                      name === 'flashcardTime' ? 'Flashcards' : name
                    ]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="totalMinutes" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" name="Tổng thời gian" />
                  <Area type="monotone" dataKey="flashcardTime" stroke="#a855f7" fillOpacity={1} fill="url(#colorFlashcard)" name="Flashcards" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="month" className="mt-0">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatMinutes(value),
                      name === 'totalMinutes' ? 'Tổng thời gian' : 
                      name === 'flashcardTime' ? 'Flashcards' : 
                      name === 'appUsage' ? 'App Usage' : name
                    ]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="totalMinutes" stroke="#8884d8" strokeWidth={3} name="Tổng thời gian" />
                  <Line type="monotone" dataKey="flashcardTime" stroke="#a855f7" strokeWidth={2} name="Flashcards" />
                  <Line type="monotone" dataKey="appUsage" stroke="#f59e0b" strokeWidth={2} name="App Usage" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="year" className="mt-0">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={yearlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatMinutes(value),
                      name === 'totalMinutes' ? 'Tổng thời gian' : 
                      name === 'flashcardTime' ? 'Flashcards' : 
                      name === 'pomodoroSessions' ? 'Pomodoro Sessions' : name
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="totalMinutes" fill="#8884d8" name="Tổng thời gian" />
                  <Bar dataKey="flashcardTime" fill="#a855f7" name="Flashcards" />
                  <Bar dataKey="pomodoroSessions" fill="#10b981" name="Pomodoro Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Achievement Section */}
        <Card className="p-6 mt-6 animate-card-appear" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 text-xl">🏆 Thành tích & Cột mốc</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-red-200">
              <div className="text-3xl mb-3 animate-pulse-ring">🔥</div>
              <div className="text-sm text-gray-600 mb-1">Streak hiện tại</div>
              <div className="font-bold text-red-600 text-lg">
                {weeklyStats.filter(day => day.totalMinutes > 0).length} ngày
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200">
              <div className="text-3xl mb-3 gentle-pulse">⏱️</div>
              <div className="text-sm text-gray-600 mb-1">Sessions Pomodoro</div>
              <div className="font-bold text-blue-600 text-lg">
                {weeklyStats.reduce((sum, day) => sum + day.pomodoroSessions, 0)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200">
              <div className="text-3xl mb-3 sparkle-animation">🎯</div>
              <div className="text-sm text-gray-600 mb-1">Mục tiêu đạt được</div>
              <div className="font-bold text-green-600 text-lg">
                {weeklyStats.filter(day => day.totalMinutes >= 480).length}/7
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200">
              <div className="text-3xl mb-3 twinkle-animation">⭐</div>
              <div className="text-sm text-gray-600 mb-1">Điểm hiệu quả</div>
              <div className="font-bold text-purple-600 text-lg">
                {Math.round((weeklyStats.reduce((sum, day) => sum + day.totalMinutes, 0) / (7 * 480)) * 100)}%
              </div>
            </div>
          </div>

          {/* Additional Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📚</div>
                <div>
                  <div className="font-semibold text-orange-700">Tổng thời gian Flashcards tuần</div>
                  <div className="text-orange-600 text-lg font-bold">
                    {formatMinutes(weeklyStats.reduce((sum, day) => sum + day.flashcardTime, 0))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-3">
                <div className="text-2xl">⏰</div>
                <div>
                  <div className="font-semibold text-indigo-700">Phiên học hiện tại</div>
                  <div className="text-indigo-600 text-lg font-bold">
                    {formatMinutes(getCurrentSessionTime())}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Clock, Target, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ProgressTrackerProps {
  onBack: () => void;
}

interface StudySession {
  date: string;
  duration: number; // in minutes
  type: 'app' | 'pomodoro';
}

interface DailyStats {
  date: string;
  totalMinutes: number;
  pomodoroSessions: number;
  appUsage: number;
}

export function ProgressTracker({ onBack }: ProgressTrackerProps) {
  const [todayStats, setTodayStats] = useState<DailyStats>({
    date: new Date().toDateString(),
    totalMinutes: 0,
    pomodoroSessions: 0,
    appUsage: 0
  });
  
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Load data from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    const sessions: StudySession[] = savedSessions ? JSON.parse(savedSessions) : [];
    
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => s.date === today);
    
    const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const todayPomodoro = todaySessions.filter(s => s.type === 'pomodoro').length;
    const todayApp = todaySessions.filter(s => s.type === 'app').reduce((sum, s) => sum + s.duration, 0);
    
    setTodayStats({
      date: today,
      totalMinutes: todayTotal,
      pomodoroSessions: todayPomodoro,
      appUsage: todayApp
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
      
      weeklyData.push({
        date: date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' }),
        totalMinutes: dayTotal,
        pomodoroSessions: dayPomodoro,
        appUsage: dayApp
      });
    }
    
    setWeeklyStats(weeklyData);
  }, []);

  // Track app usage time
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const sessionDuration = Math.floor((currentTime - startTime) / 60000); // Convert to minutes
      
      if (sessionDuration > 0) {
        const today = new Date().toDateString();
        const savedSessions = localStorage.getItem('studySessions');
        const sessions: StudySession[] = savedSessions ? JSON.parse(savedSessions) : [];
        
        // Add current session
        sessions.push({
          date: today,
          duration: 1, // 1 minute increment
          type: 'app'
        });
        
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        
        // Update today stats
        setTodayStats(prev => ({
          ...prev,
          totalMinutes: prev.totalMinutes + 1,
          appUsage: prev.appUsage + 1
        }));
        
        setStartTime(currentTime);
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [startTime]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-3xl">
          <Button
            onClick={onBack}
            className="mr-4 bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-semibold">Theo dõi tiến độ</h1>
              <p className="text-red-100 text-sm">Phân tích thời gian học tập của bạn</p>
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

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-semibold text-red-500">{todayStats.pomodoroSessions}</div>
                <div className="text-xs text-gray-500">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-500">{formatMinutes(todayStats.appUsage)}</div>
                <div className="text-xs text-gray-500">App Usage</div>
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
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-700">Ngày học nhiều nhất</span>
                </div>
                <span className="font-semibold text-purple-600">
                  {formatMinutes(Math.max(...weeklyStats.map(day => day.totalMinutes)))}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800">Biểu đồ tuần (7 ngày qua)</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'totalMinutes' ? formatMinutes(value) : value,
                  name === 'totalMinutes' ? 'Tổng thời gian' : 
                  name === 'pomodoroSessions' ? 'Sessions Pomodoro' : 'Sử dụng App'
                ]}
              />
              <Legend />
              <Bar dataKey="totalMinutes" fill="#ef4444" name="Tổng thời gian (phút)" />
              <Bar dataKey="pomodoroSessions" fill="#3b82f6" name="Sessions Pomodoro" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Achievement Section */}
        <Card className="p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-800">Thành tích</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm text-gray-600">Streak hiện tại</div>
              <div className="font-semibold text-red-600">
                {weeklyStats.filter(day => day.totalMinutes > 0).length} ngày
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-sm text-gray-600">Sessions hoàn thành</div>
              <div className="font-semibold text-blue-600">
                {weeklyStats.reduce((sum, day) => sum + day.pomodoroSessions, 0)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm text-gray-600">Mục tiêu đạt được</div>
              <div className="font-semibold text-green-600">
                {weeklyStats.filter(day => day.totalMinutes >= 480).length}/7
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-sm text-gray-600">Điểm hiệu quả</div>
              <div className="font-semibold text-purple-600">
                {Math.round((weeklyStats.reduce((sum, day) => sum + day.totalMinutes, 0) / (7 * 480)) * 100)}%
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
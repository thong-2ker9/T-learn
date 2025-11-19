import { ClipboardList, Bell, Calendar, TrendingUp, Users, FileText } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface TeacherDashboardHomeProps {
  teacherName: string;
  teacherSubject: string;
  onNavigate: (tab: string) => void;
}

export function TeacherDashboardHome({ teacherName, teacherSubject, onNavigate }: TeacherDashboardHomeProps) {
  const shortcuts = [
    {
      title: "Tạo bài tập mới",
      description: "Giao bài tập cho học sinh",
      icon: ClipboardList,
      color: "from-red-400 to-red-500",
      action: () => onNavigate("assignments"),
    },
    {
      title: "Gửi thông báo",
      description: "Thông báo tới lớp học",
      icon: Bell,
      color: "from-pink-400 to-pink-500",
      action: () => onNavigate("messages"),
    },
    {
      title: "Tạo thời khóa biểu",
      description: "Lập lịch giảng dạy",
      icon: Calendar,
      color: "from-rose-400 to-rose-500",
      action: () => onNavigate("schedule"),
    },
  ];

  const stats = [
    { label: "Tổng học sinh", value: "156", icon: Users, color: "text-red-500" },
    { label: "Bài tập chờ chấm", value: "23", icon: FileText, color: "text-pink-500" },
    { label: "Lớp đang dạy", value: "5", icon: TrendingUp, color: "text-rose-500" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-400 to-red-500 rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-3xl mb-2">Xin chào, {teacherName}! 👋</h1>
        <p className="text-red-100">Chào mừng bạn đến với hệ thống quản lý giảng dạy T-learn</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-gray-800 mb-6">Lối tắt</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shortcuts.map((shortcut, index) => {
            const Icon = shortcut.icon;
            return (
              <button
                key={index}
                onClick={shortcut.action}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-left hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${shortcut.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-gray-800 mb-2">{shortcut.title}</h3>
                <p className="text-gray-600 text-sm">{shortcut.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-gray-800 mb-6">Hoạt động gần đây</h2>
        <Card className="border-0 shadow-lg rounded-3xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { text: "Bạn đã tạo bài tập mới: Bài tập về nhà số 5", time: "2 giờ trước", color: "bg-red-100" },
                { text: "15 học sinh đã nộp bài tập Toán tuần 3", time: "5 giờ trước", color: "bg-pink-100" },
                { text: "Bạn đã gửi thông báo tới lớp 10A1", time: "1 ngày trước", color: "bg-rose-100" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm">{activity.text}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ScheduleEvent {
  id: string;
  title: string;
  class: string;
  time: string;
  day: number;
  color: string;
}

export function TeacherSchedule() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showSendModal, setShowSendModal] = useState(false);

  const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
  const timeSlots = ["7:00", "8:00", "9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

  const mySchedule: ScheduleEvent[] = [
    { id: "1", title: "Toán", class: "10A1", time: "7:00", day: 0, color: "bg-red-400" },
    { id: "2", title: "Toán", class: "10A2", time: "8:00", day: 0, color: "bg-pink-400" },
    { id: "3", title: "Toán", class: "11A1", time: "9:00", day: 1, color: "bg-rose-400" },
    { id: "4", title: "Toán", class: "10A1", time: "13:00", day: 2, color: "bg-red-400" },
    { id: "5", title: "Toán", class: "11A2", time: "14:00", day: 3, color: "bg-red-500" },
    { id: "6", title: "Toán", class: "12A1", time: "7:00", day: 4, color: "bg-pink-500" },
  ];

  const getEventsForDayAndTime = (day: number, time: string) => {
    return mySchedule.filter(event => event.day === day && event.time === time);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-gray-800 text-2xl">Thời khóa biểu</h1>
        <Button
          onClick={() => setShowSendModal(true)}
          className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl"
        >
          <Send className="w-5 h-5 mr-2" />
          Gửi lịch cho học sinh
        </Button>
      </div>

      {/* Tabs */}
      <Card className="border-0 shadow-lg rounded-3xl">
        <CardContent className="p-6">
          <Tabs defaultValue="my-schedule" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-red-50 rounded-2xl p-1">
              <TabsTrigger value="my-schedule" className="rounded-xl data-[state=active]:bg-white">
                Lịch của tôi
              </TabsTrigger>
              <TabsTrigger value="all-schedule" className="rounded-xl data-[state=active]:bg-white">
                Lịch chung
              </TabsTrigger>
            </TabsList>

            {/* My Schedule */}
            <TabsContent value="my-schedule" className="space-y-6">
              {/* Week Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="rounded-2xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="text-center">
                  <p className="text-gray-800">Tuần này</p>
                  <p className="text-gray-600 text-sm">16/11/2025 - 22/11/2025</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="rounded-2xl"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Schedule Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="p-3 text-gray-600 text-sm">Giờ</div>
                    {daysOfWeek.map((day, index) => (
                      <div key={index} className="p-3 bg-red-50 rounded-2xl text-center">
                        <p className="text-gray-800 text-sm">{day}</p>
                      </div>
                    ))}
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-2">
                    {timeSlots.map((time, timeIndex) => (
                      <div key={timeIndex} className="grid grid-cols-8 gap-2">
                        <div className="p-3 flex items-center">
                          <span className="text-gray-600 text-sm">{time}</span>
                        </div>
                        {daysOfWeek.map((day, dayIndex) => {
                          const events = getEventsForDayAndTime(dayIndex, time);
                          return (
                            <div
                              key={dayIndex}
                              className="p-3 bg-gray-50 rounded-2xl min-h-[60px] flex items-center justify-center"
                            >
                              {events.length > 0 && (
                                <div className="w-full">
                                  {events.map(event => (
                                    <div
                                      key={event.id}
                                      className={`${event.color} text-white rounded-xl p-2 text-xs text-center`}
                                    >
                                      <p>{event.title}</p>
                                      <p className="opacity-90">{event.class}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <Card className="border-0 bg-red-50 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-gray-800">Tổng số tiết trong tuần</p>
                      <p className="text-gray-600 text-sm">{mySchedule.length} tiết</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* All Schedule */}
            <TabsContent value="all-schedule" className="space-y-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Lịch chung của trường sẽ hiển thị ở đây</p>
                <p className="text-gray-500 text-sm mt-2">Chức năng đang được phát triển</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Send Schedule Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full border-0 shadow-2xl rounded-3xl animate-scale-in">
            <CardContent className="p-8">
              <h2 className="text-gray-800 text-xl mb-6">Gửi lịch cho học sinh</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Chọn lớp</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400">
                    <option>Tất cả lớp</option>
                    <option>Lớp 10A1</option>
                    <option>Lớp 10A2</option>
                    <option>Lớp 11A1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Tuần</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400">
                    <option>Tuần này</option>
                    <option>Tuần sau</option>
                    <option>Tháng này</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => {
                    console.log("Sending schedule");
                    setShowSendModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl py-6"
                >
                  Gửi lịch
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 rounded-2xl py-6"
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

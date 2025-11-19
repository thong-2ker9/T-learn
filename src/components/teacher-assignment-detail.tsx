import { ArrowLeft, Bell, CheckCircle, XCircle, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Assignment {
  id: string;
  title: string;
  class: string;
  deadline: string;
  totalStudents: number;
  received: number;
  submitted: number;
  status: "active" | "overdue" | "completed";
}

interface TeacherAssignmentDetailProps {
  assignment: Assignment;
  onBack: () => void;
}

interface Student {
  id: string;
  name: string;
  received: boolean;
  submitted: boolean;
  submittedAt?: string;
}

export function TeacherAssignmentDetail({ assignment, onBack }: TeacherAssignmentDetailProps) {
  const students: Student[] = [
    { id: "1", name: "Nguyễn Văn A", received: true, submitted: true, submittedAt: "2025-11-16 10:30" },
    { id: "2", name: "Trần Thị B", received: true, submitted: true, submittedAt: "2025-11-16 14:20" },
    { id: "3", name: "Lê Văn C", received: true, submitted: false },
    { id: "4", name: "Phạm Thị D", received: false, submitted: false },
    { id: "5", name: "Hoàng Văn E", received: true, submitted: true, submittedAt: "2025-11-17 09:15" },
  ];

  const receivedStudents = students.filter(s => s.received);
  const notReceivedStudents = students.filter(s => !s.received);
  const submittedStudents = students.filter(s => s.submitted);
  const notSubmittedStudents = students.filter(s => s.received && !s.submitted);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRemindStudent = (studentId: string) => {
    console.log("Reminding student:", studentId);
  };

  const handleRemindAll = () => {
    console.log("Reminding all students");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded-2xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại
        </Button>
      </div>

      {/* Assignment Info */}
      <Card className="border-0 shadow-lg rounded-3xl">
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-gray-800 text-2xl mb-2">{assignment.title}</h1>
                <p className="text-gray-600">{assignment.class}</p>
              </div>
              {assignment.status === "completed" && (
                <Badge className="bg-green-100 text-green-700 rounded-xl">
                  Hoàn thành
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
              <div>
                <p className="text-gray-500 text-sm mb-1">Hạn nộp</p>
                <p className="text-gray-800">{new Date(assignment.deadline).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Tổng học sinh</p>
                <p className="text-gray-800">{assignment.totalStudents}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Đã nhận</p>
                <p className="text-gray-800">{assignment.received} / {assignment.totalStudents}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Đã nộp</p>
                <p className="text-gray-800">{assignment.submitted} / {assignment.totalStudents}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Status Tabs */}
      <Card className="border-0 shadow-lg rounded-3xl">
        <CardContent className="p-6">
          <Tabs defaultValue="received" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-red-50 rounded-2xl p-1">
              <TabsTrigger value="received" className="rounded-xl data-[state=active]:bg-white">
                Trạng thái nhận bài
              </TabsTrigger>
              <TabsTrigger value="submitted" className="rounded-xl data-[state=active]:bg-white">
                Trạng thái nộp bài
              </TabsTrigger>
            </TabsList>

            {/* Received Tab */}
            <TabsContent value="received" className="space-y-6">
              {/* Received Students */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-800 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Đã nhận ({receivedStudents.length})</span>
                  </h3>
                </div>
                <div className="space-y-3">
                  {receivedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-green-50 rounded-2xl"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-green-500 text-white">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-gray-800">{student.name}</span>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Not Received Students */}
              {notReceivedStudents.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 flex items-center space-x-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span>Chưa nhận ({notReceivedStudents.length})</span>
                    </h3>
                    <Button
                      onClick={handleRemindAll}
                      size="sm"
                      className="bg-red-400 hover:bg-red-500 text-white rounded-2xl"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Nhắc nhở tất cả
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {notReceivedStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-red-50 rounded-2xl"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-red-500 text-white">
                              {getInitials(student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-800">{student.name}</span>
                        </div>
                        <Button
                          onClick={() => handleRemindStudent(student.id)}
                          size="sm"
                          variant="outline"
                          className="rounded-2xl"
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Nhắc nhở
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Submitted Tab */}
            <TabsContent value="submitted" className="space-y-6">
              {/* Submitted Students */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-800 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Đã nộp ({submittedStudents.length})</span>
                  </h3>
                </div>
                <div className="space-y-3">
                  {submittedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-green-50 rounded-2xl"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-green-500 text-white">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-gray-800">{student.name}</p>
                          {student.submittedAt && (
                            <p className="text-gray-500 text-xs">{student.submittedAt}</p>
                          )}
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Not Submitted Students */}
              {notSubmittedStudents.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 flex items-center space-x-2">
                      <XCircle className="w-5 h-5 text-orange-500" />
                      <span>Chưa nộp ({notSubmittedStudents.length})</span>
                    </h3>
                    <Button
                      onClick={handleRemindAll}
                      size="sm"
                      className="bg-orange-400 hover:bg-orange-500 text-white rounded-2xl"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Nhắc nhở tất cả
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {notSubmittedStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-orange-500 text-white">
                              {getInitials(student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-800">{student.name}</span>
                        </div>
                        <Button
                          onClick={() => handleRemindStudent(student.id)}
                          size="sm"
                          variant="outline"
                          className="rounded-2xl"
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Nhắc nhở
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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

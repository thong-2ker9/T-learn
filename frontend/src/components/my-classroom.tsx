import { useState } from "react";
import { ArrowLeft, Book, MessageCircle, Clock, CheckCircle2, Star, Calendar, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface Assignment {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  submittedAt?: string;
}

interface MyClassroomProps {
  onBack: () => void;
  onOpenMessages: () => void;
}

export function MyClassroom({ onBack, onOpenMessages }: MyClassroomProps) {
  const [selectedTab, setSelectedTab] = useState<"all" | "pending" | "submitted" | "graded">("all");

  const assignments: Assignment[] = [
    {
      id: "1",
      teacherId: "1",
      teacherName: "Thầy Nguyễn Văn A",
      subject: "Toán học",
      title: "Bài tập về phương trình bậc 2",
      description: "Hoàn thành các bài tập từ 1-10 trong sách giáo khoa trang 45",
      dueDate: "2025-12-05",
      status: "pending",
    },
    {
      id: "2",
      teacherId: "2",
      teacherName: "Cô Trần Thị B",
      subject: "Văn học",
      title: "Phân tích tác phẩm 'Chiếc lược ngà'",
      description: "Viết bài phân tích chi tiết về tác phẩm, tối thiểu 500 từ",
      dueDate: "2025-12-01",
      status: "submitted",
      submittedAt: "2025-11-28 10:30",
    },
    {
      id: "3",
      teacherId: "1",
      teacherName: "Thầy Nguyễn Văn A",
      subject: "Toán học",
      title: "Bài kiểm tra giữa kỳ",
      description: "Ôn tập chương 1, 2, 3",
      dueDate: "2025-11-10",
      status: "graded",
      grade: 9.5,
      submittedAt: "2025-11-10 08:00",
    },
    {
      id: "4",
      teacherId: "3",
      teacherName: "Thầy Lê Văn C",
      subject: "Tiếng Anh",
      title: "Writing assignment: My family",
      description: "Write a 200-word essay about your family",
      dueDate: "2025-12-10",
      status: "pending",
    },
  ];

  const handleSubmitAssignment = (assignmentId: string) => {
    console.log("Submitting assignment:", assignmentId);
    toast.success("Đã nộp bài tập thành công!");
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      "Toán học": "bg-blue-100 text-blue-700 border-blue-200",
      "Văn học": "bg-purple-100 text-purple-700 border-purple-200",
      "Tiếng Anh": "bg-green-100 text-green-700 border-green-200",
      "Vật lý": "bg-orange-100 text-orange-700 border-orange-200",
      "Hóa học": "bg-pink-100 text-pink-700 border-pink-200",
    };
    return colors[subject] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (selectedTab === "all") return true;
    return assignment.status === selectedTab;
  });

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length,
    avgGrade: assignments.filter(a => a.grade !== undefined).reduce((acc, a) => acc + (a.grade || 0), 0) / assignments.filter(a => a.grade !== undefined).length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl transition-all bg-white hover:bg-red-50 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 text-red-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl text-gray-800">Lớp học của tôi</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-0.5">
                Quản lý bài tập và kết nối với giáo viên
              </p>
            </div>
            <Button
              onClick={onOpenMessages}
              className="bg-white hover:bg-red-50 text-gray-700 border border-gray-200 rounded-xl shadow-md gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Tin nhắn</span>
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                selectedTab === "all"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setSelectedTab("pending")}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                selectedTab === "pending"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Chưa nộp ({stats.pending})
            </button>
            <button
              onClick={() => setSelectedTab("submitted")}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                selectedTab === "submitted"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Đã nộp ({stats.submitted})
            </button>
            <button
              onClick={() => setSelectedTab("graded")}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                selectedTab === "graded"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Đã chấm ({stats.graded})
            </button>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
              <Book className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-gray-600">Không có bài tập nào</p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              const isOverdue = daysUntilDue < 0 && assignment.status === 'pending';
              const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && assignment.status === 'pending';

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
                >
                  {/* Assignment Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-lg text-xs border ${getSubjectColor(assignment.subject)}`}>
                          {assignment.subject}
                        </span>
                        {assignment.status === 'pending' && (
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
                            <Clock className="w-3 h-3 mr-1" />
                            Chưa nộp
                          </Badge>
                        )}
                        {assignment.status === 'submitted' && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Đã nộp
                          </Badge>
                        )}
                        {assignment.status === 'graded' && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                            <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                            Đã chấm
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl text-gray-800 mb-1">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {assignment.description}
                      </p>
                    </div>
                  </div>

                  {/* Assignment Details */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {isOverdue ? (
                          <span className="text-red-600">Quá hạn {Math.abs(daysUntilDue)} ngày</span>
                        ) : isDueSoon ? (
                          <span className="text-orange-600">Còn {daysUntilDue} ngày</span>
                        ) : (
                          `Hạn: ${new Date(assignment.dueDate).toLocaleDateString('vi-VN')}`
                        )}
                      </span>
                    </div>
                    {assignment.submittedAt && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Nộp: {assignment.submittedAt}</span>
                      </div>
                    )}
                    {assignment.grade !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-yellow-600">Điểm: {assignment.grade}/10</span>
                      </div>
                    )}
                  </div>

                  {/* Assignment Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      {assignment.teacherName}
                    </p>
                    {assignment.status === 'pending' && (
                      <Button
                        onClick={() => handleSubmitAssignment(assignment.id)}
                        className={`rounded-xl ${
                          isOverdue || isDueSoon
                            ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                            : "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
                        }`}
                      >
                        {isOverdue ? "Nộp ngay" : "Nộp bài"}
                      </Button>
                    )}
                    {assignment.status === 'submitted' && (
                      <span className="text-sm text-blue-600">Chờ chấm điểm</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Warning for overdue assignments */}
        {assignments.some(a => getDaysUntilDue(a.dueDate) < 0 && a.status === 'pending') && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-800">
                Bạn có {assignments.filter(a => getDaysUntilDue(a.dueDate) < 0 && a.status === 'pending').length} bài tập quá hạn
              </p>
              <p className="text-sm text-red-600 mt-1">
                Hãy liên hệ với giáo viên để được hướng dẫn nộp bài
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Plus, Clock, CheckCircle, XCircle, Search, Filter } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { TeacherAssignmentDetail } from "./teacher-assignment-detail";

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

export function TeacherAssignments() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    class: "",
    deadline: "",
    requireConfirmation: true,
  });

  const assignments: Assignment[] = [
    {
      id: "1",
      title: "Bài tập về nhà số 5 - Phương trình bậc 2",
      class: "Lớp 10A1",
      deadline: "2025-11-20",
      totalStudents: 35,
      received: 32,
      submitted: 28,
      status: "active",
    },
    {
      id: "2",
      title: "Bài tập tuần 3 - Hàm số bậc nhất",
      class: "Lớp 10A2",
      deadline: "2025-11-18",
      totalStudents: 32,
      received: 30,
      submitted: 25,
      status: "active",
    },
    {
      id: "3",
      title: "Kiểm tra 15 phút - Chương 2",
      class: "Lớp 11A1",
      deadline: "2025-11-15",
      totalStudents: 30,
      received: 30,
      submitted: 30,
      status: "completed",
    },
  ];

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating assignment:", newAssignment);
    setShowCreateForm(false);
    setNewAssignment({
      title: "",
      description: "",
      class: "",
      deadline: "",
      requireConfirmation: true,
    });
  };

  if (selectedAssignment) {
    return (
      <TeacherAssignmentDetail
        assignment={selectedAssignment}
        onBack={() => setSelectedAssignment(null)}
      />
    );
  }

  if (showCreateForm) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gray-800 text-2xl">Tạo bài tập mới</h1>
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
            className="rounded-2xl"
          >
            Hủy
          </Button>
        </div>

        <Card className="border-0 shadow-lg rounded-3xl">
          <CardContent className="p-8">
            <form onSubmit={handleCreateAssignment} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Tiêu đề bài tập</label>
                <Input
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="Nhập tiêu đề bài tập"
                  className="rounded-2xl"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Mô tả chi tiết</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Nhập mô tả bài tập"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Chọn lớp</label>
                  <select
                    value={newAssignment.class}
                    onChange={(e) => setNewAssignment({ ...newAssignment, class: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn lớp --</option>
                    <option value="10A1">Lớp 10A1</option>
                    <option value="10A2">Lớp 10A2</option>
                    <option value="11A1">Lớp 11A1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Hạn nộp</label>
                  <Input
                    type="datetime-local"
                    value={newAssignment.deadline}
                    onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                    className="rounded-2xl"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="requireConfirmation"
                  checked={newAssignment.requireConfirmation}
                  onChange={(e) => setNewAssignment({ ...newAssignment, requireConfirmation: e.target.checked })}
                  className="w-5 h-5 text-red-500 rounded"
                />
                <label htmlFor="requireConfirmation" className="text-gray-700">
                  Yêu cầu học sinh xác nhận đã nhận bài
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl py-6"
                >
                  Tạo bài tập
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 rounded-2xl py-6"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-gray-800 text-2xl">Giao bài tập</h1>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo bài tập mới
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài tập..."
            className="pl-10 rounded-2xl"
          />
        </div>
        <Button variant="outline" className="rounded-2xl">
          <Filter className="w-5 h-5 mr-2" />
          Lọc
        </Button>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl cursor-pointer group"
            onClick={() => setSelectedAssignment(assignment)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-gray-800 group-hover:text-red-500 transition-colors">
                      {assignment.title}
                    </h3>
                    {assignment.status === "completed" && (
                      <Badge className="bg-green-100 text-green-700 rounded-xl">
                        Hoàn thành
                      </Badge>
                    )}
                    {assignment.status === "overdue" && (
                      <Badge className="bg-red-100 text-red-700 rounded-xl">
                        Quá hạn
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{assignment.class}</p>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Hạn nộp: {new Date(assignment.deadline).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-2xl text-gray-800">{assignment.received}</span>
                      <span className="text-gray-500">/ {assignment.totalStudents}</span>
                    </div>
                    <p className="text-gray-600 text-xs">Đã nhận</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-2xl text-gray-800">{assignment.submitted}</span>
                      <span className="text-gray-500">/ {assignment.totalStudents}</span>
                    </div>
                    <p className="text-gray-600 text-xs">Đã nộp</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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

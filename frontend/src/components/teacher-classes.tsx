import { useState } from "react";
import { Users, BookOpen, FileText, Search } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { TeacherClassDetail } from "./teacher-class-detail";

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  color: string;
}

export function TeacherClasses() {
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const classes: ClassInfo[] = [
    { id: "1", name: "Lớp 10A1", subject: "Toán", studentCount: 35, color: "from-red-400 to-red-500" },
    { id: "2", name: "Lớp 10A2", subject: "Toán", studentCount: 32, color: "from-pink-400 to-pink-500" },
    { id: "3", name: "Lớp 11A1", subject: "Toán", studentCount: 30, color: "from-rose-400 to-rose-500" },
    { id: "4", name: "Lớp 11A2", subject: "Toán", studentCount: 33, color: "from-red-500 to-red-600" },
    { id: "5", name: "Lớp 12A1", subject: "Toán", studentCount: 28, color: "from-pink-500 to-pink-600" },
  ];

  if (selectedClass) {
    return (
      <TeacherClassDetail
        classInfo={selectedClass}
        onBack={() => setSelectedClass(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-800 text-2xl mb-2">Quản lý lớp học</h1>
          <p className="text-gray-600">Bạn đang quản lý {classes.length} lớp học</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm lớp học..."
          className="pl-10 rounded-2xl"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tổng lớp học</p>
                <p className="text-3xl text-gray-800">{classes.length}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tổng học sinh</p>
                <p className="text-3xl text-gray-800">
                  {classes.reduce((sum, c) => sum + c.studentCount, 0)}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center">
                <Users className="w-7 h-7 text-pink-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tài liệu</p>
                <p className="text-3xl text-gray-800">48</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                <FileText className="w-7 h-7 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classInfo) => (
          <Card
            key={classInfo.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl cursor-pointer group overflow-hidden"
            onClick={() => setSelectedClass(classInfo)}
          >
            <div className={`h-32 bg-gradient-to-br ${classInfo.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
              <Users className="w-16 h-16 text-white opacity-80" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-gray-800 mb-2 group-hover:text-red-500 transition-colors">
                {classInfo.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{classInfo.subject}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{classInfo.studentCount} học sinh</span>
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

import { useState } from "react";
import { ArrowLeft, Upload, FileText, Download, Trash2, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  color: string;
}

interface TeacherClassDetailProps {
  classInfo: ClassInfo;
  onBack: () => void;
}

interface Student {
  id: string;
  name: string;
  email: string;
  assignmentsCompleted: number;
  totalAssignments: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export function TeacherClassDetail({ classInfo, onBack }: TeacherClassDetailProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const students: Student[] = [
    { id: "1", name: "Nguyễn Văn A", email: "nguyenvana@email.com", assignmentsCompleted: 8, totalAssignments: 10 },
    { id: "2", name: "Trần Thị B", email: "tranthib@email.com", assignmentsCompleted: 10, totalAssignments: 10 },
    { id: "3", name: "Lê Văn C", email: "levanc@email.com", assignmentsCompleted: 7, totalAssignments: 10 },
    { id: "4", name: "Phạm Thị D", email: "phamthid@email.com", assignmentsCompleted: 9, totalAssignments: 10 },
    { id: "5", name: "Hoàng Văn E", email: "hoangvane@email.com", assignmentsCompleted: 6, totalAssignments: 10 },
  ];

  const documents: Document[] = [
    { id: "1", name: "Giáo án tuần 1.pdf", type: "PDF", size: "2.4 MB", uploadedAt: "2025-11-10" },
    { id: "2", name: "Bài tập chương 1.docx", type: "DOCX", size: "1.2 MB", uploadedAt: "2025-11-12" },
    { id: "3", name: "Đề kiểm tra giữa kỳ.pdf", type: "PDF", size: "856 KB", uploadedAt: "2025-11-14" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUploadDocument = () => {
    console.log("Upload document");
  };

  const handleDeleteDocument = (docId: string) => {
    console.log("Delete document:", docId);
  };

  if (selectedStudent) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setSelectedStudent(null)}
            className="rounded-2xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
        </div>

        <Card className="border-0 shadow-lg rounded-3xl">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white text-2xl">
                  {getInitials(selectedStudent.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-gray-800 text-2xl mb-2">{selectedStudent.name}</h2>
                <p className="text-gray-600 mb-1">{selectedStudent.email}</p>
                <p className="text-gray-600">{classInfo.name} - {classInfo.subject}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-gray-800 mb-4">Tiến độ bài tập</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Hoàn thành</span>
                    <span className="text-gray-800">
                      {selectedStudent.assignmentsCompleted} / {selectedStudent.totalAssignments}
                    </span>
                  </div>
                  <Progress
                    value={(selectedStudent.assignmentsCompleted / selectedStudent.totalAssignments) * 100}
                    className="h-3 rounded-full"
                  />
                  <p className="text-gray-600 text-sm">
                    Tỉ lệ hoàn thành: {Math.round((selectedStudent.assignmentsCompleted / selectedStudent.totalAssignments) * 100)}%
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-gray-800 mb-4">Lịch sử nộp bài</h3>
                <div className="space-y-3">
                  {[
                    { title: "Bài tập số 5", date: "2025-11-16", status: "Đã nộp" },
                    { title: "Bài tập số 4", date: "2025-11-14", status: "Đã nộp" },
                    { title: "Bài tập số 3", date: "2025-11-12", status: "Đã nộp" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="text-gray-800">{item.title}</p>
                        <p className="text-gray-500 text-sm">{item.date}</p>
                      </div>
                      <span className="text-green-600 text-sm">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      {/* Class Info */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <div className={`h-32 bg-gradient-to-br ${classInfo.color} flex items-center justify-center`}>
          <div className="text-center text-white">
            <h1 className="text-3xl mb-2">{classInfo.name}</h1>
            <p className="text-white/90">{classInfo.subject}</p>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-3xl text-gray-800 mb-1">{classInfo.studentCount}</p>
              <p className="text-gray-600 text-sm">Học sinh</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-gray-800 mb-1">12</p>
              <p className="text-gray-600 text-sm">Bài tập</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-gray-800 mb-1">{documents.length}</p>
              <p className="text-gray-600 text-sm">Tài liệu</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card className="border-0 shadow-lg rounded-3xl">
        <CardContent className="p-6">
          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-red-50 rounded-2xl p-1">
              <TabsTrigger value="students" className="rounded-xl data-[state=active]:bg-white">
                Học sinh
              </TabsTrigger>
              <TabsTrigger value="documents" className="rounded-xl data-[state=active]:bg-white">
                Tài liệu lớp
              </TabsTrigger>
            </TabsList>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-4">
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-red-50 rounded-2xl cursor-pointer transition-colors group"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-gray-800 group-hover:text-red-600 transition-colors">{student.name}</p>
                        <p className="text-gray-500 text-sm">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-800">
                        {student.assignmentsCompleted}/{student.totalAssignments}
                      </p>
                      <p className="text-gray-500 text-xs">Bài tập</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <Button
                onClick={handleUploadDocument}
                className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl py-6"
              >
                <Upload className="w-5 h-5 mr-2" />
                Tải lên tài liệu mới
              </Button>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{doc.name}</p>
                        <p className="text-gray-500 text-sm">
                          {doc.type} • {doc.size} • {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="rounded-xl">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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

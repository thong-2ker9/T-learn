import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Upload, Download, Trash2, Eye, Calendar, Clock } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ScheduleImage {
  id: string;
  name: string;
  imageUrl: string;
  uploadDate: Date;
  semester: string;
  note: string;
}

interface ScheduleProps {
  onBack: () => void;
}

export function Schedule({ onBack }: ScheduleProps) {
  const [schedules, setSchedules] = useState<ScheduleImage[]>([]);
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleImage | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: "",
    semester: "",
    note: "",
    file: null as File | null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load schedules from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('studySchedules');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((schedule: any) => ({
          ...schedule,
          uploadDate: new Date(schedule.uploadDate)
        }));
        setSchedules(parsed);
      } catch (error) {
        console.error('Error loading schedules:', error);
      }
    }
  }, []);

  // Save schedules to localStorage whenever they change
  useEffect(() => {
    if (schedules.length > 0) {
      localStorage.setItem('studySchedules', JSON.stringify(schedules));
    }
  }, [schedules]);

  // Helper function to update schedules
  const saveSchedules = (newSchedules: ScheduleImage[]) => {
    setSchedules(newSchedules);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File quá lớn! Vui lòng chọn ảnh nhỏ hơn 10MB.');
        return;
      }

      setUploadData(prev => ({ ...prev, file }));
    }
  };

  const uploadSchedule = () => {
    if (!uploadData.file) {
      alert('Vui lòng chọn ảnh thời khóa biểu!');
      return;
    }

    if (!uploadData.name.trim()) {
      alert('Vui lòng nhập tên thời khóa biểu!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      const newSchedule: ScheduleImage = {
        id: Date.now().toString(),
        name: uploadData.name.trim(),
        imageUrl,
        uploadDate: new Date(),
        semester: uploadData.semester.trim() || 'Không xác định',
        note: uploadData.note.trim()
      };

      const newSchedules = [newSchedule, ...schedules];
      saveSchedules(newSchedules);

      setUploadData({
        name: "",
        semester: "",
        note: "",
        file: null
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setIsUploadDialogOpen(false);
      
      // Show success toast
      toast.success("📅 Thời khóa biểu đã được tải lên!", {
        description: `"${newSchedule.name}" đã được thêm vào danh sách`,
        duration: 3000,
      });
    };

    reader.readAsDataURL(uploadData.file);
  };

  const deleteSchedule = (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return;
    
    if (confirm('Bạn có chắc chắn muốn xóa thời khóa biểu này?')) {
      const newSchedules = schedules.filter(schedule => schedule.id !== id);
      saveSchedules(newSchedules);
      toast.success("🗑️ Thời khóa biểu đã được xóa", {
        description: `"${schedule.name}" đã được xóa khỏi danh sách`,
        duration: 2000,
      });
    }
  };

  const viewSchedule = (schedule: ScheduleImage) => {
    setCurrentSchedule(schedule);
    setIsViewDialogOpen(true);
  };

  const downloadSchedule = (schedule: ScheduleImage) => {
    const link = document.createElement('a');
    link.href = schedule.imageUrl;
    link.download = `${schedule.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCurrentScheduleInfo = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    let timeOfDay = '';
    let sessionColor = '';
    
    if (currentHour >= 7 && currentHour < 12) {
      timeOfDay = 'Buổi sáng';
      sessionColor = 'bg-yellow-100 text-yellow-800';
    } else if (currentHour >= 12 && currentHour < 18) {
      timeOfDay = 'Buổi chiều';
      sessionColor = 'bg-orange-100 text-orange-800';
    } else {
      timeOfDay = 'Buổi tối';
      sessionColor = 'bg-blue-100 text-blue-800';
    }

    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const currentDayName = dayNames[currentDay];

    return { timeOfDay, sessionColor, currentDayName };
  };

  const { timeOfDay, sessionColor, currentDayName } = getCurrentScheduleInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          ← Quay lại
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Thời Khóa Biểu</h1>
          <p className="text-gray-600">Quản lý và xem thời khóa biểu học tập</p>
        </div>

        {/* Current Time Info */}
        <Card className="p-6 mb-8 border-2 border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-red-500" />
                <div>
                  <div className="font-semibold text-gray-800">{currentDayName}</div>
                  <div className="text-sm text-gray-600">
                    {new Date().toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-red-500" />
                <div>
                  <div className="font-semibold text-gray-800">
                    {new Date().toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className={`text-sm px-2 py-1 rounded-full ${sessionColor}`}>
                    {timeOfDay}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Tổng số thời khóa biểu</div>
              <div className="text-2xl font-bold text-red-600">{schedules.length}</div>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-medium text-gray-700">
            Danh sách thời khóa biểu
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload thời khóa biểu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Thời Khóa Biểu</DialogTitle>
                <DialogDescription>
                  Tải lên ảnh thời khóa biểu của bạn để quản lý dễ dàng
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên thời khóa biểu *
                  </label>
                  <Input
                    placeholder="VD: Học kỳ 1 - 2024, Thời khóa biểu tuần..."
                    value={uploadData.name}
                    onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Học kỳ/Giai đoạn
                  </label>
                  <Input
                    placeholder="VD: Học kỳ 1 - 2024, Kỳ thi cuối kỳ..."
                    value={uploadData.semester}
                    onChange={(e) => setUploadData({...uploadData, semester: e.target.value})}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <Input
                    placeholder="Ghi chú thêm về thời khóa biểu..."
                    value={uploadData.note}
                    onChange={(e) => setUploadData({...uploadData, note: e.target.value})}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn ảnh thời khóa biểu *
                  </label>
                  <div className="border-2 border-dashed border-red-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="schedule-upload"
                    />
                    <label
                      htmlFor="schedule-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-red-400" />
                      <span className="text-sm text-gray-600">
                        {uploadData.file ? uploadData.file.name : 'Click để chọn ảnh'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Hỗ trợ JPG, PNG (tối đa 10MB)
                      </span>
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={uploadSchedule}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Upload thời khóa biểu
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {schedules.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Chưa có thời khóa biểu nào
            </h3>
            <p className="text-gray-500 mb-6">
              Upload ảnh thời khóa biểu đầu tiên để bắt đầu
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="p-4 border-2 border-red-100 hover:border-red-300 transition-colors">
                <div className="aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={schedule.imageUrl}
                    alt={schedule.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => viewSchedule(schedule)}
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">
                    {schedule.name}
                  </h3>
                  
                  <div className="text-sm text-gray-600">
                    <div>{schedule.semester}</div>
                    <div className="text-xs text-gray-500">
                      {schedule.uploadDate.toLocaleDateString('vi-VN')}
                    </div>
                  </div>

                  {schedule.note && (
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {schedule.note}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => viewSchedule(schedule)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Xem
                    </Button>
                    <Button
                      onClick={() => downloadSchedule(schedule)}
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteSchedule(schedule.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* View Schedule Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{currentSchedule?.name}</DialogTitle>
              <DialogDescription>
                {currentSchedule?.semester} • {currentSchedule?.uploadDate.toLocaleDateString('vi-VN')}
              </DialogDescription>
            </DialogHeader>
            {currentSchedule && (
              <div className="space-y-4">
                <div className="max-h-[70vh] overflow-auto">
                  <img
                    src={currentSchedule.imageUrl}
                    alt={currentSchedule.name}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                
                {currentSchedule.note && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Ghi chú:</div>
                    <div className="text-sm text-gray-600">{currentSchedule.note}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => downloadSchedule(currentSchedule)}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải xuống
                  </Button>
                  <Button
                    onClick={() => setIsViewDialogOpen(false)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
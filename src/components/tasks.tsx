import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Plus, Edit, Trash2, Calendar as CalendarIcon, Bell } from "lucide-react";
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from "@capacitor/core";
import { PermissionsManager } from '../utils/permissions';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  subtasks: SubTask[];
  createdAt: Date;
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface TasksProps {
  onBack: () => void;
}

export function Tasks({ onBack }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    priority: "medium" as const,
    category: "",
    subtasks: [] as { title: string }[]
  });
  const sendNotification = async (title: string, body: string, at?: Date) => {
    const platform = Capacitor.getPlatform();
    if (platform === "web") {
      try {
        if (typeof Notification !== "undefined") {
          if (Notification.permission === "granted") {
            new Notification(title, { body });
          } else if (Notification.permission === "default") {
            await Notification.requestPermission();
          }
        }
      } catch (e) {
        console.warn("Web Notification failed:", e);
      }
    } else {
      try {
        await LocalNotifications.requestPermissions();
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Date.now(),
              title,
              body,
              schedule: at ? { at } : { at: new Date(Date.now() + 1000) },
            },
          ],
        });
      } catch (e) {
        console.warn("LocalNotifications.schedule failed:", e);
      }
    }
  };
   // ---------------------- Load & Save ----------------------  
  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('studyTasks');
    if (saved) {
      const parsed = JSON.parse(saved).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt)
      }));
      setTasks(parsed);
    } else {
      // Sample tasks
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Ôn tập Toán học - Chương 3',
          description: 'Ôn tập các bài tập về phương trình bậc 2',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          completed: false,
          priority: 'high',
          category: 'Toán học',
          subtasks: [
            { id: 's1', title: 'Đọc lý thuyết', completed: true },
            { id: 's2', title: 'Làm bài tập 1-10', completed: false },
            { id: 's3', title: 'Làm bài tập 11-20', completed: false }
          ],
          createdAt: new Date()
        },
        {
          id: '2',
          title: 'Nộp bài luận Văn học',
          description: 'Viết bài luận về tác phẩm "Tắt đèn"',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          completed: false,
          priority: 'medium',
          category: 'Ngữ văn',
          subtasks: [
            { id: 's4', title: 'Đọc tác phẩm', completed: true },
            { id: 's5', title: 'Lập dàn ý', completed: false },
            { id: 's6', title: 'Viết bài', completed: false }
          ],
          createdAt: new Date()
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem('studyTasks', JSON.stringify(sampleTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('studyTasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Check for due tasks and show notifications
  useEffect(() => {
    const checkDueTasks = async () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      for (const task of tasks) {
        if (!task.completed && task.dueDate) {
          const dueDate = new Date(task.dueDate);
          const hoursLeft = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

          if (dueDate <= tomorrow && dueDate >= now) {
            if (Capacitor.getPlatform() === "web") {
              // 🖥️ Web notification
              if (Notification.permission === "granted") {
                new Notification("Gấp gấp bạn ơi 🚨", {
                  body: `Hạn chót: ${dueDate.toLocaleDateString("vi-VN")} ${dueDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`,
                });
              }
            } else {
              // 📱 Android notification
              try {
                await LocalNotifications.requestPermissions();
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: "Gấp gấp bạn ơi 🚨",
                      body: `Hạn chót: ${dueDate.toLocaleDateString("vi-VN")} ${dueDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`,
                      id: new Date().getTime(),
                      schedule: { at: new Date(Date.now() + 1000) }, // hiện ngay
                    },
                  ],
                });
              } catch (e) {
                console.warn("LocalNotifications.schedule failed:", e);
              }
            }
          } else if (hoursLeft <= 4 && hoursLeft > 0) {
            if (Capacitor.getPlatform() === "web") {
              // 🖥️ Web notification
              if (Notification.permission === "granted") {
                new Notification("Sắp hết hạn ⏰", {
                  body: `Nhiệm vụ "${task.title}" chỉ còn ${Math.ceil(hoursLeft)} giờ nữa!`,
                });
              }
            } else {
              // 📱 Android notification
              try {
                await LocalNotifications.requestPermissions();
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: "Sắp hết hạn ⏰",
                      body: `Nhiệm vụ \"${task.title}\" chỉ còn ${Math.ceil(hoursLeft)} giờ nữa!`,
                      id: new Date().getTime(),
                      schedule: { at: new Date(Date.now() + 1000) }, // hiện ngay
                    },
                  ],
                });
              } catch (e) {
                console.warn("LocalNotifications.schedule failed:", e);
              }
            }
          }
        }
      }
    };
    LocalNotifications.schedule({
      notifications: [
        {
          title: "Hello  🚀",
          body: "Chào mừng bạn đến với phần ghi chú nhiệm vụ!",
          id: 1,
          schedule: { at: new Date(Date.now() + 3000) } // sau 3 giây
        }
      ]
    });
    // Request notification permission (web only)
    if (Capacitor.getPlatform() === 'web' && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check every hour
    const interval = setInterval(checkDueTasks, 60 * 60 * 1000);
    checkDueTasks(); // Initial check

    return () => clearInterval(interval);
  }, [tasks]);

  const createTask = async () => {
    if (!newTask.title.trim()) {
      alert('Vui lòng nhập tiêu đề nhiệm vụ!');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      dueDate: newTask.dueDate,
      completed: false,
      priority: newTask.priority,
      category: newTask.category.trim() || 'Chung',
      subtasks: newTask.subtasks.filter(st => st.title.trim()).map((st, index) => ({
        id: `${Date.now()}_${index}`,
        title: st.title.trim(),
        completed: false
      })),
      createdAt: new Date()
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: "",
      description: "",
      dueDate: new Date(),
      priority: "medium",
      category: "",
      subtasks: []
    });
    setIsCreateDialogOpen(false);
    // 🔔 Thông báo ngay khi tạo
    await sendNotification("Đã tạo nhiệm vụ thành công ✅", `Nhiệm vụ: ${task.title}`);

    // 🔔 Đặt lịch nhắc trước hạn chót 3 giờ
    const reminderTime = new Date(task.dueDate.getTime() - 3*60 * 60 * 1000);
    if (reminderTime > new Date()) {
      await sendNotification("Sắp đến hạn ⏰", `Nhiệm vụ "${task.title}" còn 3 giờ nữa!`, reminderTime);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? {
              ...task,
              subtasks: task.subtasks.map(st => 
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              )
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const addSubtask = () => {
    setNewTask(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, { title: "" }]
    }));
  };

  const updateSubtask = (index: number, title: string) => {
    setNewTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((st, i) => 
        i === index ? { title } : st
      )
    }));
  };

  const removeSubtask = (index: number) => {
    setNewTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return 'Trung bình';
    }
  };

  const isOverdue = (date: Date) => date < new Date() && date.toDateString() !== new Date().toDateString();
  const isDueSoon = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date <= tomorrow && date >= new Date();
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    if (isOverdue(a.dueDate) && !isOverdue(b.dueDate)) return -1;
    if (!isOverdue(a.dueDate) && isOverdue(b.dueDate)) return 1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

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
          <h1 className="text-4xl font-bold text-red-600 mb-2">Quản Lý Nhiệm Vụ</h1>
          <p className="text-gray-600">Theo dõi và quản lý các nhiệm vụ học tập</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-medium text-gray-700">
            Tổng số nhiệm vụ: {tasks.length} ({tasks.filter(t => !t.completed).length} chưa hoàn thành)
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Tạo nhiệm vụ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo Nhiệm Vụ Mới</DialogTitle>
                <DialogDescription>
                  Tạo nhiệm vụ mới và thiết lập thông báo nhắc nhở
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề nhiệm vụ *
                    </label>
                    <Input
                      placeholder="VD: Ôn tập Toán học..."
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <Input
                      placeholder="VD: Toán học, Văn học..."
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <Textarea
                    placeholder="Mô tả chi tiết về nhiệm vụ..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={3}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hạn chót
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal border-red-200">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTask.dueDate.toLocaleDateString('vi-VN')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newTask.dueDate}
                          onSelect={(date: Date | undefined) => date && setNewTask({...newTask, dueDate: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mức độ ưu tiên
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                      className="w-full p-2 border border-red-200 rounded-md focus:border-red-400 focus:outline-none"
                    >
                      <option value="low">Thấp</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Cao</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nhiệm vụ con
                    </label>
                    <Button type="button" onClick={addSubtask} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newTask.subtasks.map((subtask, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Nhiệm vụ con..."
                          value={subtask.title}
                          onChange={(e) => updateSubtask(index, e.target.value)}
                          className="flex-1 border-red-200 focus:border-red-400"
                        />
                        <Button 
                          type="button"
                          onClick={() => removeSubtask(index)}
                          size="sm"
                          variant="outline"
                          className="px-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={createTask}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Tạo nhiệm vụ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Chưa có nhiệm vụ nào
            </h3>
            <p className="text-gray-500 mb-6">
              Tạo nhiệm vụ đầu tiên để bắt đầu quản lý học tập
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <Card key={task.id} className={`p-6 border-2 transition-colors ${
                task.completed 
                  ? 'border-green-200 bg-green-50' 
                  : isOverdue(task.dueDate)
                    ? 'border-red-300 bg-red-50'
                    : isDueSoon(task.dueDate)
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-red-100 hover:border-red-300'
              }`}>
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mb-2 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => deleteTask(task.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                      <Badge variant="outline" className="text-gray-600">
                        {task.category}
                      </Badge>
                      <div className={`flex items-center gap-1 text-sm ${
                        isOverdue(task.dueDate) ? 'text-red-600' : 
                        isDueSoon(task.dueDate) ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        <CalendarIcon className="w-4 h-4" />
                        {task.dueDate.toLocaleDateString('vi-VN')}
                        {isOverdue(task.dueDate) && <span className="font-medium">(Quá hạn)</span>}
                        {isDueSoon(task.dueDate) && !isOverdue(task.dueDate) && <span className="font-medium">(Sắp đến hạn)</span>}
                      </div>
                    </div>

                    {task.subtasks.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">
                          Nhiệm vụ con ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}):
                        </div>
                        {task.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-center gap-2 ml-4">
                            <Checkbox
                              checked={subtask.completed}
                              onCheckedChange={() => toggleSubtask(task.id, subtask.id)}
                              size="sm"
                            />
                            <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
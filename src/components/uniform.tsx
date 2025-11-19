import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Trash2, Shirt, Sun, Moon, Edit } from "lucide-react";
import { toast } from "sonner";

interface UniformRule {
  id: string;
  name: string;
  dayOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  session: 'morning' | 'afternoon' | 'both';
  description: string;
  color: string;
  enabled: boolean;
  createdAt: Date;
}

interface UniformProps {
  onBack: () => void;
}

export function Uniform({ onBack }: UniformProps) {
  const [rules, setRules] = useState<UniformRule[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<UniformRule | null>(null);
  const [currentNotification, setCurrentNotification] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({
    name: "",
    dayOfWeek: [] as number[],
    session: "both" as const,
    description: "",
    color: "#ef4444"
  });
  const [editRule, setEditRule] = useState({
    name: "",
    dayOfWeek: [] as number[],
    session: "both" as const,
    description: "",
    color: "#ef4444"
  });

  const weekDays = [
    { value: 1, label: 'Thứ 2', short: 'T2' },
    { value: 2, label: 'Thứ 3', short: 'T3' },
    { value: 3, label: 'Thứ 4', short: 'T4' },
    { value: 4, label: 'Thứ 5', short: 'T5' },
    { value: 5, label: 'Thứ 6', short: 'T6' },
    { value: 6, label: 'Thứ 7', short: 'T7' },
    { value: 0, label: 'Chủ nhật', short: 'CN' }
  ];

  const uniformColors = [
    { value: '#ef4444', name: 'Đỏ' },
    { value: '#3b82f6', name: 'Xanh dương' },
    { value: '#10b981', name: 'Xanh lá' },
    { value: '#f59e0b', name: 'Vàng' },
    { value: '#8b5cf6', name: 'Tím' },
    { value: '#ec4899', name: 'Hồng' },
    { value: '#6b7280', name: 'Xám' },
    { value: '#1f2937', name: 'Đen' }
  ];

  // Load rules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('uniformRules');
    if (saved) {
      const parsed = JSON.parse(saved).map((rule: any) => ({
        ...rule,
        createdAt: new Date(rule.createdAt)
      }));
      setRules(parsed);
    } else {
      // Sample rules
      const sampleRules: UniformRule[] = [
        {
          id: '1',
          name: 'Áo đồng phục trường',
          dayOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
          session: 'both',
          description: 'Áo trắng cổ tàu, logo trường ở ngực trái',
          color: '#3b82f6',
          enabled: true,
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'Áo đoàn Thanh niên',
          dayOfWeek: [1], // Monday only
          session: 'morning',
          description: 'Áo xanh đoàn, thắt khăn quàng đỏ',
          color: '#10b981',
          enabled: true,
          createdAt: new Date()
        },
        {
          id: '3',
          name: 'Áo thể dục',
          dayOfWeek: [3, 5], // Wednesday and Friday
          session: 'afternoon',
          description: 'Áo thể dục trường, quần thể dục, giày thể thao',
          color: '#f59e0b',
          enabled: true,
          createdAt: new Date()
        }
      ];
      setRules(sampleRules);
      localStorage.setItem('uniformRules', JSON.stringify(sampleRules));
    }
  }, []);

  // Save rules to localStorage
  useEffect(() => {
    if (rules.length > 0) {
      localStorage.setItem('uniformRules', JSON.stringify(rules));
    }
  }, [rules]);

  // Check for uniform reminders
  useEffect(() => {
    const checkUniformReminders = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentHour = now.getHours();
      
      // Morning reminder (6:30 AM)
      const isMorningReminderTime = currentHour === 6 && now.getMinutes() === 30;
      // Afternoon reminder (12:00 PM)
      const isAfternoonReminderTime = currentHour === 12 && now.getMinutes() === 0;

      rules.forEach(rule => {
        if (!rule.enabled || !rule.dayOfWeek.includes(currentDay)) return;

        let shouldNotify = false;
        let session = '';

        if (isMorningReminderTime && (rule.session === 'morning' || rule.session === 'both')) {
          shouldNotify = true;
          session = 'buổi sáng';
        } else if (isAfternoonReminderTime && (rule.session === 'afternoon' || rule.session === 'both')) {
          shouldNotify = true;
          session = 'buổi chiều';
        }

        if (shouldNotify) {
          showUniformNotification(rule, session);
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkUniformReminders, 60000);
    checkUniformReminders(); // Initial check

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => clearInterval(interval);
  }, [rules]);

  const showUniformNotification = (rule: UniformRule, session: string) => {
    const message = `Nhắc nhở: ${rule.name} - ${session}`;
    setCurrentNotification(message);

    if (Notification.permission === 'granted') {
      new Notification(`👔 ${rule.name}`, {
        body: `Hôm nay ${session} cần mặc: ${rule.description}`,
        icon: '/uniform-icon.png'
      });
    }

    // Auto dismiss after 10 seconds
    setTimeout(() => {
      setCurrentNotification(null);
    }, 10000);
  };

  const createRule = () => {
    if (!newRule.name.trim()) {
      alert('Vui lòng nhập tên đồng phục!');
      return;
    }

    if (newRule.dayOfWeek.length === 0) {
      alert('Vui lòng chọn ít nhất một ngày!');
      return;
    }

    const rule: UniformRule = {
      id: Date.now().toString(),
      name: newRule.name.trim(),
      dayOfWeek: [...newRule.dayOfWeek],
      session: newRule.session,
      description: newRule.description.trim(),
      color: newRule.color,
      enabled: true,
      createdAt: new Date()
    };

    setRules(prev => [rule, ...prev]);
    setNewRule({
      name: "",
      dayOfWeek: [],
      session: "both",
      description: "",
      color: "#ef4444"
    });
    setIsCreateDialogOpen(false);
    
    // Show success toast
    toast.success("👔 Quy tắc đồng phục đã được tạo!", {
      description: `Quy tắc "${rule.name}" đã được thêm vào danh sách`,
      duration: 3000,
    });
  };

  const toggleRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    
    setRules(prev => 
      prev.map(rule => 
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    
    // Show toast notification
    if (!rule.enabled) {
      toast.success("✅ Quy tắc đã được bật!", {
        description: `"${rule.name}" đã được kích hoạt`,
        duration: 2000,
      });
    } else {
      toast.info("🔕 Quy tắc đã được tắt", {
        description: `"${rule.name}" đã được vô hiệu hóa`,
        duration: 2000,
      });
    }
  };

  const deleteRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    
    if (confirm('Bạn có chắc chắn muốn xóa quy tắc này?')) {
      setRules(prev => prev.filter(rule => rule.id !== id));
      toast.success("🗑️ Quy tắc đã được xóa", {
        description: `"${rule.name}" đã được xóa khỏi danh sách`,
        duration: 2000,
      });
    }
  };

  const openEditDialog = (rule: UniformRule) => {
    setEditingRule(rule);
    setEditRule({
      name: rule.name,
      dayOfWeek: [...rule.dayOfWeek],
      session: rule.session,
      description: rule.description,
      color: rule.color
    });
    setIsEditDialogOpen(true);
  };

  const updateRule = () => {
    if (!editRule.name.trim()) {
      alert('Vui lòng nhập tên đồng phục!');
      return;
    }

    if (editRule.dayOfWeek.length === 0) {
      alert('Vui lòng chọn ít nhất một ngày!');
      return;
    }

    if (!editingRule) return;

    setRules(prev => 
      prev.map(rule => 
        rule.id === editingRule.id 
          ? {
              ...rule,
              name: editRule.name.trim(),
              dayOfWeek: [...editRule.dayOfWeek],
              session: editRule.session,
              description: editRule.description.trim(),
              color: editRule.color
            }
          : rule
      )
    );
    
    setIsEditDialogOpen(false);
    setEditingRule(null);
    
    // Show success toast
    toast.success("✏️ Quy tắc đã được cập nhật!", {
      description: `"${editRule.name}" đã được chỉnh sửa thành công`,
      duration: 3000,
    });
  };

  const toggleEditDay = (day: number) => {
    setEditRule(prev => ({
      ...prev,
      dayOfWeek: prev.dayOfWeek.includes(day) 
        ? prev.dayOfWeek.filter(d => d !== day)
        : [...prev.dayOfWeek, day]
    }));
  };

  const toggleDay = (day: number) => {
    setNewRule(prev => ({
      ...prev,
      dayOfWeek: prev.dayOfWeek.includes(day) 
        ? prev.dayOfWeek.filter(d => d !== day)
        : [...prev.dayOfWeek, day]
    }));
  };

  const getSessionLabel = (session: string) => {
    switch (session) {
      case 'morning': return 'Buổi sáng';
      case 'afternoon': return 'Buổi chiều';
      case 'both': return 'Cả ngày';
      default: return 'Cả ngày';
    }
  };

  const getSessionIcon = (session: string) => {
    switch (session) {
      case 'morning': return Sun;
      case 'afternoon': return Moon;
      case 'both': return Shirt;
      default: return Shirt;
    }
  };

  const getTodayRules = () => {
    const today = new Date().getDay();
    const currentHour = new Date().getHours();
    const isMorning = currentHour < 12;
    
    return rules.filter(rule => 
      rule.enabled && 
      rule.dayOfWeek.includes(today) &&
      (rule.session === 'both' || 
       (rule.session === 'morning' && isMorning) ||
       (rule.session === 'afternoon' && !isMorning))
    );
  };

  const todayRules = getTodayRules();
  const currentDayName = weekDays.find(day => day.value === new Date().getDay())?.label || 'Hôm nay';

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
          <h1 className="text-4xl font-bold text-red-600 mb-2">Nhắc Nhở Đồng Phục</h1>
          <p className="text-gray-600">Quản lý và nhắc nhở mặc đồng phục theo ngày</p>
        </div>

        {/* Today's Uniform */}
        {todayRules.length > 0 && (
          <Card className="p-6 mb-8 border-2 border-red-200 bg-red-50">
            <div className="flex items-center gap-3 mb-4">
              <Shirt className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-red-700">
                Đồng phục hôm nay ({currentDayName})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayRules.map(rule => {
                const SessionIcon = getSessionIcon(rule.session);
                return (
                  <div 
                    key={rule.id}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border"
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: rule.color }}
                    />
                    <SessionIcon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{rule.name}</div>
                      <div className="text-sm text-gray-600">{rule.description}</div>
                      <div className="text-xs text-gray-500">{getSessionLabel(rule.session)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-medium text-gray-700">
            Quy tắc đồng phục ({rules.filter(r => r.enabled).length} đang hoạt động)
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Thêm quy tắc mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm Quy Tắc Đồng Phục</DialogTitle>
                <DialogDescription>
                  Tạo quy tắc nhắc nhở mặc đồng phục theo ngày và buổi
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đồng phục *
                  </label>
                  <Input
                    placeholder="VD: Áo đồng phục trường, Áo đoàn..."
                    value={newRule.name}
                    onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <Input
                    placeholder="VD: Áo trắng cổ tàu, logo trường..."
                    value={newRule.description}
                    onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày áp dụng *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => (
                      <Button
                        key={day.value}
                        type="button"
                        size="sm"
                        variant={newRule.dayOfWeek.includes(day.value) ? "default" : "outline"}
                        onClick={() => toggleDay(day.value)}
                        className={newRule.dayOfWeek.includes(day.value) ? "bg-red-500 hover:bg-red-600" : "border-red-300 text-red-600 hover:bg-red-50"}
                      >
                        {day.short}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buổi áp dụng
                  </label>
                  <Select value={newRule.session} onValueChange={(value: any) => setNewRule({...newRule, session: value})}>
                    <SelectTrigger className="border-red-200 focus:border-red-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Cả ngày</SelectItem>
                      <SelectItem value="morning">Buổi sáng</SelectItem>
                      <SelectItem value="afternoon">Buổi chiều</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu nhận diện
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniformColors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewRule({...newRule, color: color.value})}
                        className={`w-8 h-8 rounded-full border-2 ${newRule.color === color.value ? 'border-gray-600 scale-110' : 'border-gray-300'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={createRule}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Tạo quy tắc
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Chỉnh Sửa Quy Tắc Đồng Phục</DialogTitle>
                <DialogDescription>
                  Cập nhật thông tin quy tắc nhắc nhở đồng phục
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đồng phục *
                  </label>
                  <Input
                    placeholder="VD: Áo đồng phục trường, Áo đoàn..."
                    value={editRule.name}
                    onChange={(e) => setEditRule({...editRule, name: e.target.value})}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <Input
                    placeholder="VD: Áo trắng cổ tàu, logo trường..."
                    value={editRule.description}
                    onChange={(e) => setEditRule({...editRule, description: e.target.value})}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày áp dụng *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => (
                      <Button
                        key={day.value}
                        type="button"
                        size="sm"
                        variant={editRule.dayOfWeek.includes(day.value) ? "default" : "outline"}
                        onClick={() => toggleEditDay(day.value)}
                        className={editRule.dayOfWeek.includes(day.value) ? "bg-red-500 hover:bg-red-600" : "border-red-300 text-red-600 hover:bg-red-50"}
                      >
                        {day.short}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buổi áp dụng
                  </label>
                  <Select value={editRule.session} onValueChange={(value: any) => setEditRule({...editRule, session: value})}>
                    <SelectTrigger className="border-red-200 focus:border-red-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Cả ngày</SelectItem>
                      <SelectItem value="morning">Buổi sáng</SelectItem>
                      <SelectItem value="afternoon">Buổi chiều</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu nhận diện
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniformColors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEditRule({...editRule, color: color.value})}
                        className={`w-8 h-8 rounded-full border-2 ${editRule.color === color.value ? 'border-gray-600 scale-110' : 'border-gray-300'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={updateRule}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Cập nhật quy tắc
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {rules.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👔</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Chưa có quy tắc nào
            </h3>
            <p className="text-gray-500 mb-6">
              Thêm quy tắc đầu tiên để nhắc nhở mặc đồng phục
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => {
              const SessionIcon = getSessionIcon(rule.session);
              return (
                <Card key={rule.id} className={`p-6 border-2 transition-colors ${
                  rule.enabled ? 'border-red-200 hover:border-red-300' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: rule.color }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${rule.enabled ? 'text-gray-800' : 'text-gray-500'}`}>
                            {rule.name}
                          </h3>
                          <SessionIcon className={`w-4 h-4 ${rule.enabled ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>
                        
                        {rule.description && (
                          <div className={`text-sm mb-2 ${rule.enabled ? 'text-gray-600' : 'text-gray-400'}`}>
                            {rule.description}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {rule.dayOfWeek.map(dayValue => {
                            const day = weekDays.find(d => d.value === dayValue);
                            return (
                              <Badge key={dayValue} variant="secondary" className="text-xs">
                                {day?.short}
                              </Badge>
                            );
                          })}
                          <Badge variant="outline" className="text-xs">
                            {getSessionLabel(rule.session)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                      <Button
                        onClick={() => openEditDialog(rule)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteRule(rule.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Current Notification */}
        {currentNotification && (
          <div className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-lg shadow-lg animate-bounce max-w-sm">
            <div className="flex items-center gap-2">
              <Shirt className="w-5 h-5" />
              <span className="font-medium">{currentNotification}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
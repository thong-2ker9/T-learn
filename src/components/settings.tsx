import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Save, Key } from "lucide-react";

interface SettingsProps {
  onBack: () => void;
}

interface ApiSettings {
  homeworkSolverApi: string;
  chatSupportApi: string;
  studyAssistantApi: string;
  apiInstructions: string;
}

export function Settings({ onBack }: SettingsProps) {
  const [settings, setSettings] = useState<ApiSettings>({
    homeworkSolverApi: localStorage.getItem('homeworkSolverApi') || '',
    chatSupportApi: localStorage.getItem('chatSupportApi') || '',
    studyAssistantApi: localStorage.getItem('studyAssistantApi') || '',
    apiInstructions: localStorage.getItem('apiInstructions') || ''
  });

  const handleSave = () => {
    localStorage.setItem('homeworkSolverApi', settings.homeworkSolverApi);
    localStorage.setItem('chatSupportApi', settings.chatSupportApi);
    localStorage.setItem('studyAssistantApi', settings.studyAssistantApi);
    localStorage.setItem('apiInstructions', settings.apiInstructions);
    
    alert('Đã lưu cài đặt thành công!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          ← Quay lại
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Cài Đặt API</h1>
          <p className="text-gray-600">Cấu hình API AI của bạn để sử dụng các tính năng</p>
        </div>

        <Card className="p-8 border-2 border-red-100">
          <div className="grid gap-8">
            {/* Homework Solver API */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-red-500" />
                <Label className="text-lg font-semibold text-red-600">
                  API Giải Bài Tập
                </Label>
              </div>
              <Input
                placeholder="Nhập API key cho tính năng giải bài tập..."
                value={settings.homeworkSolverApi}
                onChange={(e) => setSettings({...settings, homeworkSolverApi: e.target.value})}
                type="password"
                className="border-red-200 focus:border-red-400"
              />
              <p className="text-sm text-gray-600">
                API này sẽ được sử dụng để giải các bài tập toán học, vật lý, hóa học và các môn học khác.
              </p>
            </div>

            {/* Chat Support API */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-red-500" />
                <Label className="text-lg font-semibold text-red-600">
                  API Hỗ Trợ Tâm Lý
                </Label>
              </div>
              <Input
                placeholder="Nhập API key cho tính năng hỗ trợ tâm lý..."
                value={settings.chatSupportApi}
                onChange={(e) => setSettings({...settings, chatSupportApi: e.target.value})}
                type="password"
                className="border-red-200 focus:border-red-400"
              />
              <p className="text-sm text-gray-600">
                API này sẽ được sử dụng cho tính năng trò chuyện và hỗ trợ tâm lý học đường.
              </p>
            </div>

            {/* Study Assistant API */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-red-500" />
                <Label className="text-lg font-semibold text-red-600">
                  API Trợ Lý Học Tập
                </Label>
              </div>
              <Input
                placeholder="Nhập API key cho trợ lý học tập..."
                value={settings.studyAssistantApi}
                onChange={(e) => setSettings({...settings, studyAssistantApi: e.target.value})}
                type="password"
                className="border-red-200 focus:border-red-400"
              />
              <p className="text-sm text-gray-600">
                API này sẽ được sử dụng để phân tích video, PDF và tạo bài học từ tài liệu của bạn.
              </p>
            </div>

            {/* API Instructions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-red-500" />
                <Label className="text-lg font-semibold text-red-600">
                  Hướng Dẫn API
                </Label>
              </div>
              <Textarea
                placeholder="Nhập hướng dẫn sử dụng API của bạn hoặc prompt đặc biệt..."
                value={settings.apiInstructions}
                onChange={(e) => setSettings({...settings, apiInstructions: e.target.value})}
                rows={6}
                className="border-red-200 focus:border-red-400"
              />
              <p className="text-sm text-gray-600">
                Các hướng dẫn này sẽ được gửi kèm với mỗi yêu cầu API để tối ưu hóa kết quả.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-semibold text-red-700 mb-3">Hướng dẫn cấu hình:</h3>
              <ul className="space-y-2 text-sm text-red-600">
                <li>• Sử dụng API keys từ OpenAI, Anthropic, Cohere hoặc các nhà cung cấp AI khác</li>
                <li>• Mỗi tính năng có thể sử dụng API key khác nhau để tối ưu chi phí</li>
                <li>• API keys sẽ được lưu trữ an toàn trong trình duyệt của bạn</li>
                <li>• Bạn có thể cập nhật API keys bất kỳ lúc nào</li>
              </ul>
            </div>

            <Button 
              onClick={handleSave}
              className="bg-red-500 hover:bg-red-600 text-white w-full py-3"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Lưu Cài Đặt
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
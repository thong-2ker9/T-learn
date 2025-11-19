import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Star,
  StarOff,
  Trash2,
  Calendar,
  Search,
  Download,
  Eye,
  MoreVertical
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface StorageProps {
  onBack: () => void;
}

interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  importance: 'low' | 'medium' | 'high';
  description?: string;
  tags: string[];
  fileContent?: string;
}

export function Storage({ onBack }: StorageProps) {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterImportance, setFilterImportance] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('storage_files');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFiles(parsed);
      } catch (error) {
        console.error('Error loading files:', error);
      }
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem('storage_files', JSON.stringify(files));
    }
  }, [files]);

  // Form states
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState("");

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-6 h-6" />;
    if (type.includes('video')) return <Video className="w-6 h-6" />;
    if (type.includes('audio')) return <Music className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'high': return 'Quan trọng';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return 'Không xác định';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: StoredFile = {
          id: Date.now().toString(),
          name: fileName || file.name,
          type: file.type,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          uploadDate: new Date().toISOString(),
          importance,
          description,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          fileContent: e.target?.result as string
        };
        
        setFiles(prev => [newFile, ...prev]);
        
        // Reset form
        setFileName("");
        setDescription("");
        setImportance('medium');
        setTags("");
        setIsUploadOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteFile = (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
  };

  const toggleImportance = (id: string) => {
    const updatedFiles = files.map(file => {
      if (file.id === id) {
        const levels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
        const currentIndex = levels.indexOf(file.importance);
        const nextIndex = (currentIndex + 1) % levels.length;
        return { ...file, importance: levels[nextIndex] };
      }
      return file;
    });
    setFiles(updatedFiles);
  };



  // Filter and sort files
  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesImportance = filterImportance === 'all' || file.importance === filterImportance;
      return matchesSearch && matchesImportance;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'importance') {
        const importanceOrder = { high: 3, medium: 2, low: 1 };
        return importanceOrder[b.importance] - importanceOrder[a.importance];
      }
      return 0;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
        >
          ← Quay lại
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-600 mb-2">Lưu trữ tài liệu</h1>
          <p className="text-cyan-500">Quản lý và tổ chức tất cả tài liệu học tập của bạn</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterImportance} onValueChange={setFilterImportance}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Mức độ quan trọng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="high">Quan trọng</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="low">Thấp</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Ngày tải lên</SelectItem>
              <SelectItem value="name">Tên file</SelectItem>
              <SelectItem value="importance">Mức độ quan trọng</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                <Upload className="w-4 h-4 mr-2" />
                Tải lên
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5 text-cyan-500" />
                  Tải lên tài liệu mới
                </DialogTitle>
                <DialogDescription>
                  Thêm tài liệu học tập mới vào kho lưu trữ của bạn
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file-name">Tên tài liệu</Label>
                  <Input
                    id="file-name"
                    placeholder="Nhập tên tài liệu..."
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả (tùy chọn)</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn về tài liệu..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="importance">Mức độ quan trọng</Label>
                  <Select value={importance} onValueChange={(value: 'low' | 'medium' | 'high') => setImportance(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Quan trọng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (phân tách bằng dấu phẩy)</Label>
                  <Input
                    id="tags"
                    placeholder="toán học, bài tập, chương 1..."
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chọn file</Label>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn file từ thiết bị
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="*/*"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Files Grid */}
        {filteredFiles.length === 0 ? (
          <Card className="p-12 text-center">
            <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">Chưa có tài liệu nào</h3>
            <p className="text-gray-400 mb-6">Hãy tải lên tài liệu đầu tiên của bạn</p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              Tải lên ngay
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                      <p className="text-sm text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => toggleImportance(file.id)}>
                        <Star className="w-4 h-4 mr-2" />
                        Thay đổi mức độ quan trọng
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteFile(file.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Badge className={`mb-3 ${getImportanceColor(file.importance)}`}>
                  {getImportanceText(file.importance)}
                </Badge>

                {file.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{file.description}</p>
                )}

                {file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {file.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {file.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{file.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(file.uploadDate)}
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
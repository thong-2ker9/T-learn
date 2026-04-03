import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { 
  Plus, 
  Search,
  Edit3,
  Trash2,
  StickyNote,
  Calendar,
  MoreVertical,
  Share,
  Pin,
  PinOff,
  Hash
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface NotesProps {
  onBack: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  color: string;
}

const NOTE_COLORS = [
  { name: 'Vàng', value: 'bg-yellow-100 border-yellow-200', text: 'text-yellow-800' },
  { name: 'Hồng', value: 'bg-pink-100 border-pink-200', text: 'text-pink-800' },
  { name: 'Xanh lá', value: 'bg-green-100 border-green-200', text: 'text-green-800' },
  { name: 'Xanh dương', value: 'bg-blue-100 border-blue-200', text: 'text-blue-800' },
  { name: 'Tím', value: 'bg-purple-100 border-purple-200', text: 'text-purple-800' },
  { name: 'Cam', value: 'bg-orange-100 border-orange-200', text: 'text-orange-800' },
  { name: 'Trắng', value: 'bg-white border-gray-200', text: 'text-gray-800' }
];

export function Notes({ onBack }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editColor, setEditColor] = useState(NOTE_COLORS[0].value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('userNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('userNotes', JSON.stringify(newNotes));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      color: NOTE_COLORS[0].value
    };
    
    setSelectedNote(newNote);
    setEditTitle("");
    setEditContent("");
    setEditColor(NOTE_COLORS[0].value);
    setIsEditing(true);
  };

  const editNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditColor(note.color);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNote) return;

    const title = editTitle.trim() || getPreviewText(editContent) || "Ghi chú mới";
    const updatedNote: Note = {
      ...selectedNote,
      title,
      content: editContent,
      updatedAt: new Date().toISOString(),
      color: editColor
    };

    let updatedNotes;
    if (notes.find(n => n.id === selectedNote.id)) {
      // Update existing note
      updatedNotes = notes.map(n => n.id === selectedNote.id ? updatedNote : n);
    } else {
      // Add new note
      updatedNotes = [updatedNote, ...notes];
    }

    saveNotes(updatedNotes);
    setIsEditing(false);
    setSelectedNote(null);
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    saveNotes(updatedNotes);
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const togglePin = (noteId: string) => {
    const updatedNotes = notes.map(n => 
      n.id === noteId ? { ...n, isPinned: !n.isPinned } : n
    );
    saveNotes(updatedNotes);
  };

  const getPreviewText = (content: string) => {
    return content.split('\n')[0].substring(0, 30);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Pinned notes first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by update time
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editContent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto p-6">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
        >
          ← Quay lại
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-600 mb-2">Ghi chú</h1>
          <p className="text-amber-500">Ghi chú nhanh chóng như trên iPhone</p>
        </div>

        {/* Search and New Note */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm ghi chú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-amber-200 focus:border-amber-400"
              />
            </div>
          </div>
          
          <Button 
            onClick={createNewNote}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ghi chú mới
          </Button>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <Card className="p-12 text-center bg-white border-amber-200">
            <StickyNote className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">Chưa có ghi chú nào</h3>
            <p className="text-gray-400 mb-6">Tạo ghi chú đầu tiên của bạn</p>
            <Button 
              onClick={createNewNote}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo ghi chú
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note) => {
              const colorClass = NOTE_COLORS.find(c => c.value === note.color);
              return (
                <Card 
                  key={note.id} 
                  className={`p-4 cursor-pointer hover:shadow-lg transition-all duration-200 ${note.color} border-2 relative group`}
                  onClick={() => editNote(note)}
                >
                  {note.isPinned && (
                    <Pin className="absolute top-2 right-2 w-4 h-4 text-gray-500" />
                  )}
                  
                  <div className="mb-3">
                    <h3 className={`font-medium ${colorClass?.text || 'text-gray-800'} mb-1 line-clamp-2`}>
                      {note.title || getPreviewText(note.content) || "Ghi chú mới"}
                    </h3>
                    <p className={`text-sm ${colorClass?.text || 'text-gray-600'} opacity-70 line-clamp-4`}>
                      {note.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs opacity-60">
                      <Calendar className="w-3 h-3" />
                      {formatDate(note.updatedAt)}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger 
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => togglePin(note.id)}>
                          {note.isPinned ? (
                            <>
                              <PinOff className="w-4 h-4 mr-2" />
                              Bỏ ghim
                            </>
                          ) : (
                            <>
                              <Pin className="w-4 h-4 mr-2" />
                              Ghim
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteNote(note.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Edit Note Modal */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                {selectedNote?.title || "Ghi chú mới"}
              </DialogTitle>
              <DialogDescription>
                Tạo hoặc chỉnh sửa ghi chú của bạn với nhiều màu sắc và tùy chọn khác nhau.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 flex flex-col gap-4">
              <Input
                placeholder="Tiêu đề ghi chú (tùy chọn)..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border-amber-200 focus:border-amber-400"
              />

              <div className="flex gap-2 flex-wrap">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setEditColor(color.value)}
                    className={`w-6 h-6 rounded-full border-2 ${color.value} ${
                      editColor === color.value ? 'ring-2 ring-amber-400' : ''
                    }`}
                    title={color.name}
                  />
                ))}
              </div>

              <Textarea
                ref={textareaRef}
                placeholder="Nhập nội dung ghi chú..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className={`flex-1 resize-none border-amber-200 focus:border-amber-400 ${editColor} min-h-[300px]`}
                style={{ minHeight: '300px' }}
              />

              <div className="flex gap-3">
                <Button 
                  onClick={saveNote}
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                >
                  Lưu ghi chú
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="border-amber-300 text-amber-600 hover:bg-amber-50"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
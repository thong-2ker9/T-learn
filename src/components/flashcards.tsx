import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Plus, Edit, Trash2, RotateCcw, Eye, EyeOff } from "lucide-react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  createdAt: Date;
  reviewCount: number;
}

interface FlashcardsProps {
  onBack: () => void;
}

export function Flashcards({ onBack }: FlashcardsProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newCard, setNewCard] = useState({
    front: "",
    back: "",
    category: ""
  });

  // Load flashcards from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('flashcards');
    if (saved) {
      const parsed = JSON.parse(saved).map((card: any) => ({
        ...card,
        createdAt: new Date(card.createdAt)
      }));
      setFlashcards(parsed);
    } else {
      // Sample flashcards
      const sampleCards: Flashcard[] = [
        {
          id: '1',
          front: 'Công thức tính diện tích hình tròn?',
          back: 'S = π × r²\n\nTrong đó:\n- S: diện tích\n- π ≈ 3.14\n- r: bán kính',
          category: 'Toán học',
          createdAt: new Date(),
          reviewCount: 0
        },
        {
          id: '2',
          front: 'Định luật Ohm là gì?',
          back: 'V = I × R\n\nTrong đó:\n- V: điện áp (Volt)\n- I: cường độ dòng điện (Ampere)\n- R: điện trở (Ohm)',
          category: 'Vật lý',
          createdAt: new Date(),
          reviewCount: 0
        },
        {
          id: '3',
          front: 'Công thức hóa học của nước?',
          back: 'H₂O\n\n- 2 nguyên tử Hydro (H)\n- 1 nguyên tử Oxy (O)',
          category: 'Hóa học',
          createdAt: new Date(),
          reviewCount: 0
        }
      ];
      setFlashcards(sampleCards);
      localStorage.setItem('flashcards', JSON.stringify(sampleCards));
    }
  }, []);

  // Save flashcards to localStorage
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }
  }, [flashcards]);

  const createCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) {
      alert('Vui lòng điền đầy đủ câu hỏi và câu trả lời!');
      return;
    }

    const card: Flashcard = {
      id: Date.now().toString(),
      front: newCard.front.trim(),
      back: newCard.back.trim(),
      category: newCard.category.trim() || 'Chung',
      createdAt: new Date(),
      reviewCount: 0
    };

    setFlashcards(prev => [card, ...prev]);
    setNewCard({ front: "", back: "", category: "" });
    setIsCreateDialogOpen(false);
  };

  const deleteCard = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
      setFlashcards(prev => prev.filter(card => card.id !== id));
      if (currentCard?.id === id) {
        setCurrentCard(null);
        setCurrentIndex(0);
        setShowAnswer(false);
      }
    }
  };

  const startStudy = () => {
    if (flashcards.length === 0) {
      alert('Chưa có thẻ nào để học!');
      return;
    }
    setIsStudyMode(true);
    setCurrentIndex(0);
    setCurrentCard(flashcards[0]);
    setShowAnswer(false);
  };

  const nextCard = () => {
    if (currentCard) {
      // Update review count
      setFlashcards(prev => 
        prev.map(card => 
          card.id === currentCard.id 
            ? { ...card, reviewCount: card.reviewCount + 1 }
            : card
        )
      );
    }

    const nextIndex = (currentIndex + 1) % flashcards.length;
    setCurrentIndex(nextIndex);
    setCurrentCard(flashcards[nextIndex]);
    setShowAnswer(false);
  };

  const prevCard = () => {
    const prevIndex = currentIndex === 0 ? flashcards.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentCard(flashcards[prevIndex]);
    setShowAnswer(false);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const exitStudyMode = () => {
    setIsStudyMode(false);
    setCurrentCard(null);
    setShowAnswer(false);
  };

  const categories = Array.from(new Set(flashcards.map(card => card.category)));

  if (isStudyMode && currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button 
              onClick={exitStudyMode}
              variant="ghost" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              ← Thoát học tập
            </Button>
            <div className="text-red-600 font-medium">
              {currentIndex + 1} / {flashcards.length}
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-2xl h-96 border-2 border-red-200 cursor-pointer" onClick={toggleAnswer}>
              <div className="h-full p-8 flex flex-col justify-center items-center text-center">
                {!showAnswer ? (
                  <>
                    <div className="text-sm text-red-500 mb-4">CÂU HỎI</div>
                    <div className="text-2xl font-medium text-gray-800 mb-6">
                      {currentCard.front}
                    </div>
                    <Button 
                      onClick={toggleAnswer}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem đáp án
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-green-600 mb-4">ĐÁP ÁN</div>
                    <div className="text-xl text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {currentCard.back}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button 
              onClick={prevCard}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              ← Thẻ trước
            </Button>
            <Button 
              onClick={toggleAnswer}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              {showAnswer ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
            </Button>
            <Button 
              onClick={nextCard}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Thẻ tiếp →
            </Button>
          </div>

          <div className="text-center mt-6 text-gray-600">
            <p>Danh mục: {currentCard.category}</p>
            <p>Đã xem: {currentCard.reviewCount} lần</p>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold text-red-600 mb-2">Flashcards</h1>
          <p className="text-gray-600">Tạo và ôn tập thẻ ghi nhớ</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-medium text-gray-700">
            Tổng số thẻ: {flashcards.length}
          </div>
          <div className="flex gap-3">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo thẻ mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Tạo Flashcard Mới</DialogTitle>
                  <DialogDescription>
                    Tạo thẻ ghi nhớ mới với câu hỏi và câu trả lời để ôn tập
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <Input
                      placeholder="VD: Toán học, Vật lý..."
                      value={newCard.category}
                      onChange={(e) => setNewCard({...newCard, category: e.target.value})}
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Câu hỏi / Mặt trước
                    </label>
                    <Textarea
                      placeholder="Nhập câu hỏi hoặc thuật ngữ..."
                      value={newCard.front}
                      onChange={(e) => setNewCard({...newCard, front: e.target.value})}
                      rows={3}
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Câu trả lời / Mặt sau
                    </label>
                    <Textarea
                      placeholder="Nhập câu trả lời hoặc định nghĩa..."
                      value={newCard.back}
                      onChange={(e) => setNewCard({...newCard, back: e.target.value})}
                      rows={4}
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>
                  <Button 
                    onClick={createCard}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    Tạo thẻ
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={startStudy}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Bắt đầu học
            </Button>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-3">Danh mục:</div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <span 
                  key={category}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                >
                  {category} ({flashcards.filter(card => card.category === category).length})
                </span>
              ))}
            </div>
          </div>
        )}

        {flashcards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Chưa có thẻ nào
            </h3>
            <p className="text-gray-500 mb-6">
              Tạo thẻ đầu tiên để bắt đầu học tập
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcards.map((card) => (
              <Card key={card.id} className="p-4 border-2 border-red-100 hover:border-red-300 transition-colors">
                <div className="mb-3">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {card.category}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="font-medium text-gray-800 mb-2 line-clamp-2">
                    {card.front}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-3">
                    {card.back}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Xem {card.reviewCount} lần</span>
                  <Button
                    onClick={() => deleteCard(card.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
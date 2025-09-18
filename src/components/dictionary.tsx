import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Languages, Volume2, RotateCcw, Copy, Star, Search, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { EducationalBackground } from "./educational-background";
import { toast } from "sonner@2.0.3";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TextToSpeech } from '@capacitor-community/text-to-speech';


interface DictionaryProps {
  onBack: () => void;
}

interface DictionaryEntry {
  word: string;
  pronunciation: string;
  meaning: string;
  partOfSpeech: string;
  exampleEn: string;// ví dụ tiếng Anh
  exampleVi: string;// ví dụ tiếng Việt
  audio?: string;
}

// Mock dictionary data
const mockDictionary: { [key: string]: DictionaryEntry } = {
  "hello": {
    word: "hello",
    pronunciation: "/həˈloʊ/",
    meaning: "xin chào, chào hỏi",
    partOfSpeech: "interjection",
    exampleEn: "Hello, how are you today?",
    exampleVi: "Xin chào, hôm nay bạn khỏe không?",
  },
  "book": {
    word: "book",
    pronunciation: "/bʊk/",
    meaning: "sách, quyển sách",
    partOfSpeech: "noun",
    exampleEn: "I'm reading a good book.",
    exampleVi: "Tôi đang đọc một cuốn sách hay.",
  },
  "beautiful": {
    word: "beautiful",
    pronunciation: "/ˈbjuːtɪfəl/",
    meaning: "đẹp, xinh đẹp",
    partOfSpeech: "adjective",
    exampleEn: "She has a beautiful smile.",
    exampleVi: "Cô ấy có một nụ cười đẹp.",
  },
  "study": {
    word: "study",
    pronunciation: "/ˈstʌdi/",
    meaning: "học, nghiên cứu",
    partOfSpeech: "verb",
    exampleEn: "I study English every day.",
    exampleVi: "Tôi học tiếng Anh mỗi ngày.",
  },
  "teacher": {
    word: "teacher",
    pronunciation: "/ˈtiːtʃər/",
    meaning: "giáo viên, thầy/cô giáo",
    partOfSpeech: "noun",
    exampleEn: "My teacher is very kind.",
    exampleVi: "Thầy giáo của tôi rất tử tế(hoặc là tốt bụng).",
  },
  "xin chào": {
    word: "xin chào",
    pronunciation: "/sin tʃaːw/",
    meaning: "hello, hi",
    partOfSpeech: "greeting",
    exampleEn: "Hello, how are you?",
    exampleVi: "Xin chào, bạn có khỏe không?",
  },
  "học": {
    word: "học",
    pronunciation: "/hok/",
    meaning: "to study, to learn",
    partOfSpeech: "verb",
    exampleEn: "I study English every day.",
    exampleVi: "Tôi học tiếng Anh mỗi ngày.",
  },
  "đẹp": {
    word: "đẹp",
    pronunciation: "/ɗep/",
    meaning: "beautiful, pretty",
    partOfSpeech: "adjective",
    exampleEn: "She is very beautiful.",
    exampleVi: "Cô ấy rất đẹp.",
  },

};

export function Dictionary({ onBack }: DictionaryProps) {
  const [inputText, setInputText] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("vi");
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);


  // 🟢 Hàm xử lý khi bấm nút "Tra cứu"
  // Hàm tra cứu duy nhất
  const handleSearch = async () => {
    if (!inputText.trim()) {
      toast.error("Vui lòng nhập từ cần tra cứu!");
      return;
    }
    setIsLoading(true);
    const searchTerm = inputText.toLowerCase().trim();

    // 1. Tra offline trước
    if (mockDictionary[searchTerm]) {
      const foundEntry = mockDictionary[searchTerm];
      setResult(foundEntry);

      saveHistory(searchTerm);
      toast.success("Đã tìm thấy từ trong từ điển offline!");
      setIsLoading(false);
      return;
    }

    // 2. Nếu không có thì gọi API online
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyBRFPXbiLH4gJS3bQ0Cy1Q1A8PAEz5Mxhw"); // 🔑 thay bằng key của bạn
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Bạn là một API từ điển. Hãy dịch từ "${inputText}" từ ${sourceLanguage} sang ${targetLanguage}.
                Trả về đúng JSON, không có chữ thừa, theo mẫu:
                {
                  "pronunciation": "...",
                  "nghĩa": "...",
                  "Ví dụ_Tiếng_Anh": "...",
                  "Ví dụ_Tiếng_Việt": "...",
                  "Từ loại": "..."
                }`,
              },
            ],
          },
        ],
      });

      const outputText =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      // 🟢 Regex tìm JSON trong text
      const jsonMatch = outputText.match(/\{[\s\S]*?\}/);

      let entry: DictionaryEntry;
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          entry = {
            word: inputText,
            pronunciation: parsed.pronunciation || "",
            meaning: parsed.nghĩa || "",
            exampleEn: parsed["Ví dụ_Tiếng_Anh"] || "",
            exampleVi: parsed["Ví dụ_Tiếng_Việt"] || "",
            partOfSpeech: parsed["Từ loại"] || "—",
            audio: `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(
              inputText
            )}&tl=${sourceLanguage}`,
          };
        } catch {
          // fallback nếu JSON lỗi
          entry = {
            word: inputText,
            pronunciation: "",
            meaning: outputText,
            exampleEn: "",
            exampleVi: "",
            partOfSpeech: "—",
            audio: `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(
              inputText
            )}&tl=${sourceLanguage}`,
          };
        }
      } else {
        // fallback nếu không có JSON
        entry = {
          word: inputText,
          pronunciation: "",
          meaning: outputText,
          exampleEn: "",
          exampleVi: "",
          partOfSpeech: "—",
          audio: `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(
            inputText
          )}&tl=${sourceLanguage}`,
        };
      }

      setResult(entry);

      // 🟢 Lưu lịch sử
      const newHistory = [inputText, ...searchHistory.filter((item) => item !== inputText)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem("dictionaryHistory", JSON.stringify(newHistory));

      toast.success("Đã tìm thấy từ!");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra,vui lòng thử lại!");
    }

    setIsLoading(false);
  };
  // Load favorites and history from localStorage
    const saveHistory = (word: string) => {
    const newHistory = [word, ...searchHistory.filter((item) => item !== word)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem("dictionaryHistory", JSON.stringify(newHistory));
    };

  useEffect(() => {
    const savedFavorites = localStorage.getItem('dictionaryFavorites');
    const savedHistory = localStorage.getItem('dictionaryHistory');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText("");
    setResult(null);
    toast.info("Đã hoán đổi ngôn ngữ!");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép!");
  };

  const handleAddToFavorites = () => {
    if (result && !favorites.includes(result.word)) {
      const newFavorites = [...favorites, result.word];
      setFavorites(newFavorites);
      localStorage.setItem('dictionaryFavorites', JSON.stringify(newFavorites));
      toast.success("Đã thêm vào danh sách yêu thích!");
    }
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'en':
        return '🇬🇧';
      case 'vi':
        return '🇻🇳';
      default:
        return '🌐';
    }
  };

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case 'en':
        return 'Tiếng Anh';
      case 'vi':
        return 'Tiếng Việt';
      default:
        return lang;
    }
  };

        // Hàm phát âm bằng TTSOpenAI
    // Hàm phát âm bằng TTS
    // Hàm phát âm được sửa lỗi
    // Hàm phát âm được sửa lỗi
    // Hàm phát âm được sửa lỗi
    const handlePlayAudio = async (lang: "en" | "vi") => {
      if (!result) return;

      // 🟢 Text cần đọc
      let textToRead = "";
      if (lang === "en") {
        textToRead = sourceLanguage === "en" ? result.word : result.meaning || result.word;
      } else {
        textToRead = sourceLanguage === "vi" ? result.word : result.meaning;
      }


      // ✅ Kiểm tra có đang chạy trong app (Android/iOS) hay web
      const isNative = (window as any).Capacitor?.isNativePlatform?.();

      if (isNative) {
        // 🔊 Native TTS cho Android/iOS
        try {
          await TextToSpeech.speak({
            text: textToRead,
            lang: lang === "en" ? "en-US" : "vi-VN",
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            category: "ambient",
          });
        } catch (err) {
          console.error("TTS error:", err);
          toast.error("Không đọc được giọng trên Android!");
        }
      } else {
        // 🔊 Web Speech API cho web
        if ("speechSynthesis" in window) {
          if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
          }
          const utter = new SpeechSynthesisUtterance(textToRead);
          utter.lang = lang === "en" ? "en-US" : "vi-VN";
          utter.rate = 1;
          utter.pitch = 1;
          speechSynthesis.speak(utter);
        } else {
          toast.error("Trình duyệt không hỗ trợ phát âm.");
        }
      }
    };

  return (
    <div className="min-h-screen relative p-4 overflow-x-hidden">
      <EducationalBackground variant="secondary" />
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-16 text-3xl opacity-15 educational-float">📚</div>
        <div className="absolute top-32 right-20 text-2xl opacity-10 gentle-pulse" style={{ animationDelay: '0.8s' }}>🌐</div>
        <div className="absolute top-1/3 left-8 text-xl opacity-15 subtle-bounce" style={{ animationDelay: '1.5s' }}>🔤</div>
        <div className="absolute top-1/3 right-12 text-xl opacity-10 sparkle-animation" style={{ animationDelay: '0.4s' }}>💬</div>
        <div className="absolute bottom-1/3 left-12 text-lg opacity-15 twinkle-animation" style={{ animationDelay: '2.1s' }}>🎯</div>
        <div className="absolute bottom-1/3 right-16 text-lg opacity-10 dance-animation" style={{ animationDelay: '1.2s' }}>✨</div>
        <div className="absolute bottom-24 left-20 text-md opacity-15 educational-float" style={{ animationDelay: '1.8s' }}>🔍</div>
        <div className="absolute bottom-32 right-24 text-md opacity-10 gentle-pulse" style={{ animationDelay: '0.6s' }}>🎪</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={onBack}
            variant="outline" 
            size="icon"
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-800">Tra cứu từ điển</h1>
              <p className="text-gray-600">Dịch và phiên âm Anh-Việt, Việt-Anh</p>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{getLanguageFlag('en')} Tiếng Anh</SelectItem>
                  <SelectItem value="vi">{getLanguageFlag('vi')} Tiếng Việt</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleSwapLanguages}
                className="rounded-full hover:scale-110 transition-transform shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{getLanguageFlag('en')} Tiếng Anh</SelectItem>
                  <SelectItem value="vi">{getLanguageFlag('vi')} Tiếng Việt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {getLanguageName(sourceLanguage)} → {getLanguageName(targetLanguage)}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Nhập từ ${getLanguageName(sourceLanguage)}...`}
              className="pl-10 pr-20 h-12 border-2 border-gray-200 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Tra cứu"
              )}
            </Button>
          </div>
        </Card>

        {/* Search Result */}
        {result && (
          <Card className="p-6 mb-6 border-0 shadow-lg bg-white relative overflow-hidden animate-dictionary-entry">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-8 text-6xl educational-float">📖</div>
              <div className="absolute bottom-4 left-8 text-4xl gentle-pulse" style={{ animationDelay: '0.7s' }}>💡</div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800 animate-word-highlight break-words">{result.word}</h2>
                    <div className="flex items-center gap-2">
                              <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePlayAudio("en")}
                            className="rounded-full hover:scale-110 transition-transform">
                            🔊 Đọc tiếng Anh
                          </Button>
                          {/* Đọc tiếng Việt */}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePlayAudio("vi")}
                            className="rounded-full hover:scale-110 transition-transform">
                            🔊 Đọc tiếng Việt
                        </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopy(result.word)}
                        className="rounded-full"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleAddToFavorites}
                        className="rounded-full"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Phiên âm:</span>
                      <span className="text-lg text-blue-600 font-mono break-all">{result.pronunciation}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Từ loại:</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                        {result.partOfSpeech}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-500">Nghĩa,từ đã dịch:</span>
                      <p className="text-lg text-gray-800 mt-1 break-words">{result.meaning}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-500">Ví dụ tiếng Anh:</span>
                      <p className="text-gray-700 italic mt-1 break-words">"{result.exampleEn}"</p>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-500">Ví dụ tiếng Việt:</span>
                      <p className="text-gray-700 italic mt-1 break-words">"{result.exampleVi}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <Card className="p-6 mb-6 border-0 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Lịch sử tìm kiếm</h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputText(term);
                    handleSearch();
                  }}
                  className="rounded-full"
                >
                  {term}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Sample Words */}
        {!result && !isLoading && (
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
            <h3 className="font-semibold text-gray-800 mb-3">Từ mẫu để thử</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(mockDictionary).slice(0, 8).map((word) => (
                <Button
                  key={word}
                  variant="outline"
                  onClick={() => {
                    setInputText(word);
                    setTimeout(handleSearch, 100);
                  }}
                  className="h-auto p-3 text-left flex flex-col items-start hover:scale-105 transition-transform"
                >
                  <span className="font-medium break-words">{word}</span>
                  <span className="text-xs text-gray-500 break-all">{mockDictionary[word].pronunciation}</span>
                </Button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div> 
  );
} 
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import {
  ArrowLeft,
  Search,
  Heart,
  Menu,
  MessageCircle,
  Bookmark,
  Share2,
  Plus,
  Shuffle,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
// thêm funtion đỡ lỗi phần **
// --- thêm helper sạch text ở đầu file ---
function cleanText(raw: string) {
  if (!raw) return raw;
  // loại bỏ markdown **, ``, và khoảng trắng thừa
  return raw
    .replace(/\*\*/g, "")
    .replace(/`+/g, "")
    .replace(/\r/g, "")
    .trim();
}

function tryParseJSONMaybe(text: string) {
  // cố gắng tìm JSON object trong text
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (
      jsonStart !== -1 &&
      jsonEnd !== -1 &&
      jsonEnd > jsonStart
    ) {
      const candidate = text.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(candidate);
    }
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}
// thêm trợ lí gemini hehee
import { GoogleGenerativeAI } from "@google/generative-ai";

// 👉 Khởi tạo Gemini API
// Thay API key của bạn ở đây hoặc sử dụng biến môi trường
const genAI = new GoogleGenerativeAI(
  "AIzaSyDKwzIxGhtFLivCridRv7-BKU6N-834MHI",
);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

interface SlangDictionaryProps {
  onBack: () => void;
}

interface SlangEntry {
  slang: string;
  meaning: string;
  detailedMeaning: string;
  example: string;
  examples?: string[];
  region?: string;
  popularity: number;
  emoji: string;
}

const slangData: SlangEntry[] = [
  {
    slang: "Ông mặt trời",
    meaning: "Người quan trọng, có ảnh hưởng lớn",
    detailedMeaning:
      'Chi tiết: Ảnh mặt trời được nhân hóa thành ông già vui vẻ, thường dùng trong văn học thiếu nhi để nói về sự khởi đầu ngày mới, ánh sáng, niềm vui. Trong tiếng lóng hiện đại, trên mạng đời khi "ông mặt trời" được dùng để chỉ điều gì đó rất tuyệt vời, tích cực, kiểu "toẹt vời ông mặt trời" - nghĩa là quá tốt, quá đa, không chê vào đâu được (tham khảo nhiều nguồn trên mạng). Không có nghĩa lóng tiêu cực hay ngầm chỉ người cù thể nào.',
    example:
      '"Sáng nay Ông Mặt Trời rực rỡ quá, báo hiệu một ngày mới thật tuyệt vời!"',
    examples: [
      '"Sáng nay Ông Mặt Trời rực rỡ quá, báo hiệu một ngày mới thật tuyệt vời!"',
      '"Đừng vậy, cảm giác như mọi thứ đều toẹt vời Ông Mặt Trời luôn ấy."',
    ],
    region: "Miền Bắc",
    popularity: 5,
    emoji: "☀️",
  },
  {
    slang: "Xịn xò",
    meaning: "Tốt, đẹp, chất lượng cao",
    detailedMeaning:
      "Từ lóng phổ biến để diễn tả một vật hoặc sự việc có chất lượng cao, tốt đẹp, sang trọng. Nguồn gốc có thể từ tiếng Hoa 'xịn' nghĩa là thật, chính hãng.",
    example: "Cái áo này xịn xò quá!",
    region: "Cả nước",
    popularity: 5,
    emoji: "✨",
  },
  {
    slang: "Nhây",
    meaning: "Khó chịu, bực mình, dính dáng",
    detailedMeaning:
      "Dùng để chỉ người hoặc việc gây khó chịu, phiền toái, hay dính dáng vào chuyện của người khác một cách không mong muốn.",
    example: "Đừng có nhây tôi nữa",
    region: "Miền Nam",
    popularity: 4,
    emoji: "😤",
  },
  {
    slang: "Úi chà chà",
    meaning: "Thốt lên khi ngạc nhiên",
    detailedMeaning:
      "Từ cảm thán dùng khi bất ngờ, ngạc nhiên trước một điều gì đó, thường mang nghĩa tích cực.",
    example: "Úi chà chà, đẹp quá đi!",
    region: "Miền Bắc",
    popularity: 5,
    emoji: "😲",
  },
  {
    slang: "Bon chen",
    meaning: "Tranh giành, cạnh tranh",
    detailedMeaning:
      "Hành động tranh giành, cạnh tranh gay gắt để giành lấy lợi ích hoặc vị trí nào đó.",
    example: "Bon chen suốt ngày mệt lắm",
    region: "Miền Bắc",
    popularity: 4,
    emoji: "🏃",
  },
  {
    slang: "Vãi",
    meaning: "Cực kỳ, quá mức",
    detailedMeaning:
      "Từ lóng dùng để nhấn mạnh mức độ cao của một tính chất hoặc sự việc, có thể mang nghĩa tích cực hoặc tiêu cực tùy ngữ cảnh.",
    example: "Vãi nồi, đắt quá!",
    region: "Cả nước",
    popularity: 5,
    emoji: "🔥",
  },
  {
    slang: "Bao phê",
    meaning: "Rất tuyệt, rất hay",
    detailedMeaning:
      "Dùng để diễn tả cảm giác rất thích thú, tuyệt vời về một trải nghiệm nào đó, đặc biệt về đồ ăn hoặc hoạt động giải trí.",
    example: "Món này bao phê luôn!",
    region: "Miền Nam",
    popularity: 5,
    emoji: "🤩",
  },
  {
    slang: "Ngầu",
    meaning: "Cool, phong cách",
    detailedMeaning:
      "Từ lóng miêu tả một người hoặc vật có phong cách, bản lĩnh, thu hút và ấn tượng.",
    example: "Tóc mới của cậu ngầu quá",
    region: "Cả nước",
    popularity: 5,
    emoji: "😎",
  },
  {
    slang: "Chill",
    meaning: "Thư giãn, thoải mái",
    detailedMeaning:
      "Từ mượn từ tiếng Anh, dùng để chỉ trạng thái thư giãn, thoải mái, không căng thẳng.",
    example: "Cuối tuần này chill thôi",
    region: "Giới trẻ",
    popularity: 5,
    emoji: "🏖️",
  },
  {
    slang: "Crush",
    meaning: "Người mình thầm thích",
    detailedMeaning:
      "Từ mượn từ tiếng Anh, chỉ người mà mình có cảm tình, thầm thích nhưng chưa bày tỏ.",
    example: "Crush của tôi đẹp lắm",
    region: "Giới trẻ",
    popularity: 5,
    emoji: "💖",
  },
];

export function SlangDictionary({
  onBack,
}: SlangDictionaryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSlang, setSelectedSlang] =
    useState<SlangEntry | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [customWords, setCustomWords] = useState<SlangEntry[]>(
    [],
  );
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiResult, setAiResult] = useState<SlangEntry | null>(
    null,
  );

  // Form state for adding new word
  const [newWord, setNewWord] = useState({
    slang: "",
    meaning: "",
    detailedMeaning: "",
    example: "",
    region: "",
    emoji: "💬",
  });

  // Load custom words from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(
      "slangDictionary_customWords",
    );
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomWords(parsed);
      } catch (error) {
        console.error("Error loading custom words:", error);
      }
    }
  }, []);

  // Save custom words to localStorage whenever they change
  useEffect(() => {
    if (customWords.length > 0) {
      localStorage.setItem(
        "slangDictionary_customWords",
        JSON.stringify(customWords),
      );
    }
  }, [customWords]);

  const allSlang = useMemo(
    () => [...slangData, ...customWords],
    [customWords],
  );

  const filteredSlang = useMemo(
    () =>
      allSlang.filter(
        (entry) =>
          entry.slang
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          entry.meaning
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, allSlang],
  );

  const handleSearch = useCallback(async () => {
    // Nếu không nhập gì, không làm gì
    if (!searchTerm.trim()) {
      toast.error("Lỗi", {
        description: "Vui lòng nhập từ cần tìm",
        duration: 2000,
      });
      return;
    }

    // Nếu tìm thấy trong danh sách, hiển thị kết quả đầu tiên
    if (filteredSlang.length > 0) {
      setSelectedSlang(filteredSlang[0]);
      toast.success("Tìm thấy!", {
        description: `Đã tìm thấy "${filteredSlang[0].slang}" trong từ điển`,
        duration: 2000,
      });
      return;
    }

    // Nếu không tìm thấy, gọi AI Gemini
    setIsAISearching(true);
    toast.info("Đang tìm kiếm...", {
      description:
        "AI đang giải thích nghĩa từ lóng cho bạn...",
      duration: 2000,
    });

    try {
      const prompt = `Bạn hãy giải thích về tiếng lóng Việt Nam. Hãy giải thích từ lóng "${searchTerm}" theo format sau:

1. Nghĩa ngắn gọn (1 câu)
2. Giải thích chi tiết (2-3 câu)
3. Ví dụ sử dụng (1-2 câu trong ngoặc kép)
4. Vùng miền phổ biến (Miền Bắc/Nam/Trung hoặc Cả nước/Giới trẻ)
5. Không cần nói chào bạn,với vai trò chuyên gia, chỉ trả lời theo format trên.
6. Viết ngắn gọn,dưới 18 câu,dưới 250 từ"`;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDKwzIxGhtFLivCridRv7-BKU6N-834MHI",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        },
      );

      const data = await response.json();
      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Không tìm thấy";

      // Kiểm tra nếu AI không tìm thấy
      if (text.includes("Không tìm thấy")) {
        toast.error("Không tìm thấy", {
          description: `"${searchTerm}" không phải là tiếng lóng Việt Nam phổ biến`,
          duration: 3000,
        });
        setIsAISearching(false);
        return;
      }

      // Parse kết quả từ AI (đơn giản hóa)
      const lines = text
        .split("\n")
        .filter((line) => line.trim());

      const aiEntry: SlangEntry = {
        slang: searchTerm,
        meaning: lines[0] || "Từ lóng Việt Nam",
        detailedMeaning: text,
        example:
          lines.find((l) => l.includes('"')) ||
          `Ví dụ: ${searchTerm}`,
        region: "AI - Gemini",
        popularity: 5,
        emoji: "🤖",
      };

      setAiResult(aiEntry);
      setSelectedSlang(aiEntry);

      toast.success("AI đã tìm thấy!", {
        description: `Gemini đã giải thích nghĩa của "${searchTerm}"`,
        duration: 3000,
      });
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("Lỗi AI", {
        description:
          "Không thể kết nối với AI. Vui lòng kiểm tra API key.",
        duration: 3000,
      });
    } finally {
      setIsAISearching(false);
    }
  }, [searchTerm, filteredSlang]);

  const handleAddWord = useCallback(() => {
    setShowAddDialog(true);
  }, []);

  const handleSubmitNewWord = useCallback(() => {
    if (!newWord.slang || !newWord.meaning) {
      toast.error("Lỗi", {
        description: "Vui lòng nhập ít nhất tên từ và nghĩa",
        duration: 2000,
      });
      return;
    }

    const newEntry: SlangEntry = {
      slang: newWord.slang,
      meaning: newWord.meaning,
      detailedMeaning:
        newWord.detailedMeaning || newWord.meaning,
      example: newWord.example || `Ví dụ về ${newWord.slang}`,
      region: newWord.region || "Tùy chỉnh",
      popularity: 5,
      emoji: newWord.emoji,
    };

    setCustomWords((prev) => [...prev, newEntry]);
    setShowAddDialog(false);
    setNewWord({
      slang: "",
      meaning: "",
      detailedMeaning: "",
      example: "",
      region: "",
      emoji: "💬",
    });

    toast.success("Thành công", {
      description: `Đã thêm từ "${newEntry.slang}" vào từ điển`,
      duration: 2000,
    });
  }, [newWord]);

  const handleRandomWord = useCallback(() => {
    if (filteredSlang.length > 0) {
      const randomEntry =
        filteredSlang[
          Math.floor(Math.random() * filteredSlang.length)
        ];
      setSelectedSlang(randomEntry);
      toast.success("Random từ", {
        description: `Đã chọn ngẫu nhiên: ${randomEntry.slang}`,
        duration: 2000,
      });
    }
  }, [filteredSlang]);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      {/* Vietnam Map Background - Faded */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url(https://www.hieuchua.com/assets/Flag-map_of_Vietnam-CNL83hh5.png)`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10 p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Simple Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/50 transition-colors"
            >
              <ArrowLeft
                className="w-5 h-5"
                style={{ color: "#5D4037" }}
              />
            </Button>
            <h1
              className="text-xl sm:text-2xl"
              style={{ color: "#5D4037" }}
            >
              Biết chưa - Từ điển tiếng lóng Việt Nam
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg hover:bg-white/50 transition-colors"
              >
                <Menu
                  className="w-6 h-6"
                  style={{ color: "#5D4037" }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleAddWord}
                className="cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm từ
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleRandomWord}
                className="cursor-pointer"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Random từ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        <div
          className="mb-6 p-3 bg-white/80 backdrop-blur-sm rounded-xl border"
          style={{ borderColor: "#D7CCC8" }}
        >
          <div className="flex items-center gap-2">
            <Search
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "#A0826D" }}
            />
            <Input
              type="text"
              placeholder="con vờ lây"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              style={{ color: "#5D4037" }}
              disabled={isAISearching}
            />
            <Button
              onClick={handleSearch}
              size="sm"
              className="px-4 gap-2"
              style={{
                backgroundColor: "#8D6E63",
                color: "white",
              }}
              disabled={isAISearching}
            >
              {isAISearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI...
                </>
              ) : (
                "tìm"
              )}
            </Button>
          </div>
        </div>

        {/* Slang List */}
        <div className="space-y-3">
          {filteredSlang.map((entry, index) => (
            <Card
              key={`${entry.slang}-${index}`}
              onClick={() => setSelectedSlang(entry)}
              className="p-4 bg-white/90 backdrop-blur-sm hover:scale-[1.02] transition-all duration-200 cursor-pointer border-2 shadow-sm hover:shadow-md"
              style={{
                borderColor: "#D7CCC8",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-lg truncate"
                    style={{ color: "#5D4037" }}
                  >
                    {entry.slang}
                  </h3>
                  <p
                    className="text-sm mt-1 line-clamp-1"
                    style={{ color: "#8D6E63" }}
                  >
                    {entry.meaning}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detail Dialog */}
        <Dialog
          open={!!selectedSlang}
          onOpenChange={(open) =>
            !open && setSelectedSlang(null)
          }
        >
          <DialogContent
            className="max-w-lg border-4 rounded-3xl p-6"
            style={{
              borderColor: "#000000",
              backgroundColor: "#FFF8E1",
            }}
          >
            {selectedSlang && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <DialogTitle
                      className="text-2xl"
                      style={{ color: "#5D4037" }}
                    >
                      {selectedSlang.slang}
                    </DialogTitle>
                    {selectedSlang.region === "AI - Gemini" && (
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: "#E3F2FD",
                          color: "#1976D2",
                        }}
                      >
                        🤖 AI
                      </span>
                    )}
                  </div>
                  <DialogDescription className="sr-only">
                    Chi tiết giải thích từ lóng{" "}
                    {selectedSlang.slang}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6D4C41" }}
                  >
                    {selectedSlang.detailedMeaning}
                  </p>

                  <div className="space-y-3 mt-4">
                    <p
                      className="text-sm leading-relaxed italic"
                      style={{ color: "#8D6E63" }}
                    >
                      <span className="font-semibold not-italic">
                        Tu:{" "}
                      </span>
                      {selectedSlang.example}
                    </p>
                    {selectedSlang.examples &&
                      selectedSlang.examples.length > 1 && (
                        <p
                          className="text-sm leading-relaxed italic"
                          style={{ color: "#8D6E63" }}
                        >
                          <span className="font-semibold not-italic">
                            Minh:{" "}
                          </span>
                          {selectedSlang.examples[1]}
                        </p>
                      )}
                  </div>

                  {/* Interaction buttons */}
                  <div
                    className="flex items-center gap-4 pt-4 mt-4 border-t"
                    style={{ borderColor: "#D7CCC8" }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 p-0 h-auto"
                      style={{ color: "#8D6E63" }}
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">1</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 p-0 h-auto"
                      style={{ color: "#8D6E63" }}
                    >
                      <Bookmark className="w-5 h-5" />
                      <span className="text-sm">0</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 p-0 h-auto"
                      style={{ color: "#8D6E63" }}
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 p-0 h-auto"
                      style={{ color: "#8D6E63" }}
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Save AI result button */}
                  {selectedSlang.region === "AI - Gemini" && (
                    <Button
                      onClick={() => {
                        setCustomWords((prev) => [
                          ...prev,
                          selectedSlang,
                        ]);
                        toast.success("Đã lưu!", {
                          description: `Đã lưu "${selectedSlang.slang}" vào từ điển của bạn`,
                          duration: 2000,
                        });
                      }}
                      className="w-full mt-4"
                      style={{
                        backgroundColor: "#1976D2",
                        color: "white",
                      }}
                    >
                      💾 Lưu từ này vào danh sách
                    </Button>
                  )}

                  {/* Footer timestamp */}
                  <p
                    className="text-xs mt-4"
                    style={{ color: "#A1887F" }}
                  >
                    {selectedSlang.region === "AI - Gemini"
                      ? "Giải thích bởi Biết chưa  "
                      : "việt bởi Biết chưa 2025-06-10"}
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Word Dialog */}
        <Dialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
        >
          <DialogContent
            className="max-w-lg border-4 rounded-3xl p-6"
            style={{
              borderColor: "#000000",
              backgroundColor: "#FFF8E1",
            }}
          >
            <DialogHeader>
              <DialogTitle
                className="text-2xl mb-2"
                style={{ color: "#5D4037" }}
              >
                Thêm từ mới
              </DialogTitle>
              <DialogDescription className="sr-only">
                Form để thêm từ lóng mới vào từ điển
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label
                  className="text-sm font-semibold mb-1 block"
                  style={{ color: "#5D4037" }}
                >
                  Từ lóng *
                </label>
                <Input
                  value={newWord.slang}
                  onChange={(e) =>
                    setNewWord((prev) => ({
                      ...prev,
                      slang: e.target.value,
                    }))
                  }
                  placeholder="VD: Bao ngầu"
                  className="border-2"
                  style={{
                    borderColor: "#D7CCC8",
                    backgroundColor: "white",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold mb-1 block"
                  style={{ color: "#5D4037" }}
                >
                  Nghĩa *
                </label>
                <Input
                  value={newWord.meaning}
                  onChange={(e) =>
                    setNewWord((prev) => ({
                      ...prev,
                      meaning: e.target.value,
                    }))
                  }
                  placeholder="VD: Rất ngầu, rất cool"
                  className="border-2"
                  style={{
                    borderColor: "#D7CCC8",
                    backgroundColor: "white",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold mb-1 block"
                  style={{ color: "#5D4037" }}
                >
                  Giải thích chi tiết
                </label>
                <Input
                  value={newWord.detailedMeaning}
                  onChange={(e) =>
                    setNewWord((prev) => ({
                      ...prev,
                      detailedMeaning: e.target.value,
                    }))
                  }
                  placeholder="Giải thích chi tiết về từ lóng..."
                  className="border-2"
                  style={{
                    borderColor: "#D7CCC8",
                    backgroundColor: "white",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold mb-1 block"
                  style={{ color: "#5D4037" }}
                >
                  Ví dụ
                </label>
                <Input
                  value={newWord.example}
                  onChange={(e) =>
                    setNewWord((prev) => ({
                      ...prev,
                      example: e.target.value,
                    }))
                  }
                  placeholder="VD: Outfit hôm nay bao ngầu!"
                  className="border-2"
                  style={{
                    borderColor: "#D7CCC8",
                    backgroundColor: "white",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold mb-1 block"
                  style={{ color: "#5D4037" }}
                >
                  Vùng miền
                </label>
                <Input
                  value={newWord.region}
                  onChange={(e) =>
                    setNewWord((prev) => ({
                      ...prev,
                      region: e.target.value,
                    }))
                  }
                  placeholder="VD: Miền Nam, Giới trẻ, Cả nước"
                  className="border-2"
                  style={{
                    borderColor: "#D7CCC8",
                    backgroundColor: "white",
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitNewWord}
                  className="flex-1"
                  style={{
                    backgroundColor: "#8D6E63",
                    color: "white",
                  }}
                >
                  Thêm từ
                </Button>
                <Button
                  onClick={() => setShowAddDialog(false)}
                  variant="outline"
                  className="flex-1 border-2"
                  style={{
                    borderColor: "#D7CCC8",
                    color: "#8D6E63",
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredSlang.length === 0 && (
          <Card
            className="p-12 text-center bg-white/90 backdrop-blur-sm border-2"
            style={{ borderColor: "#D2B48C" }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl animate-bounce-slow">
                😢
              </div>
              <h3
                className="text-xl font-semibold"
                style={{ color: "#8B4513" }}
              >
                Không tìm thấy tiếng lóng
              </h3>
              <p
                className="text-sm"
                style={{ color: "#A0826D" }}
              >
                Thử tìm kiếm với từ khóa khác hoặc xem toàn bộ
                danh sách
              </p>
              <Button
                onClick={() => setSearchTerm("")}
                className="mt-2"
                style={{
                  backgroundColor: "#D2691E",
                  color: "white",
                }}
              >
                Xem tất cả
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Save, 
  Share2, 
  Flag, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import type { AnalysisResult } from "./fake-news-detector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface FakeNewsResultProps {
  result: AnalysisResult;
  onViewLessons: () => void;
  onBack: () => void;
}

export function FakeNewsResult({ result, onViewLessons, onBack }: FakeNewsResultProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("reasons");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportCategory, setReportCategory] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const getScoreStatus = (score: number) => {
    if (score >= 75) return { label: "Có vẻ là thật", color: "bg-[#0B63FF]", icon: CheckCircle2 };
    if (score >= 40) return { label: "Cần kiểm tra thêm", color: "bg-[#FF8A00]", icon: AlertTriangle };
    return { label: "Cảnh báo: Có khả năng giả", color: "bg-[#E53935]", icon: XCircle };
  };

  const status = getScoreStatus(result.score);
  const StatusIcon = status.icon;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSave = () => {
    const savedResults = JSON.parse(localStorage.getItem("fakeNewsResults") || "[]");
    savedResults.push({
      ...result,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem("fakeNewsResults", JSON.stringify(savedResults));
    toast.success("Đã lưu kết quả!");
  };

  const handleShare = () => {
    const shareText = `Kết quả kiểm tra tin tức: ${result.title}\nĐộ tin cậy: ${result.score}% - ${status.label}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Kết quả kiểm tra tin tức",
        text: shareText,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast.success("Đã sao chép vào clipboard!");
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Đã sao chép vào clipboard!");
    }
  };

  const handleReport = () => {
    if (!reportCategory) {
      toast.error("Vui lòng chọn loại báo cáo");
      return;
    }
    
    // In a real app, this would submit to a server
    console.log("Report:", { category: reportCategory, description: reportDescription, result });
    toast.success("Đã gửi báo cáo. Cảm ơn bạn!");
    setShowReportDialog(false);
    setReportCategory("");
    setReportDescription("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <Card className="p-6 animate-slide-down">
        <div className="space-y-4">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{result.title}</h2>
            {(result.domain || result.date) && (
              <div className="flex gap-3 text-sm text-gray-600">
                {result.domain && <span>📍 {result.domain}</span>}
                {result.date && <span>📅 {result.date}</span>}
              </div>
            )}
          </div>

          {/* Score Badge */}
          <div className={`${status.color} text-white rounded-2xl p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon className="w-8 h-8" />
                <div>
                  <p className="text-lg font-semibold">{status.label}</p>
                  <p className="text-sm opacity-90">Độ tin cậy</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{result.score}%</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-1000 animate-progress-bar"
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
            <Button
              onClick={() => setShowReportDialog(true)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Flag className="w-4 h-4 mr-2" />
              Báo cáo
            </Button>
          </div>
        </div>
      </Card>

      {/* Analysis Details */}
      <div className="space-y-3">
        {/* Reasons Section */}
        <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: "100ms" }}>
          <button
            onClick={() => toggleSection("reasons")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              🔍 Lý do chính
              <Badge variant="secondary">{result.reasons.length}</Badge>
            </h3>
            {expandedSection === "reasons" ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSection === "reasons" && (
            <div className="p-4 pt-0 space-y-3 animate-slide-down">
              {result.reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{reason.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{reason.text}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${reason.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{reason.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Sources Section */}
        <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
          <button
            onClick={() => toggleSection("sources")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              📰 Đối chiếu nguồn
              <Badge variant="secondary">{result.sources.length}</Badge>
            </h3>
            {expandedSection === "sources" ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSection === "sources" && (
            <div className="p-4 pt-0 space-y-2 animate-slide-down">
              {result.sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {source.matched ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{source.name}</p>
                      <p className="text-xs text-gray-500">{source.url}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Evidence Section */}
        <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
          <button
            onClick={() => toggleSection("evidence")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              📋 Bằng chứng
              <Badge variant="secondary">{result.evidence.length}</Badge>
            </h3>
            {expandedSection === "evidence" ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSection === "evidence" && (
            <div className="p-4 pt-0 space-y-2 animate-slide-down">
              {result.evidence.map((item, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Suggestions Section */}
        <Card className="overflow-hidden animate-fade-in" style={{ animationDelay: "400ms" }}>
          <button
            onClick={() => toggleSection("suggestions")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              💡 Gợi ý hành động
              <Badge variant="secondary">{result.suggestions.length}</Badge>
            </h3>
            {expandedSection === "suggestions" ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSection === "suggestions" && (
            <div className="p-4 pt-0 space-y-2 animate-slide-down">
              {result.suggestions.map((item, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Learn More */}
      <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-medium text-gray-800">Học cách phân biệt tin giả</p>
              <p className="text-sm text-gray-600">Khám phá các bài học ngắn và làm quiz</p>
            </div>
          </div>
          <Button
            onClick={onViewLessons}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            Học ngay
          </Button>
        </div>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button onClick={onBack} variant="outline">
          Kiểm tra nội dung khác
        </Button>
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Báo cáo nội dung</DialogTitle>
            <DialogDescription>
              Chọn loại vi phạm và mô tả chi tiết để giúp chúng tôi xử lý
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Loại vi phạm</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Chính trị", "Sức khỏe", "Lừa đảo", "Khác"].map((cat) => (
                  <Button
                    key={cat}
                    variant={reportCategory === cat ? "default" : "outline"}
                    onClick={() => setReportCategory(cat)}
                    className="w-full"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mô tả (tùy chọn)</Label>
              <Textarea
                placeholder="Mô tả chi tiết về vấn đề..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowReportDialog(false)}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={handleReport}
              >
                Gửi báo cáo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

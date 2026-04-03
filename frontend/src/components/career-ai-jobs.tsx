import { useState } from "react";
import { Briefcase, MapPin, DollarSign, Clock, Heart, ExternalLink, MessageCircle, Star } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { CareerMatch } from "./career-ai";

interface CareerAIJobsProps {
  careerMatches: CareerMatch[];
  onBack: () => void;
}

const mockJobs = [
  {
    id: 1,
    title: "Junior UX Designer",
    company: "Tech Startup Co.",
    location: "Hà Nội",
    salary: "12-18 triệu",
    type: "Full-time",
    match: 92,
    postedDays: 2,
    tags: ["Figma", "User Research", "Remote"],
    description: "Tìm kiếm UX Designer nhiệt huyết tham gia team sản phẩm"
  },
  {
    id: 2,
    title: "Data Analyst Intern",
    company: "E-commerce Platform",
    location: "TP.HCM",
    salary: "8-12 triệu",
    type: "Internship",
    match: 88,
    postedDays: 5,
    tags: ["SQL", "Python", "Excel"],
    description: "Cơ hội học hỏi và phát triển trong môi trường năng động"
  },
  {
    id: 3,
    title: "Content Creator",
    company: "Digital Agency",
    location: "Remote",
    salary: "10-20 triệu",
    type: "Freelance",
    match: 85,
    postedDays: 1,
    tags: ["Video", "Social Media", "Storytelling"],
    description: "Tạo nội dung sáng tạo cho các brand lớn"
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "Software House",
    location: "Đà Nẵng",
    salary: "15-25 triệu",
    type: "Full-time",
    match: 83,
    postedDays: 3,
    tags: ["React", "JavaScript", "CSS"],
    description: "Xây dựng giao diện web hiện đại cho các dự án quốc tế"
  },
  {
    id: 5,
    title: "Marketing Specialist",
    company: "FMCG Company",
    location: "Hà Nội",
    salary: "13-22 triệu",
    type: "Full-time",
    match: 80,
    postedDays: 7,
    tags: ["Digital Marketing", "Google Ads", "Analytics"],
    description: "Triển khai chiến dịch marketing cho sản phẩm tiêu dùng"
  }
];

const mockMentors = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Senior UX Designer",
    company: "Google",
    avatar: "👨‍💼",
    expertise: ["UX Design", "Product Design", "User Research"],
    available: true,
    rating: 4.9,
    sessions: 127
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Data Science Lead",
    company: "Grab",
    avatar: "👩‍💼",
    expertise: ["Data Analysis", "Machine Learning", "Python"],
    available: true,
    rating: 4.8,
    sessions: 93
  },
  {
    id: 3,
    name: "Lê Minh C",
    role: "Marketing Manager",
    company: "Shopee",
    avatar: "👨‍💼",
    expertise: ["Digital Marketing", "Growth Hacking", "SEO"],
    available: false,
    rating: 4.7,
    sessions: 156
  }
];

export function CareerAIJobs({ careerMatches, onBack }: CareerAIJobsProps) {
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"jobs" | "mentors">("jobs");

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const getMatchColor = (percent: number) => {
    if (percent >= 90) return "text-green-600 bg-green-50";
    if (percent >= 80) return "text-blue-600 bg-blue-50";
    return "text-purple-600 bg-purple-50";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card 
        className="p-6 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white border-0 shadow-xl animate-scale-in"
        style={{ borderRadius: "20px" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Việc làm & Mentor</h2>
            <p className="text-purple-100">Kết nối cơ hội thực tế phù hợp với bạn</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{mockJobs.length}</div>
            <p className="text-xs text-purple-100">Công việc</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 animate-slide-down">
        <Button
          onClick={() => setActiveTab("jobs")}
          variant={activeTab === "jobs" ? "default" : "outline"}
          className="flex-1 rounded-full"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Việc làm ({mockJobs.length})
        </Button>
        <Button
          onClick={() => setActiveTab("mentors")}
          variant={activeTab === "mentors" ? "default" : "outline"}
          className="flex-1 rounded-full"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Mentors ({mockMentors.length})
        </Button>
      </div>

      {/* Jobs Tab */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          {mockJobs.map((job, index) => (
            <Card
              key={job.id}
              className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ borderRadius: "20px", animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                      <Badge className={getMatchColor(job.match)}>
                        {job.match}% match
                      </Badge>
                    </div>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{job.description}</p>
                  </div>
                  
                  <Button
                    onClick={() => handleSaveJob(job.id)}
                    variant="ghost"
                    size="icon"
                    className="rounded-full flex-shrink-0"
                  >
                    <Heart 
                      className={`w-5 h-5 transition-all ${
                        savedJobs.includes(job.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </Button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-700">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-500">{job.postedDays} ngày trước</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ứng tuyển ngay
                  </Button>
                  <Button 
                    variant="outline"
                    className="rounded-full"
                  >
                    Chi tiết
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Mentors Tab */}
      {activeTab === "mentors" && (
        <div className="space-y-4">
          {mockMentors.map((mentor, index) => (
            <Card
              key={mentor.id}
              className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ borderRadius: "20px", animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl flex-shrink-0">
                    {mentor.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-gray-800">{mentor.name}</h3>
                      {mentor.available && (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          Đang online
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 font-medium">{mentor.role}</p>
                    <p className="text-sm text-gray-500">{mentor.company}</p>
                    
                    {/* Rating & Sessions */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-700">{mentor.rating}</span>
                        <span className="text-gray-500">({mentor.sessions} sessions)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Chuyên môn:</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <Badge key={skill} className="bg-purple-100 text-purple-700 border-purple-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full"
                    disabled={!mentor.available}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {mentor.available ? "Nhắn tin ngay" : "Không khả dụng"}
                  </Button>
                  <Button 
                    variant="outline"
                    className="rounded-full"
                  >
                    Xem profile
                  </Button>
                </div>

                {mentor.available && (
                  <Card className="p-3 bg-blue-50 border-blue-200" style={{ borderRadius: "12px" }}>
                    <p className="text-xs text-gray-700 text-center">
                      💡 <strong>Miễn phí:</strong> 15 phút tư vấn đầu tiên
                    </p>
                  </Card>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card 
        className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 animate-slide-up"
        style={{ borderRadius: "16px", animationDelay: "400ms" }}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 mb-2">Mẹo ứng tuyển thành công</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>✓ Cá nhân hóa CV theo từng vị trí</li>
              <li>✓ Làm nổi bật kỹ năng match với job description</li>
              <li>✓ Chuẩn bị portfolio/dự án thực tế</li>
              <li>✓ Kết nối với mentor để xin lời khuyên</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full"
        >
          Quay lại trang chủ
        </Button>
      </div>
    </div>
  );
}

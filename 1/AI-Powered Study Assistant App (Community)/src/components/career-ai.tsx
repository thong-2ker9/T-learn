import { useState } from "react";
import { CareerAIHome } from "./career-ai-home";
import { CareerAIQuiz } from "./career-ai-quiz";
import { CareerAIPersonality } from "./career-ai-personality";
import { CareerAIResults } from "./career-ai-results";
import { CareerAICareerPath } from "./career-ai-career-path";
import { CareerAILearning } from "./career-ai-learning";
import { CareerAIJobs } from "./career-ai-jobs";
import { CareerAIProfile } from "./career-ai-profile";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { EducationalBackground } from "./educational-background";

interface CareerAIProps {
  onBack: () => void;
}

export type QuizAnswers = {
  interests: string[];
  skills: string[];
  values: string[];
  workStyle: string[];
};

export type PersonalityScore = {
  creativity: number;
  technical: number;
  communication: number;
  leadership: number;
  analytical: number;
};

export type CareerMatch = {
  id: string;
  title: string;
  matchPercent: number;
  reasons: string[];
  requiredSkills: string[];
  salaryRange: string;
  jobTitles: string[];
  description: string;
  pathTimeline: {
    phase: string;
    duration: string;
    tasks: string[];
  }[];
};

export function CareerAI({ onBack }: CareerAIProps) {
  const [currentView, setCurrentView] = useState<
    "home" | "quiz" | "personality" | "results" | "career-path" | "learning" | "jobs" | "profile"
  >("home");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [personalityScore, setPersonalityScore] = useState<PersonalityScore | null>(null);
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerMatch | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setOverallProgress(25);
    setCurrentView("personality");
  };

  const handlePersonalityComplete = (scores: PersonalityScore) => {
    setPersonalityScore(scores);
    setOverallProgress(50);
    
    // Generate career matches based on quiz and personality
    const matches = generateCareerMatches(quizAnswers!, scores);
    setCareerMatches(matches);
    setCurrentView("results");
  };

  const handleCareerSelect = (career: CareerMatch) => {
    setSelectedCareer(career);
    setCurrentView("career-path");
  };

  const handleStartLearning = () => {
    setOverallProgress(75);
    setCurrentView("learning");
  };

  const handleViewJobs = () => {
    setCurrentView("jobs");
  };

  const handleViewProfile = () => {
    setCurrentView("profile");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  const handleBackToResults = () => {
    setCurrentView("results");
  };

  return (
    <div className="min-h-screen relative">
      <EducationalBackground variant="secondary" />
      
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">ĐỊNH HƯỚNG NGHỀ NGHIỆP CÙNG AI</h1>
            <p className="text-sm text-purple-100">Khám phá nghề phù hợp với bạn</p>
          </div>
          {overallProgress > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-sm">{overallProgress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {currentView === "home" && (
          <CareerAIHome
            onStartQuiz={() => setCurrentView("quiz")}
            onExploreJobs={handleViewJobs}
            onViewProfile={handleViewProfile}
          />
        )}
        {currentView === "quiz" && (
          <CareerAIQuiz
            onComplete={handleQuizComplete}
            onBack={handleBackToHome}
          />
        )}
        {currentView === "personality" && (
          <CareerAIPersonality
            onComplete={handlePersonalityComplete}
            onBack={() => setCurrentView("quiz")}
          />
        )}
        {currentView === "results" && (
          <CareerAIResults
            matches={careerMatches}
            onSelectCareer={handleCareerSelect}
            onBack={handleBackToHome}
          />
        )}
        {currentView === "career-path" && selectedCareer && (
          <CareerAICareerPath
            career={selectedCareer}
            onStartLearning={handleStartLearning}
            onBack={handleBackToResults}
          />
        )}
        {currentView === "learning" && selectedCareer && (
          <CareerAILearning
            career={selectedCareer}
            onComplete={() => setOverallProgress(100)}
            onBack={() => setCurrentView("career-path")}
          />
        )}
        {currentView === "jobs" && (
          <CareerAIJobs
            careerMatches={careerMatches}
            onBack={handleBackToHome}
          />
        )}
        {currentView === "profile" && (
          <CareerAIProfile
            progress={overallProgress}
            careers={careerMatches}
            onBack={handleBackToHome}
          />
        )}
      </div>
    </div>
  );
}

function generateCareerMatches(answers: QuizAnswers, personality: PersonalityScore): CareerMatch[] {
  // Mock data - in real app this would be AI-generated
  const allCareers: CareerMatch[] = [
    {
      id: "ux-designer",
      title: "UX/UI Designer",
      matchPercent: Math.floor(personality.creativity * 0.5 + personality.communication * 0.3 + Math.random() * 20 + 60),
      reasons: [
        "Cao điểm sáng tạo và tư duy thiết kế",
        "Kỹ năng giao tiếp tốt giúp hiểu người dùng",
        "Phù hợp với phong cách làm việc độc lập"
      ],
      requiredSkills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Visual Design"],
      salaryRange: "12-25 triệu/tháng",
      jobTitles: ["UX Designer", "UI Designer", "Product Designer", "Visual Designer"],
      description: "Thiết kế trải nghiệm người dùng cho app & website",
      pathTimeline: [
        {
          phase: "Giai đoạn 1: Cơ bản (0-3 tháng)",
          duration: "3 tháng",
          tasks: ["Học Figma cơ bản", "Hiểu Design Thinking", "Thực hành redesign app"]
        },
        {
          phase: "Giai đoạn 2: Thực chiến (3-12 tháng)",
          duration: "9 tháng",
          tasks: ["Làm dự án thực tế", "Xây dựng portfolio", "Học User Research"]
        },
        {
          phase: "Giai đoạn 3: Chuyên sâu (1-2 năm)",
          duration: "1 năm",
          tasks: ["Chuyên sâu UX/UI", "Mentor junior", "Lead dự án"]
        }
      ]
    },
    {
      id: "data-analyst",
      title: "Data Analyst",
      matchPercent: Math.floor(personality.analytical * 0.6 + personality.technical * 0.3 + Math.random() * 15 + 55),
      reasons: [
        "Tư duy phân tích logic mạnh mẽ",
        "Kỹ năng kỹ thuật vững vàng",
        "Thích làm việc với dữ liệu và số liệu"
      ],
      requiredSkills: ["SQL", "Python", "Excel", "Power BI", "Statistics"],
      salaryRange: "15-30 triệu/tháng",
      jobTitles: ["Data Analyst", "Business Analyst", "Data Scientist Junior"],
      description: "Phân tích dữ liệu để đưa ra insight kinh doanh",
      pathTimeline: [
        {
          phase: "Giai đoạn 1: Foundation (0-4 tháng)",
          duration: "4 tháng",
          tasks: ["Học SQL & Excel", "Thống kê cơ bản", "Python cơ bản"]
        },
        {
          phase: "Giai đoạn 2: Practical (4-12 tháng)",
          duration: "8 tháng",
          tasks: ["Power BI/Tableau", "Phân tích case study", "Build portfolio"]
        },
        {
          phase: "Giai đoạn 3: Advanced (1-2 năm)",
          duration: "1 năm",
          tasks: ["Machine Learning cơ bản", "A/B Testing", "Lead analysis projects"]
        }
      ]
    },
    {
      id: "content-creator",
      title: "Content Creator",
      matchPercent: Math.floor(personality.creativity * 0.5 + personality.communication * 0.4 + Math.random() * 15 + 60),
      reasons: [
        "Khả năng sáng tạo nội dung độc đáo",
        "Giao tiếp và kể chuyện hấp dẫn",
        "Nắm bắt xu hướng mạng xã hội"
      ],
      requiredSkills: ["Video Editing", "Storytelling", "Social Media", "SEO", "Copywriting"],
      salaryRange: "10-30 triệu/tháng",
      jobTitles: ["Content Creator", "Social Media Manager", "Copywriter", "Influencer"],
      description: "Sáng tạo nội dung trên các nền tảng digital",
      pathTimeline: [
        {
          phase: "Giai đoạn 1: Build presence (0-3 tháng)",
          duration: "3 tháng",
          tasks: ["Chọn niche", "Tạo 30 content đầu tiên", "Học editing cơ bản"]
        },
        {
          phase: "Giai đoạn 2: Grow audience (3-12 tháng)",
          duration: "9 tháng",
          tasks: ["Tăng follower", "Hợp tác brand", "Monetize content"]
        },
        {
          phase: "Giai đoạn 3: Professional (1-2 năm)",
          duration: "1 năm",
          tasks: ["Build personal brand", "Multiple income streams", "Mentor others"]
        }
      ]
    },
    {
      id: "software-engineer",
      title: "Software Engineer",
      matchPercent: Math.floor(personality.technical * 0.6 + personality.analytical * 0.3 + Math.random() * 15 + 55),
      reasons: [
        "Tư duy logic và kỹ thuật xuất sắc",
        "Khả năng giải quyết vấn đề phức tạp",
        "Đam mê công nghệ và lập trình"
      ],
      requiredSkills: ["JavaScript", "React", "Node.js", "Git", "Problem Solving"],
      salaryRange: "15-40 triệu/tháng",
      jobTitles: ["Frontend Developer", "Backend Developer", "Full-stack Developer"],
      description: "Phát triển phần mềm và ứng dụng web",
      pathTimeline: [
        {
          phase: "Giai đoạn 1: Basics (0-4 tháng)",
          duration: "4 tháng",
          tasks: ["HTML/CSS/JS", "Git basics", "Build 5 projects"]
        },
        {
          phase: "Giai đoạn 2: Framework (4-12 tháng)",
          duration: "8 tháng",
          tasks: ["React/Vue", "Backend basics", "Full-stack project"]
        },
        {
          phase: "Giai đoạn 3: Production (1-2 năm)",
          duration: "1 năm",
          tasks: ["Deploy apps", "Team collaboration", "Code review"]
        }
      ]
    },
    {
      id: "marketing-specialist",
      title: "Marketing Specialist",
      matchPercent: Math.floor(personality.communication * 0.5 + personality.creativity * 0.3 + Math.random() * 15 + 60),
      reasons: [
        "Giao tiếp xuất sắc và thuyết phục",
        "Sáng tạo trong chiến lược marketing",
        "Hiểu insight khách hàng"
      ],
      requiredSkills: ["Digital Marketing", "Google Ads", "Facebook Ads", "Analytics", "Strategy"],
      salaryRange: "12-28 triệu/tháng",
      jobTitles: ["Digital Marketer", "Performance Marketer", "Marketing Manager"],
      description: "Xây dựng và triển khai chiến lược marketing",
      pathTimeline: [
        {
          phase: "Giai đoạn 1: Foundation (0-3 tháng)",
          duration: "3 tháng",
          tasks: ["Marketing cơ bản", "Google Analytics", "Run ads nhỏ"]
        },
        {
          phase: "Giai đoạn 2: Execution (3-12 tháng)",
          duration: "9 tháng",
          tasks: ["Multi-channel campaigns", "ROI optimization", "Brand strategy"]
        },
        {
          phase: "Giai đoạn 3: Strategy (1-2 năm)",
          duration: "1 năm",
          tasks: ["Lead campaigns", "Team management", "Growth hacking"]
        }
      ]
    }
  ];

  // Sort by match percentage
  return allCareers.sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 5);
}

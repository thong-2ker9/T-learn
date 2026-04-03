import { useState } from "react";
import { EducationalBackground } from "./educational-background";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!agreeTerms) {
      newErrors.terms = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      // Check if email already exists
      const users = JSON.parse(localStorage.getItem("studyai_users") || "{}");
      
      if (users[email]) {
        setErrors({ email: "Email này đã được đăng ký" });
        setIsLoading(false);
        return;
      }

      // Save user data
      users[email] = {
        name,
        password,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("studyai_users", JSON.stringify(users));

      // Auto login after registration
      const authData = {
        email,
        rememberMe: true,
        isLoggedIn: true,
      };
      localStorage.setItem("studyai_auth", JSON.stringify(authData));

      setIsLoading(false);
      onRegisterSuccess();
    }, 800);
  };

  const handleSocialRegister = (provider: "google" | "facebook") => {
    setIsLoading(true);
    // Simulate social registration
    setTimeout(() => {
      const email = `user@${provider}.com`;
      const authData = {
        email,
        rememberMe: true,
        isLoggedIn: true,
        provider,
      };
      
      localStorage.setItem("studyai_auth", JSON.stringify(authData));
      setIsLoading(false);
      onRegisterSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <EducationalBackground variant="primary" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 slide-up">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4 scale-in">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>
          </div>
          <h1 className="text-white mb-2">T-learn</h1>
          <p className="text-white/90">Tạo tài khoản mới</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-center mb-6 text-red-600">Đăng ký</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block mb-2 text-gray-700">Họ tên</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={`pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 mt-1 fade-in">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block mb-2 text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className={`pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 mt-1 fade-in">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block mb-2 text-gray-700">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 mt-1 fade-in">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block mb-2 text-gray-700">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 mt-1 fade-in">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-gray-700 cursor-pointer select-none"
                >
                  Tôi đồng ý với{" "}
                  <span className="text-red-600 hover:underline">Điều khoản sử dụng</span>
                  {" "}và{" "}
                  <span className="text-red-600 hover:underline">Chính sách bảo mật</span>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 mt-1 fade-in">{errors.terms}</p>
              )}
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover-lift"
              disabled={isLoading}
            >
              {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Register */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 hover-lift"
              onClick={() => handleSocialRegister("google")}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng ký bằng Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 hover-lift"
              onClick={() => handleSocialRegister("facebook")}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Đăng ký bằng Facebook
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-red-600 hover:text-red-700 hover:underline"
              disabled={isLoading}
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        .scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hover-lift:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
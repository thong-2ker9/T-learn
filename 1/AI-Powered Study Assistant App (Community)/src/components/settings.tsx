import { useState } from "react";
import { User, Lock, LogOut, Mail } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner@2.0.3";

interface SettingsProps {
  userName: string;
  onLogout: () => void;
}

export function Settings({ userName, onLogout }: SettingsProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: userName,
    email: "student@example.com",
    phone: "0123456789",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile:", profileData);
    setIsEditingProfile(false);
    toast.success("Đã lưu thông tin cá nhân!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    console.log("Changing password");
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast.success("Đã đổi mật khẩu thành công!");
  };

  return (
    <div className="space-y-6 animate-fade-in w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <h1 className="text-2xl text-gray-800">Cài đặt</h1>

      {/* Profile Section */}
      <Card className="border-0 shadow-lg rounded-3xl bg-white">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6 mb-8">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-500 text-white text-3xl">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl mb-1 text-gray-800">{userName}</h2>
              <p className="mb-2 text-gray-600">Học sinh</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                {isEditingProfile ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
              </Button>
            </div>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="pl-10 rounded-2xl"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="pl-10 rounded-2xl"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Số điện thoại</label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="rounded-2xl"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl py-6"
                >
                  Lưu thay đổi
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 rounded-2xl py-6"
                >
                  Hủy
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gray-50">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-800">{profileData.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gray-50">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="text-gray-800">{profileData.phone}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card className="border-0 shadow-lg rounded-3xl bg-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg mb-1 text-gray-800">Đổi mật khẩu</h3>
              <p className="text-sm text-gray-600">Cập nhật mật khẩu của bạn</p>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                onClick={() => setIsChangingPassword(true)}
                className="rounded-2xl"
              >
                Đổi mật khẩu
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Mật khẩu hiện tại</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="pl-10 rounded-2xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="pl-10 rounded-2xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="pl-10 rounded-2xl"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl py-6"
                >
                  Cập nhật mật khẩu
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="flex-1 rounded-2xl py-6"
                >
                  Hủy
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Logout Section */}
      <Card className="border-0 shadow-lg rounded-3xl bg-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg mb-1 text-gray-800">Đăng xuất</h3>
              <p className="text-sm text-gray-600">Thoát khỏi tài khoản của bạn</p>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="rounded-2xl text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
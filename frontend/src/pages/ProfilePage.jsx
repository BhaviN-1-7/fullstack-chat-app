import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { colorThemes } from "../lib/themes";
import {Spinner} from "../components/Spinner.jsx";
import Header from "../components/Header.jsx";

function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfile, currentThemeIndex } = useAuthStore();
  const earthyTheme = colorThemes[currentThemeIndex];
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
      toast.success("Profile picture updated");
    };
  };

  const memberSince = authUser?.memberSince || "April 11, 2025";
  const status = authUser?.status || "Online";

  if (!authUser) {
    return <div style={{ color: earthyTheme.text }}>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1 flex relative">
        {/* Background sections */}
        <div
          className="w-1/2 h-full absolute left-0 top-0"
          style={{ backgroundColor: earthyTheme.leftBg }}
        />
        <div
          className="w-1/2 h-full absolute right-0 top-0"
          style={{ backgroundColor: earthyTheme.rightBg }}
        />
        
        {/* Card container with adjusted vertical centering */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-4 px-4 relative z-10">
          {/* Profile Card - Larger */}
          <div className="relative w-full max-w-2xl rounded-xl shadow-lg p-8 mb-6 border overflow-hidden"
            style={{
              borderColor: earthyTheme.border,
              color: earthyTheme.text,
              minHeight: '320px'
            }}
          >
            {/* Split background */}
            <div className="absolute inset-0 -z-10">
              <div 
                className="absolute left-0 top-0 h-full w-1/2"
                style={{ backgroundColor: earthyTheme.rightBg }}
              />
              <div 
                className="absolute right-0 top-0 h-full w-1/2"
                style={{ backgroundColor: earthyTheme.leftBg }}
              />
            </div>
            
            <div className="flex flex-col h-full">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold">
                  Profile
                  <span style={{ color: earthyTheme.accent }}>.</span>
                </h2>
              </div>

              <div className="flex flex-1 gap-8">
                {/* Profile image section */}
                <div className="flex flex-col items-center w-1/3">
                  <div className="relative mb-4">
                    <div
                      className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: earthyTheme.border }}
                    >
                      {selectedImage || authUser.profilePic ? (
                        <img
                          src={selectedImage || authUser.profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-14 h-14" style={{ color: earthyTheme.text }} />
                      )}
                    </div>
                    <label
                      htmlFor="profilePicInput"
                      className={`absolute bottom-0 right-0 bg-opacity-90 rounded-full cursor-pointer p-2 transition-all duration-200
                        ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                      style={{ 
                        backgroundColor: earthyTheme.accent,
                        transform: "translate(25%, 25%)"
                      }}
                    >
                     {isUpdatingProfile ? (
                        <Spinner 
                          size={20} 
                          color={earthyTheme.leftBg} 
                        />
                      ) : (
                        <Camera
                          className="w-5 h-5"
                          style={{ color: earthyTheme.leftBg }}
                        />
                      )}
                      <input
                        id="profilePicInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUpdatingProfile}
                      />
                    </label>
                  </div>
                  <p className="text-sm opacity-80 text-center">
                    Click to update profile photo
                  </p>
                </div>

                {/* Info fields */}
                <div className="flex-1 space-y-5">
                  <div>
                    <label className="block text-lg font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={authUser.fullName}
                        className="w-full h-12 pl-12 rounded-lg text-base"
                        style={{
                          backgroundColor: earthyTheme.leftBg,
                          borderColor: earthyTheme.border,
                          color: earthyTheme.text,
                        }}
                        disabled
                      />
                      <User
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                        style={{ color: earthyTheme.text + "80" }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-lg font-medium mb-2">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={authUser.email}
                        className="w-full h-12 pl-12 rounded-lg text-base"
                        style={{
                          backgroundColor: earthyTheme.leftBg,
                          borderColor: earthyTheme.border,
                          color: earthyTheme.text,
                        }}
                        disabled
                      />
                      <Mail
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                        style={{ color: earthyTheme.text + "80" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Card - Larger */}
          <div className="relative w-full max-w-2xl rounded-xl shadow-lg p-8 border overflow-hidden"
            style={{
              borderColor: earthyTheme.border,
              color: earthyTheme.text,
              minHeight: '220px'
            }}
          >
            {/* Split background */}
            <div className="absolute inset-0 -z-10">
              <div 
                className="absolute left-0 top-0 h-full w-1/2"
                style={{ backgroundColor: earthyTheme.rightBg }}
              />
              <div 
                className="absolute right-0 top-0 h-full w-1/2"
                style={{ backgroundColor: earthyTheme.leftBg }}
              />
            </div>
            
            <div className="h-full flex flex-col">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold">
                  Account
                  <span style={{ color: earthyTheme.accent }}>.</span>
                </h2>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-6">
                <div className="p-4 rounded-lg flex flex-col justify-center"
                  style={{ backgroundColor: earthyTheme.leftBg }}>
                  <span className="text-sm opacity-80 mb-1">Member Since</span>
                  <span className="text-lg font-medium">{memberSince}</span>
                </div>
                
                <div className="p-4 rounded-lg flex flex-col justify-center"
                  style={{ backgroundColor: earthyTheme.leftBg }}>
                  <span className="text-sm opacity-80 mb-1">Status</span>
                  <span className="text-lg font-medium">{status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { colorThemes } from "../lib/themes";

//const earthyTheme=currentTheme;
// const earthyTheme = {
//   leftBg: "#181C14",
//   rightBg: "#3C3D37",
//   card: "#697565",
//   accent: "#ECDFCC",
//   text: "#ECDFCC",
//   border: "#3C3D37",
//   navLeft: "#181C14",
//   navRight: "#3C3D37",
// };

function ProfilePage() {
  const { authUser,isUpdatingProfile, updateProfile,currentThemeIndex} = useAuthStore();
  const earthyTheme=colorThemes[currentThemeIndex];
  const [selectedImage,setSelectedImage]=useState(null);
  //


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // const allowedTypes = ["image/jpeg", "image/png"];
    // if (!allowedTypes.includes(file.type)) {
    //   toast.error("Only JPEG or PNG images are allowed");
    //   return;
    // }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {

      const base64Image=reader.result;
      setSelectedImage(base64Image);


      await updateProfile({profilePic:base64Image});
      toast.success("Image preview updated (not uploaded yet)");
    };
  };

  const handleInputChange = (e) => {

  };

  const memberSince = authUser?.memberSince || "April 11, 2025";
  const status = authUser?.status || "Online";

  if (!authUser) {
    return <div style={{ color: earthyTheme.text }}>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
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
        
        {/* Card container with proper vertical centering */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10">
          {/* Profile Card - Wider with better spacing */}
          <div
            className="w-full max-w-md rounded-xl shadow-lg p-5 mb-4 border"
            style={{
              backgroundColor: earthyTheme.card,
              borderColor: earthyTheme.border,
              color: earthyTheme.text,
            }}
          >
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold">
                Profile
                <span style={{ color: earthyTheme.accent }}>.</span>
              </h2>
            </div>

            {/* Profile image section centered above inputs */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mb-2"
                  style={{ backgroundColor: earthyTheme.border }}
                >
                  {selectedImage || authUser.profilePic ? (
                    <img
                      src={selectedImage || authUser.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10" style={{ color: earthyTheme.text }} />
                  )}
                </div>
                <label
                  htmlFor="profilePicInput"
                  className={`absolute bottom-2 right-1.5 bg-opacity-90 rounded-full cursor-pointer p-1.5 transition-all duration-200
                ${isUpdatingProfile?"animate-pulse pointer-events-none":""}`}
                  style={{ 
                    backgroundColor: earthyTheme.accent,
                    transform: "translate(25%, 25%)"
                  }}
                >
                  <Camera
                    className="w-4 h-4"
                    style={{ color: earthyTheme.leftBg }}
                  />
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
              <p className="text-xs opacity-80 mt-1">
                Click the camera icon to update photo
              </p>
            </div>

            {/* Info fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={authUser.fullName}
                    onChange={handleInputChange}
                    className="w-full h-9 pl-9 rounded text-sm"
                    style={{
                      backgroundColor: earthyTheme.leftBg,
                      borderColor: earthyTheme.border,
                      color: earthyTheme.text,
                    }}
                    disabled
                  />
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: earthyTheme.text + "80" }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={authUser.email}
                    onChange={handleInputChange}
                    className="w-full h-9 pl-9 rounded text-sm"
                    style={{
                      backgroundColor: earthyTheme.leftBg,
                      borderColor: earthyTheme.border,
                      color: earthyTheme.text,
                    }}
                    disabled
                  />
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: earthyTheme.text + "80" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Card - Wider */}
          <div
            className="w-full max-w-md rounded-xl shadow-lg p-5 border"
            style={{
              backgroundColor: earthyTheme.card,
              borderColor: earthyTheme.border,
              color: earthyTheme.text,
            }}
          >
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold">
                Account
                <span style={{ color: earthyTheme.accent }}>.</span>
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-3 py-2 rounded text-sm"
                style={{ backgroundColor: earthyTheme.leftBg }}>
                <span className="opacity-80">Member Since</span>
                <span>{memberSince}</span>
              </div>
              
              <div className="flex justify-between items-center px-3 py-2 rounded text-sm"
                style={{ backgroundColor: earthyTheme.leftBg }}>
                <span className="opacity-80">Status</span>
                <span>{status}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
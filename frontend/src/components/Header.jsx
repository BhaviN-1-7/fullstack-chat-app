import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { colorThemes } from "../lib/themes.js";
// console.log("Current Theme in Header:", currentTheme);
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

function Header() {
  const { logout, authUser,currentThemeIndex } = useAuthStore();
  const earthyTheme=colorThemes[currentThemeIndex];
  return (
    <header
      className="w-full h-16 flex relative transition-all duration-300"
      style={{ backgroundColor: earthyTheme.navLeft }}
    >
      {/* Left Nav Section */}
      <div className="flex-1 flex items-center justify-between p-4">
        <Link to="/">
          <div className="flex items-center gap-2">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: earthyTheme.card }}
            >
              <MessageSquare
                className="h-5 w-5"
                style={{ color: earthyTheme.text }}
              />
            </div>
            <h1
              className="text-xl font-medium hidden sm:block" // Hide title on very small screens
              style={{ color: earthyTheme.text }}
            >
              ChatApp.
            </h1>
          </div>
        </Link>
      </div>

      {/* Right Nav Section */}
      <div
        className="flex-1 flex items-center justify-end p-4 transition-colors duration-300"
        style={{ backgroundColor: earthyTheme.navRight }}
      >
        <div className="flex items-center gap-4">
          <Link
            to="/settings"
            className="flex items-center gap-1 transition-opacity duration-300 hover:opacity-80"
            style={{ color: earthyTheme.text }}
          >
            <Settings className="h-5 w-5" />
            <span className="hidden md:inline">Settings</span> {/* Hide text below md */}
          </Link>

          {authUser && (
            <Link
              to="/profile"
              className="flex items-center gap-1 transition-opacity duration-300 hover:opacity-80"
              style={{ color: earthyTheme.text }}
            >
              <User className="h-5 w-5" />
              <span className="hidden md:inline">Profile</span> {/* Hide text below md */}
            </Link>
          )}

          {authUser && (
            <button
              className="flex items-center gap-1 transition-opacity duration-300 hover:opacity-80"
              style={{ color: earthyTheme.text }}
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline">Logout</span> {/* Hide text below md */}
            </button>
          )}
        </div>
      </div>

      {/* Diagonal Divider */}
      <div className="absolute top-0 right-1/2 h-full w-16 overflow-hidden transform -translate-x-8 hidden md:block">
        <div
          className="absolute top-0 left-0 w-full h-full transform -skew-x-12 origin-top-left transition-colors duration-300"
          style={{ backgroundColor: earthyTheme.navLeft }}
        />
      </div>
      <div className="absolute top-0 left-1/2 h-full w-16 overflow-hidden transform translate-x-8 hidden md:block">
        <div
          className="absolute top-0 right-0 w-full h-full transform skew-x-12 origin-top-right transition-colors duration-300"
          style={{ backgroundColor: earthyTheme.navRight }}
        />
      </div>
    </header>
  );
}

export default Header;
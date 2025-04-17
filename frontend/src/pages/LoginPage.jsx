import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Mail, Lock, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

import { toast } from "react-hot-toast";
import { colorThemes } from "../lib/themes";
import Header from "../components/Header";

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

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {currentThemeIndex}=useAuthStore();
    const earthyTheme=colorThemes[currentThemeIndex];
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      login(formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Component */}
      <Header/>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Left Side - Form */}
        <div
          className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 transition-colors duration-300"
          style={{ backgroundColor: earthyTheme.leftBg }}
        >
          <div
            className="w-full max-w-md rounded-xl shadow-lg p-8 border transition-colors duration-300"
            style={{
              backgroundColor: earthyTheme.card,
              borderColor: earthyTheme.border,
              color: earthyTheme.text,
            }}
          >
            <div className="mb-8">
              <p
                className="uppercase text-sm font-medium tracking-wider transition-colors duration-300"
                style={{ color: earthyTheme.accent }}
              >
                WELCOME BACK
              </p>
              <h2 className="text-3xl font-bold mt-2">
                Log in to your account
                <span style={{ color: earthyTheme.accent }}>.</span>
              </h2>
              <p className="opacity-80 mt-2">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="transition-colors duration-300 hover:underline"
                  style={{ color: earthyTheme.accent }}
                >
                  Sign Up
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full h-12 pl-10 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
                  style={{
                    backgroundColor: earthyTheme.leftBg,
                    borderColor: earthyTheme.border,
                    color: earthyTheme.text,
                    placeholder: earthyTheme.text + "80",
                    focusRingColor: earthyTheme.accent,
                  }}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300"
                  style={{ color: earthyTheme.text + "80" }}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-12 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300"
                  style={{
                    backgroundColor: earthyTheme.leftBg,
                    borderColor: earthyTheme.border,
                    color: earthyTheme.text,
                    placeholder: earthyTheme.text + "80",
                    focusRingColor: earthyTheme.accent,
                  }}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300"
                  style={{ color: earthyTheme.text + "80" }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 hover:opacity-70"
                  style={{ color: earthyTheme.text + "80" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Login Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-1/2 h-9 rounded-lg flex items-center justify-center transition-colors duration-300 hover:opacity-95"
                  style={{
                    backgroundColor: earthyTheme.accent,
                    color: earthyTheme.leftBg,
                  }}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div
          className="hidden lg:block w-1/2 relative transition-colors duration-300"
          style={{ backgroundColor: earthyTheme.rightBg }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md">
              <MessageSquare
                className="h-12 w-12 mb-6 transition-colors duration-300"
                style={{ color: earthyTheme.accent }}
              />
              <h2 className="text-4xl font-bold mb-4">Welcome back</h2>
              <p className="text-lg opacity-80">
                Log in to connect with friends, share moments, and stay in touch.
              </p>
            </div>
          </div>
          <div className="absolute bottom-6 right-6">
            <div className="flex space-x-2">
              <div
                className="w-10 h-10 rounded transition-colors duration-300"
                style={{ backgroundColor: earthyTheme.card }}
              ></div>
              <div
                className="w-10 h-10 rounded transition-colors duration-300"
                style={{ backgroundColor: earthyTheme.card }}
              ></div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: earthyTheme.card }}
              >
                <div
                  className="w-5 h-5 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: earthyTheme.accent }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
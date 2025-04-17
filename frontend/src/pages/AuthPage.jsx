import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaCog, FaSun, FaMoon, FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleAuthMode = () => setIsLogin(!isLogin);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">AppLogo</h1>
        </div>
        <div className="relative">
          <button 
            onClick={toggleSettings}
            className="btn btn-ghost btn-circle"
          >
            <FaCog className="text-xl" />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 mt-2 w-48 bg-base-100 shadow-lg rounded-box p-2 z-10">
              <div className="p-2">
                <label className="cursor-pointer label justify-start gap-2">
                  <span>Dark Mode</span>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1">
        {/* Auth Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {isLogin ? (
              <>
                <h2 className="text-3xl font-bold mb-6">Sign In</h2>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <label className="input-group">
                      <span><FaEnvelope /></span>
                      <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="input input-bordered w-full" 
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <label className="input-group">
                      <span><FaLock /></span>
                      <input 
                        type="password" 
                        placeholder="********" 
                        className="input input-bordered w-full" 
                      />
                    </label>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="cursor-pointer label">
                      <input type="checkbox" className="checkbox checkbox-primary" />
                      <span className="label-text ml-2">Remember me</span>
                    </label>
                    <a href="#" className="text-sm link link-primary">Forgot password?</a>
                  </div>
                  <button className="btn btn-primary w-full mt-4">Sign In</button>
                </div>
                <div className="divider">OR</div>
                <div className="flex justify-center gap-4">
                  <button className="btn btn-outline btn-circle">
                    <FaGoogle />
                  </button>
                  <button className="btn btn-outline btn-circle">
                    <FaGithub />
                  </button>
                  <button className="btn btn-outline btn-circle">
                    <FaFacebook />
                  </button>
                </div>
                <p className="mt-4 text-center">
                  Don't have an account?{' '}
                  <button onClick={toggleAuthMode} className="link link-primary">
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-6">Create Account</h2>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <label className="input-group">
                      <span><FaUser /></span>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="input input-bordered w-full" 
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <label className="input-group">
                      <span><FaEnvelope /></span>
                      <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="input input-bordered w-full" 
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <label className="input-group">
                      <span><FaLock /></span>
                      <input 
                        type="password" 
                        placeholder="********" 
                        className="input input-bordered w-full" 
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Confirm Password</span>
                    </label>
                    <label className="input-group">
                      <span><FaLock /></span>
                      <input 
                        type="password" 
                        placeholder="********" 
                        className="input input-bordered w-full" 
                      />
                    </label>
                  </div>
                  <label className="cursor-pointer label justify-start gap-2">
                    <input type="checkbox" className="checkbox checkbox-primary" />
                    <span className="label-text">I agree to the terms and conditions</span>
                  </label>
                  <button className="btn btn-primary w-full mt-4">Sign Up</button>
                </div>
                <p className="mt-4 text-center">
                  Already have an account?{' '}
                  <button onClick={toggleAuthMode} className="link link-primary">
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Design Section */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-8">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-xl mb-8">
              {isLogin 
                ? "Sign in to access your personalized dashboard and features."
                : "Join our community and unlock amazing features today!"}
            </p>
            <div className="relative w-64 h-64 mx-auto">
              <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full blur-xl"></div>
              <div className="absolute inset-4 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <div className="text-6xl">
                  {isLogin ? "🔑" : "✨"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
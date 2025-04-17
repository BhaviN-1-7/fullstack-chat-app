import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User } from "lucide-react";
import Header from "../components/Header";
import { colorThemes } from "../lib/themes";

function SettingsPage() {
  const { currentThemeIndex, setTheme } = useAuthStore();
  const currentTheme = colorThemes[currentThemeIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1 flex relative">
        {/* Background sections */}
        <div
          className="w-1/2 h-full absolute left-0 top-0"
          style={{ backgroundColor: currentTheme.leftBg }}
        />
        <div
          className="w-1/2 h-full absolute right-0 top-0"
          style={{ backgroundColor: currentTheme.rightBg }}
        />
        
        {/* Centered Content with Split Background Card */}
        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="relative w-full max-w-2xl rounded-xl shadow-lg border overflow-hidden"
            style={{
              borderColor: currentTheme.border,
              color: currentTheme.text,
            }}
          >
            {/* Split background */}
            <div className="absolute inset-0 -z-10">
              <div 
                className="absolute left-0 top-0 h-full w-1/2"
                style={{ backgroundColor: currentTheme.rightBg }}
              />
              <div 
                className="absolute right-0 top-0 h-full w-1/2"
                style={{ backgroundColor: currentTheme.leftBg }}
              />
            </div>
            
            <div className="p-6">
              {/* Header */}
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold">
                  Theme Settings
                  <span style={{ color: currentTheme.accent }}>.</span>
                </h2>
                <p className="text-sm opacity-80 mt-2">
                  Customize your chat experience
                </p>
              </div>

              {/* Enhanced Theme Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span>Choose Theme</span>
                  <span style={{ color: currentTheme.accent }}>→</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {colorThemes.map((theme, index) => (
                    <button
                      key={index}
                      onClick={() => setTheme(index)}
                      className={`p-3 rounded-lg transition-all duration-300 border flex items-center justify-between
                        ${currentThemeIndex === index ? "ring-2 ring-offset-2" : "hover:opacity-90"}`}
                      style={{
                        backgroundColor: theme.card + "60",
                        borderColor: currentThemeIndex === index ? theme.accent : theme.border,
                        color: theme.text,
                        ringColor: theme.accent,
                      }}
                    >
                      <span className="font-medium">Theme {index + 1}</span>
                      <div className="flex gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ 
                            backgroundColor: theme.leftBg,
                            borderColor: theme.border
                          }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ 
                            backgroundColor: theme.rightBg,
                            borderColor: theme.border
                          }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ 
                            backgroundColor: theme.accent,
                            borderColor: theme.border
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Preview Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span>Live Preview</span>
                  <span style={{ color: currentTheme.accent }}>→</span>
                </h3>
                <div className="space-y-6">
                  {/* Chat Preview */}
                  <div 
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: currentTheme.card + "40",
                      borderColor: currentTheme.border
                    }}
                  >
                    <div className="space-y-3">
                      {/* User 1 Message */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center border flex-shrink-0"
                          style={{ 
                            backgroundColor: currentTheme.card,
                            borderColor: currentTheme.border
                          }}
                        >
                          <User
                            className="w-5 h-5"
                            style={{ color: currentTheme.text }}
                          />
                        </div>
                        <div
                          className="p-3 rounded-lg max-w-xs"
                          style={{
                            backgroundColor: currentTheme.leftBg,
                            color: currentTheme.text,
                            borderColor: currentTheme.border
                          }}
                        >
                          <p className="text-sm">Hey there! How's your day going?</p>
                          <p className="text-xs opacity-70 mt-1 text-right">10:30 AM</p>
                        </div>
                      </div>
                      
                      {/* User 2 Message */}
                      <div className="flex items-start gap-3 justify-end">
                        <div
                          className="p-3 rounded-lg max-w-xs"
                          style={{
                            backgroundColor: currentTheme.accent,
                            color: currentTheme.leftBg,
                            borderColor: currentTheme.border
                          }}
                        >
                          <p className="text-sm">Great! Just finished my project.</p>
                          <p className="text-xs opacity-70 mt-1 text-right">10:32 AM</p>
                        </div>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center border flex-shrink-0"
                          style={{ 
                            backgroundColor: currentTheme.card,
                            borderColor: currentTheme.border
                          }}
                        >
                          <User
                            className="w-5 h-5"
                            style={{ color: currentTheme.text }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Theme Info */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded text-center" style={{ backgroundColor: currentTheme.leftBg }}>
                      Primary
                    </div>
                    <div className="p-2 rounded text-center" style={{ 
                      backgroundColor: currentTheme.rightBg,
                      color: currentTheme.text
                    }}>
                      Secondary
                    </div>
                    <div className="p-2 rounded text-center" style={{ 
                      backgroundColor: currentTheme.accent,
                      color: currentTheme.leftBg
                    }}>
                      Accent
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
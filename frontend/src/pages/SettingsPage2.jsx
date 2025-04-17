import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User } from "lucide-react";
import Header from "../components/Header";
import { colorThemes } from "../lib/themes";

function SettingsPage() {
  const { currentThemeIndex, setTheme } = useAuthStore();
  const currentTheme = colorThemes[currentThemeIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex relative">
        {/* Left Background */}
        <div
          className="w-1/2 h-full absolute left-0 top-0"
          style={{ backgroundColor: currentTheme.leftBg }}
        />
        {/* Right Background */}
        <div
          className="w-1/2 h-full absolute right-0 top-0"
          style={{ backgroundColor: currentTheme.rightBg }}
        />
        {/* Centered Content */}
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div
            className="w-full max-w-lg rounded-xl shadow-lg p-6 border transition-colors duration-300"
            style={{
              backgroundColor: currentTheme.card,
              borderColor: currentTheme.border,
              color: currentTheme.text,
            }}
          >
            {/* Theme Selection */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center">
                Settings
                <span style={{ color: currentTheme.accent }}>.</span>
              </h2>
              <p className="text-sm opacity-80 text-center mt-1">
                Choose your theme
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {colorThemes.map((theme, index) => (
                  <button
                    key={index}
                    onClick={() => setTheme(index)}
                    className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                      currentThemeIndex === index
                        ? "border-2"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      backgroundColor:
                        currentThemeIndex === index
                          ? currentTheme.accent + "20" // Slight highlight for selected
                          : "transparent",
                      borderColor:
                        currentThemeIndex === index
                          ? currentTheme.accent
                          : currentTheme.border,
                    }}
                  >
                    <span>Theme {index + 1}</span>
                    <div className="flex gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.leftBg }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.rightBg }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.card }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <h3 className="text-lg font-bold mb-3">
                Preview
                <span style={{ color: currentTheme.accent }}>.</span>
              </h3>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: currentTheme.rightBg }}
              >
                <div className="space-y-3">
                  {/* User 1 Message */}
                  <div className="flex items-start gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.card }}
                    >
                      <User
                        className="w-5 h-5"
                        style={{ color: currentTheme.text }}
                      />
                    </div>
                    <div
                      className="p-2 rounded-lg max-w-xs"
                      style={{
                        backgroundColor: currentTheme.leftBg,
                        color: currentTheme.text,
                      }}
                    >
                      <p className="text-sm">Hey, how’s it going?</p>
                    </div>
                  </div>
                  {/* User 2 Message */}
                  <div className="flex items-start gap-2 justify-end">
                    <div
                      className="p-2 rounded-lg max-w-xs"
                      style={{
                        backgroundColor: currentTheme.accent,
                        color: currentTheme.leftBg,
                      }}
                    >
                      <p className="text-sm">Pretty good, thanks!</p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.card }}
                    >
                      <User
                        className="w-5 h-5"
                        style={{ color: currentTheme.text }}
                      />
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
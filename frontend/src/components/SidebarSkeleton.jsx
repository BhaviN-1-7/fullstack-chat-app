import { useAuthStore } from "../store/useAuthStore";
import { colorThemes } from "../lib/themes";

export const SidebarSkeleton = () => {
  const { currentThemeIndex } = useAuthStore();
  const theme = colorThemes[currentThemeIndex];
  
  return (
    <div 
      className={`w-full md:w-1/3 lg:w-1/4 border-r flex flex-col p-4`}
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
    >
      {/* Search Skeleton */}
      <div className="mb-4">
        <div 
          className="h-10 rounded-lg animate-pulse"
          style={{ backgroundColor: theme.leftBg + "80" }}
        />
      </div>

      {/* Chats List Skeleton */}
      <div className="flex-1 overflow-y-auto space-y-3">
        <div 
          className="h-6 w-1/3 rounded animate-pulse mb-4"
          style={{ backgroundColor: theme.accent + "40" }}
        />
        
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div 
              className="h-12 w-12 rounded-full animate-pulse"
              style={{ backgroundColor: theme.leftBg + "80" }}
            />
            <div className="flex-1 space-y-2">
              <div 
                className="h-4 w-3/4 rounded animate-pulse"
                style={{ backgroundColor: theme.leftBg + "80" }}
              />
              <div 
                className="h-3 w-1/2 rounded animate-pulse"
                style={{ backgroundColor: theme.leftBg + "80" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
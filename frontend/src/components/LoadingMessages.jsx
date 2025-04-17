import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { colorThemes } from "../lib/themes";
import { useChatStore } from "../store/useChatStore"; // Import useChatStore
import { Spinner } from "../components/Spinner"; // Assuming a Spinner component exists; adjust path if different

export const LoadingMessages = () => {
  const { currentThemeIndex } = useAuthStore();
  const theme = colorThemes[currentThemeIndex];
  const { isMessagesLoading } = useChatStore(); // Access isMessagesLoading state

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
      {/* Loading Symbol (centered when loading) */}
      {isMessagesLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <Spinner size="lg" color={theme.accent} /> {/* Custom Spinner component */}
        </div>
      )}

      {/* Incoming message skeleton */}
      <div className="flex items-start gap-2">
        <div 
          className="w-8 h-8 rounded-full animate-pulse"
          style={{ backgroundColor: theme.card }}
        />
        <div className="space-y-2 flex-1">
          <div 
            className="h-4 w-3/4 rounded animate-pulse"
            style={{ backgroundColor: theme.card }}
          />
          <div 
            className="h-16 w-full rounded-lg animate-pulse"
            style={{ backgroundColor: theme.card }}
          />
        </div>
      </div>

      {/* Outgoing message skeleton (smaller size) */}
      <div className="flex items-start gap-2 justify-end">
        <div className="space-y-2 flex-1 items-end">
          <div 
            className="h-3 w-1/3 rounded animate-pulse ml-auto"
            style={{ backgroundColor: theme.accent }}
          />
          <div 
            className="h-10 w-2/3 rounded-lg animate-pulse ml-auto"
            style={{ backgroundColor: theme.accent }}
          />
        </div>
        <div 
          className="w-8 h-8 rounded-full animate-pulse"
          style={{ backgroundColor: theme.accent }}
        />
      </div>

      {/* Repeat pattern for more loading items */}
      {[...Array(3)].map((_, i) => (
        <React.Fragment key={i}>
          <div className="flex items-start gap-2">
            <div 
              className="w-8 h-8 rounded-full animate-pulse"
              style={{ backgroundColor: theme.card }}
            />
            <div className="space-y-2 flex-1">
              <div 
                className="h-4 w-2/3 rounded animate-pulse"
                style={{ backgroundColor: theme.card }}
              />
              <div 
                className="h-12 w-full rounded-lg animate-pulse"
                style={{ backgroundColor: theme.card }}
              />
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
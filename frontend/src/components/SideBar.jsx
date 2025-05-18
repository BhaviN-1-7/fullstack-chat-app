import { Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { colorThemes } from "../lib/themes";
import { SidebarSkeleton } from "./SidebarSkeleton";
import { useEffect, useState } from "react";

// Helper function to highlight matching text
const highlightText = (text, query, theme) => {
  if (!query) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <span 
        key={i} 
        style={{ 
          backgroundColor: theme.accent + '40',
          color: theme.accent,
          fontWeight: 'bold',
          padding: '0 2px',
          borderRadius: '2px'
        }}
      >
        {part}
      </span>
    ) : part
  );
};

// Helper function to format message time
const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export const Sidebar = () => {
  const { currentThemeIndex, onlineUsers } = useAuthStore();
  const theme = colorThemes[currentThemeIndex];
  const {
    activeChat,
    setActiveChat,
    isMobile,
    users,
    getUsers,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Format users with enhanced status information
  const chats = users?.map((user) => {
    const isOnline = onlineUsers.includes(user._id);
    
    return {
      id: user._id,
      name: user.fullName,
      lastMessage: user.lastMessage || "No messages yet",
      lastMessageTime: user.lastMessageTime,
      isOnline,
      profilePic: user.profilePic,
    };
  }) || [];

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      chat.name.toLowerCase().includes(searchLower) ||
      chat.lastMessage.toLowerCase().includes(searchLower)
    );
  });

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <div
      className={`${isMobile ? "w-full" : "w-full md:w-1/3 lg:w-1/4"} border-r flex flex-col`}
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
        height: "calc(100vh - 64px)", // Adjust for header height
      }}
    >
      {/* Search Bar */}
      <div className="p-4">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            backgroundColor: theme.leftBg,
            color: theme.text,
          }}
        >
          <Search className="h-5 w-5" style={{ color: theme.text + "80" }} />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full bg-transparent outline-none text-base"
            style={{ color: theme.text }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contacts List */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4"
        style={{
          maxHeight: "calc(100vh - 140px)", // Adjusted for header and search bar
        }}
      >
        <h3
          className="text-lg font-medium mb-3"
          style={{ color: theme.accent }}
        >
          Contacts
        </h3>
        
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            theme={theme}
            isActive={activeChat === chat.id}
            searchQuery={searchQuery}
            onClick={() => {
              const user = users.find((u) => u._id === chat.id);
              setActiveChat(chat.id);
              setSelectedUser(user);
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Extracted Chat List Item Component for better readability
const ChatListItem = ({ chat, theme, isActive, searchQuery, onClick }) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
        isActive ? "bg-opacity-20" : "hover:bg-opacity-10"
      }`}
      style={{
        backgroundColor: isActive ? theme.accent : theme.leftBg + "20",
        color: theme.text,
      }}
      onClick={onClick}
    >
      {/* Profile Picture with Status Indicator */}
      <div className="relative flex-shrink-0">
        {chat.profilePic ? (
          <img
            src={chat.profilePic}
            alt={chat.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: theme.leftBg,
              color: theme.text,
            }}
          >
            {chat.name.charAt(0)}
          </div>
        )}
        <span
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${chat.isOnline ? "animate-pulse" : ""}`}
          style={{
            backgroundColor: chat.isOnline ? "#00FF00" : "#808080",
            borderColor: theme.card,
          }}
          title={chat.status}
        />
      </div>

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium truncate">
            {highlightText(chat.name, searchQuery, theme)}
          </h4>
          <span 
            className="text-xs opacity-70 whitespace-nowrap"
            style={{ color: theme.text + "80" }}
          >
            {formatMessageTime(chat.lastMessageTime)}
          </span>
        </div>
        
        <div className="flex justify-between items-center gap-2">
          <p className="text-sm truncate opacity-80">
            {highlightText(chat.lastMessage, searchQuery, theme)}
          </p>
        </div>
      </div>
    </div>
  );
};
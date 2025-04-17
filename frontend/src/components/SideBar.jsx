import { Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { colorThemes } from "../lib/themes";
import { SidebarSkeleton } from "./SidebarSkeleton";
import { useEffect } from "react";

export const Sidebar = () => {
  const { currentThemeIndex, onlineUsers, getLastOnlineTime } = useAuthStore();
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

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Format users with enhanced status information
  const chats = users?.map((user) => {
    const isOnline = onlineUsers.includes(user._id);
    const lastSeen = isOnline ? null : getLastOnlineTime(user._id);
    
    return {
      id: user._id,
      name: user.fullName,
      lastMessage: user.lastMessage || "last message", // Consider getting this from actual messages
      //unread: user.unreadCount > 0, // Assuming you have unread count
      unread: true,
      isOnline,
      lastSeen,
      profilePic: user.profilePic,
    };
  }) || [];

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <div
      className={`${isMobile ? "w-full" : "w-full md:w-1/3 lg:w-1/4"} border-r flex flex-col`}
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
        height: "100vh",
      }}
    >
      {/* Search Bar */}
      <div className="p-4 mb-4">
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
            disabled
          />
        </div>
      </div>

      {/* Contacts List */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{
          maxHeight: "calc(100vh - 112px)", // Adjusted for better spacing
        }}
      >
        <h3
          className="text-lg font-medium mb-3"
          style={{ color: theme.accent }}
        >
          Contacts
        </h3>
        
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            theme={theme}
            isActive={activeChat === chat.id}
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
const ChatListItem = ({ chat, theme, isActive, onClick }) => {
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
          <h4 className="text-lg font-medium truncate">{chat.name}</h4>
          {!chat.isOnline && chat.lastSeen && (
            <span 
              className="text-xs opacity-70 whitespace-nowrap "
              style={{ color: theme.text + "80" }}
            >
              {chat.lastSeen}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center gap-2">
          <p className={`text-sm truncate ${chat.unread ? "font-medium" : "opacity-80"}`}>
            {chat.lastMessage}
          </p>
          {chat.unread && (
            <div
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: theme.accent }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
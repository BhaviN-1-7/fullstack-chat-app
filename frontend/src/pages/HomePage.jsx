import { useEffect, useRef } from "react";
import { ChevronLeft, Send, MessageSquare } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { colorThemes } from "../lib/themes";
import { useChatStore } from "../store/useChatStore";
import { Sidebar } from "../components/SideBar";
import { LoadingMessages } from "../components/LoadingMessages";
import Header from "../components/Header";
function HomePage() {
  const { currentThemeIndex } = useAuthStore();
  const theme = colorThemes[currentThemeIndex];
  const {
    activeChat,
    setActiveChat,
    isMobile,
    setIsMobile,
    message,
    setMessage,
    handleSendMessage,
    messages,
    getMessages,
    selectedUser,
    users,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();

  const {onlineUsers}=useAuthStore();

  // Handle window resize and initial chat selection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768 && !activeChat && users.length > 0) {
        setActiveChat(users[0]?._id);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Call once initially
    return () => window.removeEventListener("resize", handleResize);
  }, [activeChat, setIsMobile, setActiveChat, users]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      getMessages(activeChat);
      subscribeToMessages();
      return ()=>unsubscribeFromMessages();
    }
  }, [activeChat, getMessages,subscribeToMessages,unsubscribeFromMessages]);

  const messagesContainerRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col" style={{
      backgroundColor: theme.leftBg,
      height: '100vh', // Use full viewport height
      overflow: 'hidden' // Prevent outer scrolling
    }}>
      <Header/>
      {/* Main content area that won't scroll */}
      <div className="flex flex-1 overflow-hidden" style={{
        height: 'calc(100vh - 64px)' // Subtract header height
      }}>
        {/* Sidebar - shown on desktop or when no chat is selected on mobile */}
        {(!isMobile || !activeChat) && <Sidebar />}

        {/* Chat Area - shown on desktop or when chat is selected on mobile */}
        {(!isMobile || activeChat) && (
          <div
            className={`${isMobile ? "w-full" : "flex-1"} flex flex-col`}
            style={{ 
              backgroundColor: theme.rightBg,
              height: '100%'
            }}
          >
            {activeChat ? (
              <>
                {/* Mobile back button */}
                {isMobile && (
                  <div
                    className="p-4 border-b flex items-center shrink-0"
                    style={{
                      borderColor: theme.border,
                      backgroundColor: theme.card,
                    }}
                  >
                    <button
                      onClick={() => setActiveChat(null)}
                      className="flex items-center gap-2"
                      style={{ color: theme.text }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                      <span className="text-lg">Back</span>
                    </button>
                  </div>
                )}

                {/* Chat Header - fixed height */}
                <div 
                  className="p-4 border-b flex items-center justify-between shrink-0" 
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: theme.card }}>
                      {selectedUser?.profilePic ? (
                        <img 
                          src={selectedUser.profilePic} 
                          alt={selectedUser.name} 
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span style={{ color: theme.text }}>
                          {selectedUser?.profilePic || selectedUser?.fullName?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-medium" style={{ color: theme.text }}>
                        {selectedUser?.fullName || "Select a user"}
                      </h2>
                      <span 
                        className="text-sm opacity-80" 
                        style={{ 
                          color: onlineUsers.includes(selectedUser?._id) ? "#00FF00" : "#808080" 
                        }}
                      >
                        {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages Area - scrollable container */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto"
                  style={{
                    scrollBehavior: 'smooth'
                  }}
                >
                  {isMessagesLoading ? (
                    <LoadingMessages />
                  ) : (
                    <div className="p-6 space-y-6">
                      {messages.length > 0 ? (
                        messages.map((msg) => (
                          <MessageItem key={msg._id || msg.id} msg={msg} theme={theme} selUser={selectedUser} />
                        ))
                      ) : (
                        <div className="text-center py-10" style={{ color: theme.text }}>
                          No messages yet. Start the conversation!
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Message Input - fixed height */}
                <div
                  className="p-4 border-t shrink-0"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{
                      backgroundColor: theme.leftBg,
                      color: theme.text,
                    }}
                  >
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent outline-none text-base"
                      style={{ color: theme.text }}
                    />
                    <button
                      type="submit"
                      onClick={handleSendMessage}
                      className="p-2 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                      disabled={!message.trim()}
                    >
                      <Send
                        className="w-6 h-6"
                        style={{ color: theme.leftBg }}
                      />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <EmptyChatState isMobile={isMobile} theme={theme} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// MessageItem and EmptyChatState components remain the same
const MessageItem = ({ msg, theme, selUser }) => {
  const { authUser } = useAuthStore.getState();
  const isCurrentUser = msg.sender === "You" || msg.senderId === authUser?._id;

  return (
    <div className={`flex items-start gap-2 ${isCurrentUser ? "justify-end" : ""}`}>
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.card }}>
          {selUser?.profilePic ?(
            <img
              src={selUser.profilePic}
              alt="Profile-pic"
              className="w-full h-full object-cover rounded-full"
            />
          )
          : selUser?.fullName?.charAt(0) || "U"}
        </div>
      )}
      <div className={`p-3 rounded-lg max-w-xs`}
        style={{
          backgroundColor: isCurrentUser ? theme.accent : theme.card,
          color: isCurrentUser ? theme.leftBg : theme.text,
        }}>
        <p>{msg.text}</p>
        <p className="text-xs opacity-80 mt-1">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

const EmptyChatState = ({ isMobile, theme }) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center p-6 max-w-md">
      <MessageSquare
        className="h-16 w-16 mx-auto mb-4"
        style={{ color: theme.accent }}
      />
      <h3 className="text-2xl font-medium mb-2" style={{ color: theme.text }}>
        {isMobile ? "Select a chat to start messaging" : "No chat selected"}
      </h3>
      <p className="opacity-80 text-base" style={{ color: theme.text }}>
        {isMobile ? "Choose from your conversations" : "Select a conversation from the sidebar"}
      </p>
    </div>
  </div>
);

export default HomePage;
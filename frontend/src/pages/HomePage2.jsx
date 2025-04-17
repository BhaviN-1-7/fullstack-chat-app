import { useState, useEffect } from "react";
import { Search, MessageSquare, ChevronLeft, Send } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { colorThemes } from "../lib/themes";
import { useChatStore } from "../store/useChatStore";

function HomePage() {
  const { currentThemeIndex } = useAuthStore();
  const theme = colorThemes[currentThemeIndex];

  const [searchQuery, setSearchQuery] = useState("");

  const [activeChat, setActiveChat] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);//768,,412

  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768 && !activeChat) {
        setActiveChat(chats[0]?.id); // Auto-select first chat on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chats = [
    { id: 1, name: "Sarah Johnson", lastMessage: "Let's meet at the coffee shop at 3pm", unread: true, time: "2:30 PM", online: true },

    { id: 2, name: "Michael Chen", lastMessage: "typing...", unread: true, time: "2:15 PM", online: false },
    { id: 3, name: "Jessica Williams", lastMessage: "Thanks for your help yesterday!", unread: false, time: "Yesterday", online: true },
    { id: 4, name: "David Rodriguez", lastMessage: "The meeting is scheduled for tomorrow", unread: false, time: "Yesterday", online: false },
    { id: 5, name: "Emily Taylor", lastMessage: "Can you send me the files?", unread: false, time: "Monday", online: true },
  ];

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Filtered Chats:", filteredChats); // Debug log to check filtering

  const messages = {
    1: [
      { id: 1, sender: "Sarah Johnson", text: "Hey there! How's your day going?", time: "10:00 AM" },
      { id: 2, sender: "You", text: "Pretty good! Just finished the design.", time: "10:32 AM" },
      { id: 3, sender: "Sarah Johnson", text: "Let's meet at the coffee shop at 3pm", time: "10:36 AM" },
    ],
    2: [
      { id: 1, sender: "Michael Chen", text: "That's awesome! Can you share a preview?", time: "10:33 AM" },
      { id: 2, sender: "You", text: "Sure, I'll send it over in a bit.", time: "10:36 AM" },
    ],
    3: [{ id: 1, sender: "Jessica Williams", text: "Thanks for your help yesterday!", time: "10:00 AM" }],
    4: [{ id: 1, sender: "David Rodriguez", text: "The meeting is scheduled for tomorrow", time: "10:00 AM" }],
    5: [{ id: 1, sender: "Emily Taylor", text: "Can you send me the files?", time: "10:00 AM" }],
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");
    }
  };


  const {selectedUser}=useChatStore();
  
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: theme.leftBg }}>
      {/* Header is rendered by parent component */}

      <div className="flex flex-1 overflow-hidden">
        {/* Contacts Sidebar - hidden on mobile when chat is open */}
        {(!isMobile || !activeChat) && (
          <div
            className={`${isMobile ? "w-full" : "w-full md:w-1/3 lg:w-1/4"} border-r flex flex-col p-4`}
            style={{
              backgroundColor: theme.card,
              borderColor: theme.border,
            }}
          >
            {/* Search */}
            <div className="mb-4">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ color: theme.text }}
                />
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: theme.accent }}
              >
                Recent Chats
              </h3>
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                    activeChat === chat.id ? "bg-opacity-20" : "hover:bg-opacity-10"
                  }`}
                  style={{
                    backgroundColor:
                      activeChat === chat.id ? theme.accent : theme.leftBg + "20",
                    color: theme.text,
                  }}
                  onClick={() => setActiveChat(chat.id)}
                >
                  {/* put pic in this div */}
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: theme.leftBg,
                      color: theme.text,
                    }}
                  >
                    {chat.name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-medium truncate">{chat.name}</h4>
                      <span className="text-sm opacity-70">{chat.time}</span>
                    </div>
                    <p
                      className={`text-base truncate ${
                        chat.unread ? "font-medium" : "opacity-80"
                      }`}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread && (
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  )}
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: chat.online ? "#00FF00" : "#808080", // Green for online, gray for offline
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area - hidden on mobile when contacts are shown */}
        {(!isMobile || activeChat) && (
          <div
            className={`${isMobile ? "w-full" : "flex-1"} flex flex-col h-[calc(100vh-64px)]`}
            style={{ backgroundColor: theme.rightBg }}
          >
            {activeChat ? (
              <>
                {/* Mobile back button */}
                {isMobile && (
                  <div
                    className="p-4 border-b flex items-center"
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

                {/* Chat Header */}
                <div
                  className="p-4 border-b flex items-center justify-between"
                  style={{
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: theme.card,
                        color: theme.text,
                      }}
                    >
                      {chats.find((c) => c.id === activeChat)?.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">
                        {chats.find((c) => c.id === activeChat)?.name}
                      </h2>
                      <span
                        className="text-sm opacity-80"
                        style={{
                          color: chats.find((c) => c.id === activeChat)?.online
                            ? "#00FF00"
                            : "#808080",
                        }}
                      >
                        {chats.find((c) => c.id === activeChat)?.online
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  className="flex-1 overflow-y-auto p-6 space-y-6"
                  style={{ color: theme.text }}
                >
                  {messages[activeChat]?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2 ${
                        msg.sender === "You" ? "justify-end" : ""
                      }`}
                    >
                      {msg.sender !== "You" && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: theme.card,
                            color: theme.text,
                          }}
                        >
                          {msg.sender.charAt(0)}
                        </div>
                      )}
                      <div
                        className={`p-2 rounded-lg max-w-xs ${
                          msg.sender === "You"
                            ? "bg-accent text-leftBg"
                            : "bg-card text-text"
                        }`}
                        style={{
                          backgroundColor:
                            msg.sender === "You"
                              ? theme.accent
                              : theme.card,
                          color:
                            msg.sender === "You"
                              ? theme.leftBg
                              : theme.text,
                        }}
                      >
                        <p className="text-lg">{msg.text}</p>
                        <p className="text-sm opacity-80 mt-1">{msg.time}</p>
                      </div>
                      {msg.sender === "You" && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: theme.card,
                            color: theme.text,
                          }}
                        >
                          {msg.sender.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div
                  className="p-4 border-t"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.rightBg,
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{
                      backgroundColor: theme.card,
                      color: theme.text,
                    }}
                  >
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent outline-none text-base"
                      style={{ color: theme.text }}
                    />
                    <button
                      type="submit"
                      onClick={handleSendMessage}
                      className="p-2 rounded-full"
                      style={{ backgroundColor: theme.accent }}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
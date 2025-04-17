import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

// Helper to generate temporary IDs for optimistic updates
const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useChatStore = create((set, get) => ({
  // State
  messages: [],
  users: [],
  selectedUser: null,
  activeChat: null,
  message: "",
  isUsersLoading: false,
  isMessagesLoading: false,
  isMobile: window.innerWidth < 768,

  // Actions
  setSelectedUser: (user) => set({ selectedUser: user }),

  setActiveChat: (chatId) => {
    const { users } = get();
    
    const selectedUser = users.find((user) => user._id === chatId);
    set({ activeChat: chatId, selectedUser });
  },

  setMessage: (message) => set({ message }),
  setIsMobile: (isMobile) => set({ isMobile }),
  
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch users";
      toast.error(errorMessage);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true, messages: [] });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to load messages";
      toast.error(errorMessage);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  resetChatState: () => set({
    activeChat: null,
    messages: [],
    message: '',
    selectedUser: null
  }),

  handleSendMessage: async (e) => {
    if (e) e.preventDefault();
    
    const { message: msgText, activeChat } = get();
    if (!msgText.trim() || !activeChat) return;
    
    const { authUser } = useAuthStore.getState();
    const tempId = generateTempId();

    // Create optimistic message
    const optimisticMessage = {
      _id: tempId,
      text: msgText,
      sender: authUser, // Use actual user data for consistency
      senderId: authUser._id,
      receiverId: activeChat,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      status: 'sending'
    };

    // Optimistic update
    set(state => ({
      messages: [...state.messages, optimisticMessage],
      message: ""
    }));

    try {
      const response = await axiosInstance.post(`/messages/send/${activeChat}`, {
        text: msgText,
        senderId: authUser._id,
        receiverId: activeChat
      });

      // Replace optimistic message with server response
      set(state => ({
        messages: state.messages.map(msg => 
          msg._id === tempId ? { ...response.data, status: 'sent' } : msg
        )
      }));

    } catch (error) {
      console.error("Message send error:", error);
      
      // Mark message as failed instead of removing it
      set(state => ({
        messages: state.messages.map(msg => 
          msg._id === tempId ? { ...msg, status: 'failed' } : msg
        )
      }));

      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Failed to send message";
      toast.error(errorMessage);
    }
  },

  //
  subscribeToMessages: ()=>{
    const {selectedUser}=get();
    if(!selectedUser) 
      return;
    
    const socket=useAuthStore.getState().socket;
    
    //optimize this later
    socket.on("newMessage",(newMessage)=>{
      const isMessageSentFromSelectedUser=newMessage.senderId!==selectedUser._id;
      if(isMessageSentFromSelectedUser) return;
      set({
        messages:[...get().messages,newMessage],
      });
    });
  },

  unsubscribeFromMessages:()=>{
    const socket=useAuthStore.getState().socket;
    socket.off("newMessage");
  },

}));
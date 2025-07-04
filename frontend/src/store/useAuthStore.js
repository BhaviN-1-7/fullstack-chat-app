import {create } from "zustand";
import {axiosInstance} from "../lib/axios.js";
import {toast} from "react-hot-toast";
import { useChatStore } from "./useChatStore.js";

import { io } from "socket.io-client";

// const BASE_URL=import.meta.env.MODE?"http://localhost:5001":"/";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    isLoggingIn: false,
    onlineUsers:[],
    lastOnlineTimes: {},

    currentThemeIndex: 0, // Default to Theme 6 - Blue Grey (colorThemes[5])
    socket:null,

    setTheme: (index) => {
        set({ currentThemeIndex: index });
        localStorage.setItem("themeIndex", index);
      },
      // In initial state:
      currentThemeIndex: localStorage.getItem("themeIndex") || 5,


    checkAuth:async()=>{
        try{
            const res=await axiosInstance.get("/auth/check",{withCredentials: true});
            set({authUser:res.data});

            get().connectSocket();

        }catch(error)
        {
            console.log("Error in checkAuth:",error);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },

    signup:async(data)=>{
        set({isSigningUp:true});
        try{
            const res=await axiosInstance.post("/auth/signup",data,{
                withCredentials: true, // Already present
              }); 
            set({authUser:res.data});
            toast.success("Account created successfully");


            get().connectSocket();


        }catch(error)
        {
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp:false});
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data, {
            withCredentials: true,
          });
          set({ authUser: res.data });
          toast.success("Logged in successfully");

          get().connectSocket();

        } catch (error) {
          toast.error(error.response?.data?.message || "Login failed");
        } finally {
          set({ isLoggingIn: false });
        }
      },
    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout",{},{ withCredentials: true });
            set({ authUser: null });

            toast.success("Logged out successfully");
            // console.log(authUser);
            useChatStore.getState().resetChatState();

            get().disconnectSocket();

        }catch(error){
            console.error("Error in logout:", error);
      toast.error(error.response?.data?.message || error.message || "Logout failed");
        }
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try{
            const res=await axiosInstance.put("/auth/update-profile",data)//will upload pic in claudinary and update the user in mongo

            set({authUser:res.data});
            toast.success("profile Updated successfully");
        }catch(error){
            console.log("error in  update profile:",error);
            toast.error("file too large");
        }finally{
            set({isUpdatingProfile:false});
        }
    },

    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected) return;

        const socket=io(BASE_URL,{
            query:{
                userId:authUser._id,
            },
        });

        socket.connect();
        set({socket:socket});

        socket.on("getOnlineUsers", (data)=>{
            set({onlineUsers:data.onlineUsers,
                lastOnlineTimes:data.lastOnlineTimes ||{}
            });
        });
    },

    disconnectSocket:()=>{
        if(get().socket?.connected)
            get().socket.disconnect();
    },

    getLastOnlineTime: (userId) => {
        const { lastOnlineTimes,onlineUsers } = get();
        const lastOnline = lastOnlineTimes[userId];

        if (onlineUsers.includes(userId)) {
            return "Online"; // User is actively online
          }

        if (!lastOnline) return "recently online"; // null means online
        
        const now = new Date();
        const lastOnlineDate = new Date(lastOnline);
        const diffSeconds = Math.floor((now - lastOnlineDate) / 1000);
        
        if (diffSeconds < 60) return "Just now";
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min ago`;
        if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
        return `${Math.floor(diffSeconds / 86400)} days ago`;
      },
}));



// connectSocket: () => {
//     const { authUser } = get();
//     if (!authUser || get().socket?.connected) return;

//     const socket = io(BASE_URL, {
//       query: { userId: authUser._id },
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     socket.on("connect", () => {
//       console.log("Socket connected");
//       // Start heartbeat
//       const interval = setInterval(() => {
//         if (socket.connected) {
//           socket.emit("heartbeat");
//         }
//       }, 20000);
//       set({ heartbeatInterval: interval });
//     });

//     socket.on("getOnlineUsers", (data) => {
//       console.log("Online users update:", data);
//       set({ 
//         onlineUsers: data.onlineUsers,
//         lastOnlineTimes: data.lastOnlineTimes || {}
//       });
      
//       // Cache last online times in localStorage
//       Object.entries(data.lastOnlineTimes || {}).forEach(([userId, time]) => {
//         localStorage.setItem(`lastOnline_${userId}`, time);
//       });
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("Socket disconnected:", reason);
//       if (reason === "io server disconnect") {
//         socket.connect();
//       }
//     });

//     socket.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//     });

//     set({ socket });
//   },

//   disconnectSocket: () => {
//     const { socket, heartbeatInterval } = get();
//     if (heartbeatInterval) {
//       clearInterval(heartbeatInterval);
//       set({ heartbeatInterval: null });
//     }
//     if (socket?.connected) {
//       socket.disconnect();
//     }
//   },

//   getLastOnlineTime: (userId) => {
//     const { lastOnlineTimes, onlineUsers } = get();
    
//     // User is currently online
//     if (onlineUsers.includes(userId)) return "Online";
    
//     // Check server-provided last online time
//     const lastOnline = lastOnlineTimes[userId];
//     if (lastOnline) {
//       return formatTimeDifference(lastOnline);
//     }
    
//     // Fallback to localStorage cache
//     const cachedTime = localStorage.getItem(`lastOnline_${userId}`);
//     if (cachedTime) {
//       return formatTimeDifference(cachedTime);
//     }
    
//     return "Recently online";
//   },
// }));

// // Helper function to format time difference
// function formatTimeDifference(timestamp) {
//   const now = new Date();
//   const lastOnline = new Date(timestamp);
//   const diffSeconds = Math.floor((now - lastOnline) / 1000);
  
//   if (diffSeconds < 60) return "Just now";
//   if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min ago`;
//   if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
//   return `${Math.floor(diffSeconds / 86400)} days ago`;
// }
import { Route, Routes ,Navigate} from 'react-router-dom'
import Header from './components/Header';
import HomePage from "./pages/HomePage";
import SignUpPage2 from "./pages/SignUpPage2";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
//import AuthPage from './pages/AuthPage';
import { useAuthStore } from './store/useAuthStore';

import { useEffect } from 'react';

import {Loader} from "lucide-react";

import {Toaster} from "react-hot-toast";

function App() {

  const {authUser,checkAuth,isCheckingAuth,onlineUsers,lastOnlineTimes,
}=useAuthStore();
  
  console.log({onlineUsers});
  console.log({lastOnlineTimes});
  
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  console.log(authUser);
  
  if(isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
  )
  
  return (
    <div >
    {/* <Header /> */}
    <Routes>
      <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
      <Route path="/signup" element={!authUser?<SignUpPage2/>:<Navigate to="/"/>}/>
      <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>}/>
      <Route path="/settings" element={<SettingsPage/>}/>
      <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>

    </Routes>

    <Toaster/>
    </div>
  )
}
export default App

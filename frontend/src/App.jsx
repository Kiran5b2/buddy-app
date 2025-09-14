import React from 'react'
import { Route, Routes, Navigate } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUp from './pages/signUp.jsx'
import OnBoardingPage from './pages/onBoardingPage.jsx'
import ChatPage from './pages/chatPage.jsx'
import CallPage from './pages/callPage.jsx'
import NotificationPage from './pages/notificationPage.jsx'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import {axiosInstance}  from './lib/axios.js'

const App = () => {

  const { data:authData, isLoading, error } = useQuery({
    queryKey:["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });
  const authUser = authData?.user;

  return (
    <div>
      <Routes>
        <Route path='/' element={ authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to="/" />} />
        <Route path='/onboarding' element={authUser ? <OnBoardingPage /> : <Navigate to="/login" />} />
        <Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path='/call' element={authUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path='/notification' element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App

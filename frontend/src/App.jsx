import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUp from './pages/signUp.jsx'
import OnBoardingPage from './pages/onBoardingPage.jsx'
import ChatPage from './pages/chatPage.jsx'
import CallPage from './pages/callPage.jsx'
import NotificationPage from './pages/notificationPage.jsx'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/onboarding' element={<OnBoardingPage />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/call' element={<CallPage />} />
        <Route path='/notification' element={<NotificationPage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App

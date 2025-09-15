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
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'

const App = () => {

  const {isLoading,authUser} = useAuthUser()

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  if(isLoading){
    return <PageLoader />
  }

  return (
    <div>
      <Routes>
        <Route path='/' element={ isAuthenticated && isOnboarded ? (<HomePage />) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)} />
        <Route path='/login' element={!isAuthenticated ? (<LoginPage />) : (<Navigate to="/" />)} />
        <Route path='/signup' element={!isAuthenticated ? (<SignUp />) : (<Navigate to="/" />)} />
        <Route path='/onboarding' element={isAuthenticated ? (!isOnboarded ? (<OnBoardingPage />) : (<Navigate to="/" />)) : (<Navigate to="/login" />)} />
        <Route path='/chat' element={isAuthenticated ? (<ChatPage />) : (<Navigate to="/login" />)} />
        <Route path='/call' element={isAuthenticated ? (<CallPage />) : (<Navigate to="/login" />)} />
        <Route path='/notification' element={isAuthenticated ? (<NotificationPage />) : (<Navigate to="/login" />) } />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App

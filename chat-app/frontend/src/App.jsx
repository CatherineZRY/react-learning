import React from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log('authUser: ', authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  const getProtectedNeedLoginRoute = (component) => {
    return authUser ? component : <Navigate to="/login" />;
  }

  const getProtectedNeedLogoutRoute = (component) => {
    return !authUser ? component : <Navigate to="/" />;
  }

  return (
    <div>
      <Navbar />
      <div className='container mt-16'>
        <Routes>
          <Route path="/" element={getProtectedNeedLoginRoute(<HomePage />)} />
          <Route path="/signup" element={getProtectedNeedLogoutRoute(<SignupPage />)} />
          <Route path="/login" element={getProtectedNeedLogoutRoute(<LoginPage />)} />
          <Route path="/settings" element={getProtectedNeedLoginRoute(<SettingsPage />)} />
          <Route path="/profile" element={getProtectedNeedLoginRoute(<ProfilePage />)} />
        </Routes>
      </div>

      <Toaster />
    </div>
  )
}

export default App
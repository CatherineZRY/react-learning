import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home  from './Home/Home';
import { Login } from './Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
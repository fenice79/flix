import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Series from './pages/Series';
import Movies from './pages/Movies';
import Watch from './pages/Watch';
import WatchTV from './pages/WatchTV';
import Live from './pages/Live';
import NewAndPopular from './pages/NewAndPopular';
import MyList from './pages/MyList';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/series" element={
            <ProtectedRoute>
              <Series />
            </ProtectedRoute>
          } />
          <Route path="/movies" element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          } />
          <Route path="/watch/:id" element={
            <ProtectedRoute>
              <Watch />
            </ProtectedRoute>
          } />
          <Route path="/watch/tv/:id" element={
            <ProtectedRoute>
              <WatchTV />
            </ProtectedRoute>
          } />
          <Route path="/live" element={
            <ProtectedRoute>
              <Live />
            </ProtectedRoute>
          } />
          <Route path="/new-and-popular" element={
            <ProtectedRoute>
              <NewAndPopular />
            </ProtectedRoute>
          } />
          <Route path="/my-list" element={
            <ProtectedRoute>
              <MyList />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
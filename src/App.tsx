import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Questionnaire from './pages/Questionnaire';
import SQLKit from './pages/SQLKit';
import SavedPlans from './pages/SavedPlans';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/questionnaire" 
                element={
                  <ProtectedRoute>
                    <Questionnaire />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sql-kit/:planId?" 
                element={
                  <ProtectedRoute>
                    <SQLKit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/saved-plans" 
                element={
                  <ProtectedRoute>
                    <SavedPlans />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
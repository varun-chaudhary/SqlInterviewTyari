import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, LogOut, User, BookOpen } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <span className="text-xl font-bold">InterviewTayari SQL Prep</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/questionnaire" className="hover:text-blue-200 transition-colors">
                  New SQL Kit
                </Link>
                <Link to="/saved-plans" className="hover:text-blue-200 transition-colors flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Saved Plans
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center hover:text-blue-200 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
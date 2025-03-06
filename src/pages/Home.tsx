import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Database, CheckCircle, Target, Clock } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          AI-Powered SQL Interview Preparation
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get a personalized SQL practice plan tailored to your experience level, target companies, and available study time.
        </p>
        
        {isAuthenticated ? (
          <div className="mt-8">
            <Link 
              to="/questionnaire" 
              className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your SQL Kit
            </Link>
            <Link 
              to="/saved-plans" 
              className="ml-4 bg-white border border-blue-600 text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              View Saved Plans
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="ml-4 bg-white border border-blue-600 text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Target className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold">Personalized Plans</h2>
          </div>
          <p className="text-gray-600">
            Our AI analyzes your experience, target companies, and goals to create a customized SQL practice plan.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Database className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold">Real-World Questions</h2>
          </div>
          <p className="text-gray-600">
            Practice with SQL questions from actual interviews at top tech companies.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Clock className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold">Track Progress</h2>
          </div>
          <p className="text-gray-600">
            Mark questions as completed and track your progress over time.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="font-semibold mb-2">Complete the Questionnaire</h3>
            <p className="text-gray-600">Tell us about your experience, target companies, and study time.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="font-semibold mb-2">Get Your Custom SQL Kit</h3>
            <p className="text-gray-600">Our AI generates a personalized practice plan with relevant questions.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="font-semibold mb-2">Practice & Track Progress</h3>
            <p className="text-gray-600">Work through your plan and track your progress over time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database, Calendar, CheckCircle, ArrowRight, Trash2 } from 'lucide-react';
import axios from 'axios';

interface SQLPlan {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  questionsCount: number;
  completedCount: number;
}

const SavedPlans: React.FC = () => {
  const [plans, setPlans] = useState<SQLPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/api/sql-plans');
        setPlans(response.data);
      } catch (err) {
        setError('Failed to load saved plans. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;
    
    try {
      await axios.delete(`/api/sql-plans/${planToDelete}`);
      setPlans(plans.filter(plan => plan._id !== planToDelete));
      setShowDeleteModal(false);
      setPlanToDelete(null);
    } catch (err) {
      setError('Failed to delete plan. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Saved SQL Plans</h1>
        <Link 
          to="/questionnaire" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Plan
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {plans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Saved Plans Yet</h2>
          <p className="text-gray-600 mb-6">
            Create your first personalized SQL interview preparation plan to get started.
          </p>
          <Link 
            to="/questionnaire" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Create SQL Kit
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {plans.map(plan => (
            <div key={plan._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{plan.title}</h2>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created on {formatDate(plan.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Database className="h-4 w-4 mr-1" />
                      {plan.questionsCount} Questions
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {plan.completedCount} Completed
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteClick(plan._id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"
                    aria-label="Delete plan"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Link
                  to={`/sql-kit/${plan._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  Continue Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this SQL plan? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPlans;
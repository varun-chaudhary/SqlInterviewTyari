import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Database, CheckCircle, XCircle, BookOpen, AlertCircle, Download, Share2 } from 'lucide-react';
import axios from 'axios';

interface SQLQuestion {
  _id: string;
  title: string;
  difficulty: string;
  company: string;
  description: string;
  sampleInput?: string;
  sampleOutput?: string;
  hint?: string;
  solution?: string;
  completed: boolean;
}

interface SQLPlan {
  _id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  questions: SQLQuestion[];
  questionnaire: any;
}

const SQLKit: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SQLPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<SQLQuestion | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await axios.get(`/api/sql-plans/${planId}`);
        setPlan(response.data);
        if (response.data.questions.length > 0) {
          setActiveQuestion(response.data.questions[0]);
        }
      } catch (err) {
        setError('Failed to load SQL plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    } else {
      setLoading(false);
      setError('No plan ID provided. Please create a new plan or select an existing one.');
    }
  }, [planId]);

  const handleQuestionSelect = (question: SQLQuestion) => {
    setActiveQuestion(question);
    setUserQuery('');
    setFeedback('');
    setShowSolution(false);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserQuery(e.target.value);
  };

  const handleSubmitQuery = async () => {
    if (!userQuery.trim() || !activeQuestion) return;
    
    setFeedbackLoading(true);
    
    try {
      const response = await axios.post('/api/sql-feedback', {
        questionId: activeQuestion._id,
        userQuery
      });
      
      setFeedback(response.data.feedback);
    } catch (err) {
      setFeedback('Error getting feedback. Please try again.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const toggleQuestionCompletion = async (questionId: string, completed: boolean) => {
    try {
      await axios.put(`/api/sql-plans/${planId}/questions/${questionId}`, {
        completed: !completed
      });
      
      // Update local state
      if (plan) {
        const updatedQuestions = plan.questions.map(q => 
          q._id === questionId ? { ...q, completed: !completed } : q
        );
        
        setPlan({
          ...plan,
          questions: updatedQuestions
        });
        
        if (activeQuestion && activeQuestion._id === questionId) {
          setActiveQuestion({
            ...activeQuestion,
            completed: !completed
          });
        }
      }
    } catch (err) {
      console.error('Error updating question status:', err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCompletedCount = () => {
    if (!plan) return 0;
    return plan.questions.filter(q => q.completed).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center text-red-600 mb-4">
          <AlertCircle className="h-8 w-8 mr-2" />
          <h2 className="text-xl font-semibold">Error</h2>
        </div>
        <p className="text-center text-gray-700 mb-6">{error}</p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/questionnaire')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create New SQL Kit
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <p className="text-center text-gray-700">No plan found. Please create a new one.</p>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate('/questionnaire')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create New SQL Kit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">{plan.title}</h1>
        </div>
        
        <p className="text-gray-600 mb-4">{plan.description}</p>
        
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {plan.questions.length} Questions
            </div>
            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              {getCompletedCount()} Completed
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
            <button className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Questions</h2>
          
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {plan.questions.map((question, index) => (
              <div 
                key={question._id}
                onClick={() => handleQuestionSelect(question)}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  activeQuestion?._id === question._id 
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-gray-500 text-sm font-medium">#{index + 1}</span>
                    <h3 className="font-medium text-gray-800">{question.title}</h3>
                  </div>
                  {question.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5"></div> // Empty space for alignment
                  )}
                </div>
                
                <div className="flex items-center mt-2 space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  {question.company && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {question.company}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          {activeQuestion ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{activeQuestion.title}</h2>
                <button
                  onClick={() => toggleQuestionCompletion(activeQuestion._id, activeQuestion.completed)}
                  className={`flex items-center px-3 py-1 rounded-md text-sm ${
                    activeQuestion.completed 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {activeQuestion.completed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </>
                  ) : (
                    'Mark Complete'
                  )}
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(activeQuestion.difficulty)}`}>
                  {activeQuestion.difficulty}
                </span>
                {activeQuestion.company && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {activeQuestion.company}
                  </span>
                )}
              </div>
              
              <div className="prose max-w-none mb-6">
                <p>{activeQuestion.description}</p>
                
                {activeQuestion.sampleInput && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold">Sample Input:</h3>
                    <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto">
                      {activeQuestion.sampleInput}
                    </pre>
                  </div>
                )}
                
                {activeQuestion.sampleOutput && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold">Sample Output:</h3>
                    <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto">
                      {activeQuestion.sampleOutput}
                    </pre>
                  </div>
                )}
                
                {activeQuestion.hint && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <h3 className="text-md font-semibold flex items-center">
                      <AlertCircle className="h-4 w-4 text-blue-500 mr-1" />
                      Hint:
                    </h3>
                    <p className="text-sm text-gray-700">{activeQuestion.hint}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="sqlQuery" className="block text-gray-700 font-medium mb-2">
                  Your SQL Query:
                </label>
                <textarea
                  id="sqlQuery"
                  value={userQuery}
                  onChange={handleQueryChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SELECT * FROM ..."
                ></textarea>
                
                <div className="flex justify-between mt-2">
                  <button
                    onClick={handleSubmitQuery}
                    disabled={feedbackLoading || !userQuery.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {feedbackLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                        Analyzing...
                      </span>
                    ) : (
                      'Get AI Feedback'
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {showSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>
                </div>
              </div>
              
              {feedback && (
                <div className="mb-6 bg-blue-50 p-4 rounded-md">
                  <h3 className="text-md font-semibold mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 text-blue-500 mr-1" />
                    AI Feedback:
                  </h3>
                  <div className="text-gray-700 text-sm whitespace-pre-line">
                    {feedback}
                  </div>
                </div>
              )}
              
              {showSolution && activeQuestion.solution && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-md font-semibold mb-2">Solution:</h3>
                  <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto font-mono">
                    {activeQuestion.solution}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
              <Database className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Select a question to start practicing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SQLKit;
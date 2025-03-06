import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowRight, Briefcase, Clock, Target } from 'lucide-react';
import axios from 'axios';

interface FormData {
  experienceYears: string;
  ctcRange: string;
  targetCompanies: string[];
  otherCompanies: string;
  timeCommitment: string;
  preferredDifficulty: string[];
  focusAreas: string[];
  targetRole: string;
  previousInterviews: boolean;
  previousInterviewFeedback: string;
}

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    experienceYears: '',
    ctcRange: '',
    targetCompanies: [],
    otherCompanies: '',
    timeCommitment: '',
    preferredDifficulty: [],
    focusAreas: [],
    targetRole: 'Data Engineer',
    previousInterviews: false,
    previousInterviewFeedback: '',
  });

  const topCompanies = [
    'Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 
    'Netflix', 'Uber', 'Airbnb', 'LinkedIn', 'Twitter',
    'Salesforce', 'Oracle', 'IBM', 'Adobe', 'Spotify'
  ];

  const focusAreaOptions = [
    'Joins and Relationships', 
    'Aggregations', 
    'Window Functions', 
    'CTEs and Subqueries', 
    'Data Manipulation',
    'Performance Optimization',
    'Database Design',
    'Data Warehousing Concepts'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...(formData[name as keyof FormData] as string[]), value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: (formData[name as keyof FormData] as string[]).filter(item => item !== value)
      });
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Combine selected companies with other companies
      const allTargetCompanies = [
        ...formData.targetCompanies,
        ...formData.otherCompanies.split(',').map(company => company.trim()).filter(company => company !== '')
      ];
      
      const finalFormData = {
        ...formData,
        targetCompanies: allTargetCompanies
      };
      
      const response = await axios.post('/api/sql-plans', finalFormData);
      navigate(`/sql-kit/${response.data._id}`);
    } catch (error) {
      console.error('Error creating SQL plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <ClipboardList className="h-12 w-12 text-blue-600 mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-gray-800">SQL Interview Preparation Questionnaire</h1>
        <p className="text-gray-600 mt-2">
          Help us create a personalized SQL practice plan for your interview preparation
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div 
                  className={`flex-grow h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div className="text-center">
            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Experience & Background
            </span>
          </div>
          <div className="text-center">
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Target Companies
            </span>
          </div>
          <div className="text-center">
            <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Study Preferences
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="experienceYears" className="block text-gray-700 font-medium mb-2">
                Years of Experience in Data/SQL
              </label>
              <select
                id="experienceYears"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select experience level</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-8">5-8 years</option>
                <option value="8+">8+ years</option>
              </select>
            </div>

            <div>
              <label htmlFor="ctcRange" className="block text-gray-700 font-medium mb-2">
                Current CTC Range (Annual in USD)
              </label>
              <select
                id="ctcRange"
                name="ctcRange"
                value={formData.ctcRange}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select CTC range</option>
                <option value="0-60k">Less than $60,000</option>
                <option value="60k-100k">$60,000 - $100,000</option>
                <option value="100k-150k">$100,000 - $150,000</option>
                <option value="150k-200k">$150,000 - $200,000</option>
                <option value="200k+">$200,000+</option>
              </select>
            </div>

            <div>
              <label htmlFor="targetRole" className="block text-gray-700 font-medium mb-2">
                Target Role
              </label>
              <select
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Data Engineer">Data Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Business Intelligence">Business Intelligence</option>
                <option value="Database Administrator">Database Administrator</option>
                <option value="Backend Developer">Backend Developer</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Have you interviewed for SQL positions before?
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="previousInterviews"
                    checked={formData.previousInterviews}
                    onChange={handleBooleanChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
              </div>
            </div>

            {formData.previousInterviews && (
              <div>
                <label htmlFor="previousInterviewFeedback" className="block text-gray-700 font-medium mb-2">
                  What feedback did you receive? Any specific areas to improve?
                </label>
                <textarea
                  id="previousInterviewFeedback"
                  name="previousInterviewFeedback"
                  value={formData.previousInterviewFeedback}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E.g., Need to improve on window functions, joins, etc."
                ></textarea>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Target Companies (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {topCompanies.map(company => (
                  <label key={company} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="targetCompanies"
                      value={company}
                      checked={formData.targetCompanies.includes(company)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{company}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="otherCompanies" className="block text-gray-700 font-medium mb-2">
                Other Target Companies (Comma separated)
              </label>
              <input
                type="text"
                id="otherCompanies"
                name="otherCompanies"
                value={formData.otherCompanies}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E.g., Snowflake, Databricks, Stripe"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="timeCommitment" className="block text-gray-700 font-medium mb-2">
                How much time can you dedicate to SQL preparation per week?
              </label>
              <select
                id="timeCommitment"
                name="timeCommitment"
                value={formData.timeCommitment}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select time commitment</option>
                <option value="1-3">1-3 hours per week</option>
                <option value="4-7">4-7 hours per week</option>
                <option value="8-14">8-14 hours per week</option>
                <option value="15+">15+ hours per week</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Preferred Difficulty Level (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {['Easy', 'Medium', 'Hard'].map(level => (
                  <label key={level} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="preferredDifficulty"
                      value={level}
                      checked={formData.preferredDifficulty.includes(level)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SQL Focus Areas (Select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {focusAreaOptions.map(area => (
                  <label key={area} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="focusAreas"
                      value={area}
                      checked={formData.focusAreas.includes(area)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{area}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  Generating Plan...
                </span>
              ) : (
                <>
                  Generate SQL Kit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Questionnaire;
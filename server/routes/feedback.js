import express from 'express';
import auth from '../middleware/auth.js';
import SQLPlan from '../models/SQLPlan.js';
import { generateSQLFeedback } from '../services/aiService.js';

const router = express.Router();

// @route   POST /api/sql-feedback
// @desc    Get AI feedback on a SQL query
// @access  Private
router.post('/',auth, async (req, res) => {
  try {
    const { questionId, userQuery } = req.body;
    
    if (!questionId || !userQuery) {
      return res.status(400).json({ message: 'Question ID and user query are required' });
    }
    
    // Find the question in any of the user's plans
    const userId = req.user.id;
    const plans = await SQLPlan.find({ userId });
    
    let question = null;
    for (const plan of plans) {
      const foundQuestion = plan.questions.find(q => q._id.toString() === questionId);
      if (foundQuestion) {
        question = foundQuestion;
        break;
      }
    }
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Generate feedback using AI
    const feedback = await generateSQLFeedback(question, userQuery);
    
    res.json({ feedback });
  } catch (err) {
    console.error('Error generating feedback:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
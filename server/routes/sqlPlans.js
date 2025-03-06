import express from 'express';
import auth from '../middleware/auth.js';
import SQLPlan from '../models/SQLPlan.js';
import { generateSQLPlan } from '../services/aiService.js';

const router = express.Router();

// @route   POST /api/sql-plans
// @desc    Create a new SQL plan
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const questionnaireData = req.body;
    
    // Generate SQL plan using AI
    const { title, description, questions } = await generateSQLPlan(questionnaireData);
    
    // Create new plan
    const sqlPlan = new SQLPlan({
      userId,
      title,
      description,
      questions,
      questionnaire: questionnaireData
    });
    
    await sqlPlan.save();
    res.json(sqlPlan);
  } catch (err) {
    console.error('Error creating SQL plan:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sql-plans
// @desc    Get all SQL plans for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('hihiuserId', userId);
    
    const plans = await SQLPlan.find({ userId })
      .sort({ createdAt: -1 })
      .select('title description createdAt')
      .lean();
    
    // Add question counts
    const plansWithCounts = await Promise.all(plans.map(async (plan) => {
      const fullPlan = await SQLPlan.findById(plan._id);
      return {
        ...plan,
        questionsCount: fullPlan.questions.length,
        completedCount: fullPlan.questions.filter(q => q.completed).length
      };
    }));
    
    res.json(plansWithCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sql-plans/:id
// @desc    Get a specific SQL plan
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const planId = req.params.id;
    
    const plan = await SQLPlan.findOne({ _id: planId, userId });
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/sql-plans/:id/questions/:questionId
// @desc    Update a question's completion status
// @access  Private
router.put('/:id/questions/:questionId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, questionId } = req.params;
    const { completed } = req.body;
    
    const plan = await SQLPlan.findOne({ _id: id, userId });
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    // Find and update the question
    const questionIndex = plan.questions.findIndex(q => q._id.toString() === questionId);
    
    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    plan.questions[questionIndex].completed = completed;
    await plan.save();
    
    res.json(plan.questions[questionIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/sql-plans/:id
// @desc    Delete a SQL plan
// @access  Private
router.delete('/:id',auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const planId = req.params.id;
    
    const plan = await SQLPlan.findOne({ _id: planId, userId });
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    await SQLPlan.deleteOne({ _id: planId });
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
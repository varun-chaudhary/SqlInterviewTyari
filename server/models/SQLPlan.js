import mongoose from 'mongoose';

const SQLQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  company: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  sampleInput: {
    type: String
  },
  sampleOutput: {
    type: String
  },
  hint: {
    type: String
  },
  solution: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const SQLPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: [SQLQuestionSchema],
  questionnaire: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SQLPlan = mongoose.model('SQLPlan', SQLPlanSchema);

export default SQLPlan;
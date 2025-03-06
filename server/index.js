import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import sqlPlanRoutes from './routes/sqlPlans.js';
import feedbackRoutes from './routes/feedback.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/sql-plans', sqlPlanRoutes);
app.use('/api/sql-feedback', feedbackRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
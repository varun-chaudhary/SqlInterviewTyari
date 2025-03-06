import OpenAI from 'openai';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL:'http://localhost:3040/v1'
});

export const generateSQLPlan = async (questionnaireData) => {
  try {
    if (!questionnaireData) throw new Error("Missing questionnaire data.");

    const { 
      experienceYears, 
      targetCompanies = [], 
      timeCommitment, 
      preferredDifficulty = [], 
      focusAreas = [], 
      targetRole 
    } = questionnaireData;

    // **Title & Description**
    const title = `Personalized SQL Kit for ${targetRole} (${experienceYears} Years Experience)`;
    let description = `This SQL practice plan is tailored for a ${targetRole} with ${experienceYears} years of experience.`;

    if (targetCompanies.length) {
      description += ` Targeting companies like ${targetCompanies.slice(0, 3).join(', ')}.`;
    }
    if (focusAreas.length) {
      description += ` Focus areas: ${focusAreas.slice(0, 3).join(', ')}.`;
    }
    description += ` Designed for ${timeCommitment} hours of weekly practice.`;

    // **Generate SQL Questions using OpenAI API**
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "user", 
          content: `hi how are you?` 
        },
        
      ],
      temperature: 0.7
    });
    console.log('AI Response:', aiResponse);

   
    const questionsData = JSON.parse(aiResponse.choices[0].message.content);

    // **Ensure questions match SQLQuestionSchema**
    const questions = questionsData.map((q, index) => ({
      title: q.title || `SQL Challenge ${index + 1}`,
      difficulty: q.difficulty || 'Medium',
      company: q.company || (targetCompanies.length ? targetCompanies[Math.floor(Math.random() * targetCompanies.length)] : ''),
      description: q.description || 'Solve the SQL challenge.',
      sampleInput: q.sampleInput || '',
      sampleOutput: q.sampleOutput || '',
      hint: q.hint || 'Think about using GROUP BY or JOIN operations.',
      solution: q.solution || '',
      completed: false
    }));

    // **Return the structured SQL Plan**
    return {
      userId: new mongoose.Types.ObjectId(userId),
      title,
      description,
      questions,
      questionnaire: questionnaireData,
      createdAt: new Date()
    };

  } catch (error) {
    console.error('Error generating SQL plan:', error);
    throw error;
  }
};


// Generate AI-based feedback on a user's SQL query
export const generateSQLFeedback = async (question, userQuery) => {
  try {
    if (!question || !userQuery) return "Invalid input. Please provide a question and a SQL query.";

    const prompt = `Evaluate the following SQL query for the question: '${question.title}'. The query is:\n\n${userQuery}\n\nProvide detailed feedback, highlighting correctness, efficiency, and possible improvements.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are an SQL expert providing constructive feedback." }, { role: "user", content: prompt }],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating SQL feedback:', error);
    throw error;
  }
};
import mongoose from 'mongoose';
import FaqQuestion from '../models/faqquestionsModel.js';
import '../config/db.js';

// Define the business FAQ questions
const businessFaqQuestions = [
  "What should the customer know about your pricing (e.g., discounts, fees)?",
  "What is your typical process for working with a new customer?",
  "What education and/or training do you have that relates to your work?",
  "How did you get started doing this type of work?",
  "What type of customer have you worked with?",
  "Describe a recent project you are fond of. How long did it take?",
  "What advice you would give a customer looking to hire a provider in your area of work?",
  "What questions should customers think through before talking to professionals about their project?"
];

async function seedFaqQuestions() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/servicyee');
    console.log('Connected to MongoDB');

    // Clear existing questions
    await FaqQuestion.deleteMany({});
    console.log('Cleared existing FAQ questions');

    // Create new questions
    const questions = [];
    for (const questionText of businessFaqQuestions) {
      const question = new FaqQuestion({ question: questionText });
      await question.save();
      questions.push(question);
      console.log(`Created question: ${questionText.substring(0, 50)}...`);
    }

    console.log(`\n✅ Successfully seeded ${questions.length} FAQ questions`);
    console.log('Questions are now available for the frontend to fetch and answer.');

  } catch (error) {
    console.error('❌ Error seeding FAQ questions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFaqQuestions();
}

export default seedFaqQuestions;
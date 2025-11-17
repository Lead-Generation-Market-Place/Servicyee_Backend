import {
  addQuestion,
  getAllQuestions,
  addAnswer,
  getFaqsByProfessional,
} from "../services/ProfessionalServices.js";

// Simple FAQ Controller (Only Essential Methods)

export async function addQuestionHandler(req, res) {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Question is required"
      });
    }

    const faqQuestion = await addQuestion(question.trim());

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      question: faqQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding question",
      error: error.message,
    });
  }
}

export async function getAllQuestionsHandler(req, res) {
  try {
    const questions = await getAllQuestions();
    
    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
      error: error.message,
    });
  }
}

export async function addAnswerHandler(req, res) {
  try {
    const { question_id, professional_id, answer } = req.body;

    if (!question_id || !professional_id || !answer || answer.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Question ID, Professional ID, and Answer are required"
      });
    }

    const faq = await addAnswer(question_id, professional_id, answer.trim());

    res.status(201).json({
      success: true,
      message: "Answer saved successfully",
      faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving answer",
      error: error.message,
    });
  }
}

export async function getFaqsByProfessionalHandler(req, res) {
  try {
    const { professionalId } = req.params;

    const faqs = await getFaqsByProfessional(professionalId);
    
    res.status(200).json({
      success: true,
      faqs,
      total: faqs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching FAQs",
      error: error.message,
    });
  }
}
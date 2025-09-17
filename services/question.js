import QuestionModel from '../models/questionModel.js';

class QuestionService {
  async createQuestion(data) {
    const question = new QuestionModel(data);
    return await question.save();
  }

  async getAllQuestions() {
    return await QuestionModel.find();
  }

  async getQuestionById(id) {
    return await QuestionModel.findById(id);
  }

  async updateQuestion(id, data) {
    return await QuestionModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteQuestion(id) {
    return await QuestionModel.findByIdAndDelete(id);
  }
}

export default new QuestionService();

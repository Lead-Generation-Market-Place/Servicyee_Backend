import AnswerModel from '../models/answerModel.js';

class AnswerService {
  async createAnswer(data) {
    try {
      const answer = new AnswerModel(data);
      return await answer.save();
    } catch (error) {
      throw error;
    }
  }

  async getAllAnswers() {
    try {
      return await AnswerModel.find();
    } catch (error) {
      throw error;
    }
  }

  async getAnswerById(id) {
    try {
      return await AnswerModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async updateAnswer(id, data) {
    try {
      return await AnswerModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async deleteAnswer(id) {
    try {
      return await AnswerModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

export default new AnswerService();

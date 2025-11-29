import Professional from "../models/ProfessionalModel.js";

class ReactivationService {
  async reactivateDueProfessionals() {
    try {
      const now = new Date();
      
      const result = await Professional.updateMany(
        {
          is_available: false,
          hidden_until: { $lte: now, $ne: null }
        },
        {
          is_available: true,
          hidden_until: null
        }
      );

      return {
        success: true,
        reactivated: result.modifiedCount,
        timestamp: now
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new ReactivationService();
import promotionModel from "../models/promotionModel.js";
class PromotionService {
  async getAllPromotions() {
    try {
      const now = new Date();
      const promotions = await promotionModel
        .find({
          is_active: true,
          valid_from: { $lte: now },
          valid_to: { $gte: now },
        })
        .populate({
          path: "service_id",
      
          select: "-_id name is_active image_url",
        })
        .lean()
        .limit(5)
        .exec();
      return promotions;
    } catch (e) {
      throw e;
    }
  }

  async addPromotion(data) {
    try {
      const promotion = new promotionModel(data);
      return await promotion.save();
    } catch (e) {
      throw e;
    }
  }
}
export default new PromotionService();

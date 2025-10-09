import promotionService from "../services/promotionService.js";
export const getPromotionsController = async (req, res, next) => {
  try {
    const promotions = await promotionService.getAllPromotions();

    if (!promotions || promotions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No Promotions Found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Prmotions Founded",
      count: promotions.length,
      data: promotions,
    });
  } catch (error) {
    next(error);
  }
};


export const addPromotionController=async(req,res,next)=>{
  try {
  const  promotion=req.body;
    const result=await promotionService.addPromotion(promotion);
     res.status(200).json({
      message: "Promotion added successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

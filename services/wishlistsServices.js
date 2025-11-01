import { populate } from "dotenv";
import wishlistsModel from "../models/wishlistsModel.js";

class WishListsService {
  async addWishList(data) {
    try {
      const wishlist = new wishlistsModel(data);
      return await wishlist.save();
    } catch (error) {
      throw error;
    }
  }
  async getAllWishLists() {
    try {
      const result = await wishlistsModel
        .find()
        .populate("service_id", "service_name service_status");
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAllWishListsWithSubCategory() {
    try {
      const result = await wishlistsModel.find().populate({
        path: "service_id",
        select: "service_name service_status subcategory_id",
        populate: [
          {
            path: "subcategory_id",
            select: "name status",
          },
        ],
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAllUserWishLists(userId) {
    try {
      const result = await wishlistsModel.find({ user_id: userId }).populate({
        path: "service_id",
        select: "name description image_url is_active is_featured",
      
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
  async removeWishList(wishListId) {
    try {
      const result = await wishlistsModel.deleteOne({
        id: wishListId,
        
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default new WishListsService();

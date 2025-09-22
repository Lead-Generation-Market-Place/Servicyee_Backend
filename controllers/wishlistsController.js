import { count } from "console";
import wishlistsService from "../services/wishlistsServices.js";

export const addWishList = async (req, res, next) => {
  try {
    const wishlist = req.body;
    const result = await wishlistsService.addWishList(wishlist);
    res.status(201).json({
      message: "wishlist added",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getWishLists = async (req, res, next) => {
  try {
    const result = await wishlistsService.getAllWishLists();
    res.status(200).json({
      message: "Wishlist Retreived Successfully",
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getWishListsWithSubCategory = async (req, res, next) => {
  try {
    const result = await wishlistsService.getAllWishListsWithSubCategory();
    res.status(200).json({
      message: "All Wish Lists With SubCategory Retreived",
      count: result.count,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserWishLists=async(req,res,next)=>{
  try {
    const userId=req.params.id;
    const result=await wishlistsService.getAllUserWishLists(userId);
    res.status(200).json({
      message: `Retreived WishList of ${userId} `,
      count:result.count,
      data:result
    });
  } catch (error) {
    next(error);
  }
}

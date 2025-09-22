import { count } from "console";
import wishlistsService from "../services/wishlistsServices.js";

export const addWishList = async (req, res, next) => {
  try {
    const wishlist = req.body;
    const result = await wishlistsService.addWishList(wishlist);
    res.status(201).json({ 
      message: "wishlist added", result });
  } catch (error) {
    next(error);
  }
};

export const getWishLists = async (req, res, next) => {
  try {
    const result = await wishlistsService.getAllWishLists();
    res.status(200).json(
      {
         message: "Wishlist Retreived Successfully",
         count:result.length,
         data:result 
        
        },

    
    );
  } catch (error) {
    next(error);
  }
};

import wishlistsModel from "../models/wishlistsModel.js";

class WishListsService{
    async addWishList(data){
        try {
            const wishlist=new wishlistsModel(data);
            return await wishlist.save();
        } catch (error) {
            throw error;
        }
    }
}

export default new WishListsService();
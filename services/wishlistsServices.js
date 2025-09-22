import wishlistsModel from "../models/wishlistsModel.js";


class WishListsService{
    async addWishList(data){
        try {
            const wishlist=new wishlistsModel(data);
            return await wishlist.save();
        } catch (error) {
            throw error;
        }
    };
    async getAllWishLists(){
        try {
            const result=wishlistsModel.find().populate('service_id','service_name');
            return await result;            
        } catch (error) {
            throw error;
        }
    }
}

export default new WishListsService();
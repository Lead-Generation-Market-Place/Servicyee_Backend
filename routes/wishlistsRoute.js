import express from 'express';
import { addWishList,getWishLists,getWishListsWithSubCategory ,getUserWishLists} from '../controllers/wishlistsController.js';
import {validateBody} from '../middlewares/validate.middleware.js';
import {createWishlistsSchema} from '../validators/wishlists.validator.js';


const router = express.Router();

router.get('/',getWishLists); //retreving all wish list including service name and status
router.post('/addwishlist',validateBody(createWishlistsSchema),addWishList);  //adding a wish list into wishlists collection with refrence user and service
router.get('/getwishlistswithsubcategory',getWishListsWithSubCategory); //retreiving all wishLists with subcategory
router.get('/:id',getUserWishLists);

export default router;
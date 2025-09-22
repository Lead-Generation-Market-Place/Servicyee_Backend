import express from 'express';
import { addWishList,getWishLists } from '../controllers/wishlistsController.js';
import {validateBody} from '../middlewares/validate.middleware.js';
import {createWishlistsSchema} from '../validators/wishlists.validator.js';


const router = express.Router();

router.post('/addwishlist',validateBody(createWishlistsSchema),addWishList);
router.get('/',getWishLists);
export default router;
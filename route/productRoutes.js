import express from 'express';
import { addProduct, addReview, getAllProducts, getProductById, getTopProducts, removeProduct, updateProduct } from '../controllers/productControllers.js';
import { checkAdmin, checkUser } from '../middleware/checkUser.js';
import { checkFile, updateFileCheck } from '../middleware/fileCheck.js';


const router = express.Router();


router.route('/').get(getAllProducts).post(checkUser,  checkAdmin, checkFile, addProduct);

router.route('/topProducts').get( getTopProducts, getAllProducts);

router.route('/:id').get(getProductById).patch(checkUser, checkAdmin, updateFileCheck, updateProduct).delete(checkUser, checkAdmin, removeProduct );

router.route('/review/:id').patch(checkUser, addReview)

export default router;


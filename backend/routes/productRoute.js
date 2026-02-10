import express from 'express';
import { addProduct, listProducts, singleProduct, updateProduct, addReview, listReviews, deleteReview, removeProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 },
{ name: 'image2', maxCount: 1 },
{ name: 'image3', maxCount: 1 },
{ name: 'image4', maxCount: 1 },
]), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
productRouter.put('/update', adminAuth, upload.fields([
{ name: 'image1', maxCount: 1 },
{ name: 'image2', maxCount: 1 },
{ name: 'image3', maxCount: 1 },
{ name: 'image4', maxCount: 1 },
]), updateProduct);
productRouter.post('/review', authUser, addReview);
productRouter.get('/reviews', adminAuth, listReviews);
productRouter.post('/review/delete', adminAuth, deleteReview);

export default productRouter;
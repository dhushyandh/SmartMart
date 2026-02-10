import express from 'express';
import { loginUser, registerUser, adminLogin, getUserCount, getUsers } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/login',loginUser);
userRouter.post('/register',registerUser);
userRouter.post('/admin',adminLogin);
userRouter.get('/count', adminAuth, getUserCount);
userRouter.get('/list', adminAuth, getUsers);

export default userRouter;
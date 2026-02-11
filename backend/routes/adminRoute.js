import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import { getAdminOverview } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/overview', adminAuth, getAdminOverview);

export default adminRouter;

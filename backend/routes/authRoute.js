import express from "express";
import { googleAuth } from "../controllers/googleAuthController.js";

const authRouter = express.Router();

authRouter.post("/google", googleAuth);

export default authRouter;

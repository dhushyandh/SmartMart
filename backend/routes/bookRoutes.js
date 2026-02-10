import express from "express";
import { getBookById, getBooks } from "../controllers/bookController.js";

const router = express.Router();

router.get("/books", getBooks);
router.get("/books/:id", getBookById);

export default router;

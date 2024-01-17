import express from "express";
import * as reviewsController from "../controllers/reviewsController";

const router = express.Router();

router.get("/:id",reviewsController.getAllReviewsById)

export default router;
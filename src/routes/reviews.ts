import express from "express";
import * as reviewsController from "../controllers/reviewsController";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.get("/:id", reviewsController.getAllReviewsByUserId);
router.post("/:id", authenticate, reviewsController.addNewReview);
router.put("/:id", authenticate, reviewsController.editReview);
router.delete("/:id", authenticate, reviewsController.deleteReview);

export default router;

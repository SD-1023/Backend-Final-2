import express from "express";
import * as reviewsController from "../controllers/reviewsController";

const router = express.Router();

router.get("/:id",reviewsController.getAllReviewsByUserId)
router.post("/:id",reviewsController.addNewReview);
router.put("/:id",reviewsController.editReview);
router.delete("/:id",reviewsController.deleteReview);

export default router;
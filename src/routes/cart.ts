import express from "express";
import * as cartController from "../controllers/cartController"

const router = express.Router();

router.get("/:id",cartController.getCartByUserId);
router.post("/",cartController.addToCart);
router.delete("/",cartController.deleteFromCart);
router.delete("/clear/:id",cartController.clearCart);

export default router;
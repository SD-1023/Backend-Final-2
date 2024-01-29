import express from "express";
import * as cartController from "../controllers/cartController";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.get("/:id", authenticate, cartController.getCartByUserId);
router.post("/", authenticate, cartController.addToCart);
router.delete("/", authenticate, cartController.deleteFromCart);
router.delete("/clear/:id", authenticate, cartController.clearCart);
router.put("/dec", authenticate, cartController.decreaseQuantity);
router.put("/inc", authenticate, cartController.increaseQuantity);

export default router;

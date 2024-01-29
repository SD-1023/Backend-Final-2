import express from "express";
import * as wishlistsController from "../controllers/wishlistsController";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.get("/:id", authenticate, wishlistsController.getAllWishlistsByUserId);
router.post("/", authenticate, wishlistsController.addToWishList);
router.delete("/:id", authenticate, wishlistsController.deleteFromWishList);
router.delete("/clear/:id", authenticate, wishlistsController.clearWishList);

export default router;

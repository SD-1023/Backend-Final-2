import express from "express";
import * as wishlistsController from "../controllers/wishlistsController";

const router = express.Router();

router.get("/:id",wishlistsController.getAllWishlistsByUserId);
router.post("/",wishlistsController.addToWishList);

router.delete("/:id",wishlistsController.deleteFromWishList);
router.delete("/clear/:id",wishlistsController.clearWishList);

export default router;
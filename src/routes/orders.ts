import express from "express";
import * as ordersController from "../controllers/ordersController";

const router = express.Router();

router.get("/:id",ordersController.getOrdersByUserId);
router.post("/:id",ordersController.cancelOrder);
router.delete("/:id",ordersController.cancelOrder);

export default router;
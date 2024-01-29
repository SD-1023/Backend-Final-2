import express from "express";
import * as ordersController from "../controllers/ordersController";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.get("/:id", ordersController.getOrdersByUserId);
router.get("/cancelled/:id", ordersController.getAllCancelledOrdersByUserId);
router.get("/completed/:id", ordersController.getAllCompletedOrdersByUserId);
router.get("/pending/:id", ordersController.getAllPendingOrdersByUserId);
router.post("/:id", authenticate, ordersController.addOrder);
router.delete("/:id", authenticate, ordersController.cancelOrder);

export default router;

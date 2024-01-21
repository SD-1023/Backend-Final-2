import express from "express";
import * as ordersController from "../controllers/ordersController";

const router = express.Router();

router.get("/",ordersController.getOrdersByUserId);

export default router;
import express from "express";
import * as productsController from "../controllers/productsController";

const router = express.Router();

router.get("/",productsController.getAllProducts);
router.get("/",productsController.getNewArrivals);
router.get("/:id",productsController.getProductById);
router.post("/",productsController.createProduct);
router.put("/:id",productsController.updateProduct);
router.delete("/:id",productsController.deleteProduct);

export default router;
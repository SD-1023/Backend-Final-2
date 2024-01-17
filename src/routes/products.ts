import express from "express";
import * as productsController from "../controllers/productsController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.get("/",productsController.getAllProducts);
router.get("/:id",productsController.getProductById);
router.post("/",upload.any(),productsController.createProduct);
router.put("/:id",productsController.updateProduct);
router.delete("/:id",productsController.deleteProduct);

export default router;
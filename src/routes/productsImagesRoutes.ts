import express from "express";
import * as productsImagesController from "../controllers/productsImagesController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize:8000000 // 8Mb 
} });
const router = express.Router();

router.post("/",upload.any(),productsImagesController.createProductImages);
export default router;
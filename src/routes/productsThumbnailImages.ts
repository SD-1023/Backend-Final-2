import express from "express";
import * as productsThumbnailImagesController from "../controllers/productsThumbnailImagesController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize:2000000 // 2Mb 
} });
const router = express.Router();

router.post("/",upload.any(),productsThumbnailImagesController.createProductThumbnailImages);
export default router;
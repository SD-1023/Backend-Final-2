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

router.get("/:id",productsThumbnailImagesController.getAllProductThumbnailImagesById);
router.post("/",upload.any(),productsThumbnailImagesController.createProductThumbnailImages);
router.put("/:id",upload.single("image"),productsThumbnailImagesController.updateProductThumbnailImage);

export default router;
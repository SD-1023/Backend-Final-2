import express from "express";
import * as categoriesController from "../controllers/categoriesController";
const router = express.Router()

router.get("/",categoriesController.getAllCategories);
router.get("/:id",categoriesController.getOneCategoryById)

export default router;
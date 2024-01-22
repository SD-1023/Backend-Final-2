import express from "express";
const brandsRoutes = express.Router()
import * as brandsController from "../controllers/brandsContraller"

brandsRoutes.get("/",brandsController.getALLBrands);

export default brandsRoutes;
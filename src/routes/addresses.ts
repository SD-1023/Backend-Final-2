import express from "express";
import * as addressesController from "../controllers/addressController"

const router = express.Router();

router.get("/:id",addressesController.getAddressByUserId);
router.post("/",addressesController.createNewAddress);
router.put("/:id",addressesController.updateAddress);

export default router;
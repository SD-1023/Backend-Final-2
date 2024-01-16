import express from "express";
import * as usersController from "../controllers/usersController"

const router = express.Router();


router.get("/",usersController.getAllUsers);
router.get("/:id",usersController.getUserById);

export default router;


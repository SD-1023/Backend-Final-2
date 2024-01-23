import express from "express";
import * as usersController from "../controllers/usersController";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);
router.post("/signup", usersController.signUp);
router.post("/signin", usersController.signIn);
router.put("/signout", authenticate, usersController.signOut);
router.put("/changePassword", authenticate, usersController.changePassword);

export default router;

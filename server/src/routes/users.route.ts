import express from "express";
import usersController from "@controllers/users.controller";
const router = express.Router();

router.get("/", usersController.getUsers);
router.post("/signup", usersController.signup);
router.post("/login", usersController.login);

export default router;

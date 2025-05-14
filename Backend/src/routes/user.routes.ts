import express, { Router } from "express";
import { login, logout, register } from "../controllers/user.controller";

const router: Router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;

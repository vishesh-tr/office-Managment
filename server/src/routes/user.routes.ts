import express, { Router } from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/user.controller";

const router: Router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);

export default router;

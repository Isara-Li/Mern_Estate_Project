import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verrifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verrifyToken, updateUser);

export default router;

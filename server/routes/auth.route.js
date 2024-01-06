import express from "express";
import { signin, signup, oauth } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/oauth", oauth);

export default router;

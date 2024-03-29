import express from "express";
import {
  signin,
  signup,
  oauth,
  signout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/oauth", oauth);
router.get("/signout", signout);

export default router;

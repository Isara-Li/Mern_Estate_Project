import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verrifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verrifyToken, createListing);

export default router;

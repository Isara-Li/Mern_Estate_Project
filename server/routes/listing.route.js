import express from "express";
import {
  createListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { verrifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verrifyToken, createListing);
router.delete("/delete/:id", verrifyToken, deleteListing);
export default router;

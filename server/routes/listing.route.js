import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
} from "../controllers/listing.controller.js";
import { verrifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verrifyToken, createListing);
router.delete("/delete/:id", verrifyToken, deleteListing);
router.post("/update/:id", verrifyToken, updateListing);
export default router;

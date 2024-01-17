import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
} from "../controllers/listing.controller.js";
import { verrifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verrifyToken, createListing);
router.delete("/delete/:id", verrifyToken, deleteListing);
router.post("/update/:id", verrifyToken, updateListing);
router.get("/getListing/:id", getListing);
export default router;

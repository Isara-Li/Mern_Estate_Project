import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getListing,
  getUser,
} from "../controllers/user.controller.js";
import { verrifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verrifyToken, updateUser);
router.delete("/delete/:id", verrifyToken, deleteUser); // Usually this id parameter is not needed. But in this case we need it to check if the user is allowed to delete the user.
router.get("/listing/:id", verrifyToken, getListing);
router.get("/getUser/:id", verrifyToken, getUser);

export default router;

import express from "express";
import {
  test,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verrifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verrifyToken, updateUser);
router.delete("/delete/:id", verrifyToken, deleteUser); // Usually this id parameter is not needed. But in this case we need it to check if the user is allowed to delete the user.

export default router;

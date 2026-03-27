import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getCurrentUser } from "../controller/getCurrentUser.js";
import { upload } from "../middleware/multer.js"; // ✅ FIX
import { updateProfile } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.get("/getcurrentuser", isAuth, getCurrentUser);
userRouter.post(
  "/profile",
  isAuth,
  upload.single("photoUrl"), // ✔️ OK
  updateProfile
);

export default userRouter;

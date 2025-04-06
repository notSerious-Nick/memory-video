import express from "express";
import { handleDeleteUser, handleEditUser, profile, logout } from "../controllers/userController";
const userRouter = express.Router();

userRouter.get("/edit", handleEditUser);
userRouter.get("/delete", handleDeleteUser);
userRouter.get("/:id", profile);
userRouter.get("/logout", logout);

export default userRouter;
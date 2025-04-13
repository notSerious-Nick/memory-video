import express from "express";
import { handleDeleteUser, handleEditUser, profile, logout } from "../controllers/userController";
const userRouter = express.Router();

userRouter.get("/edit", handleEditUser);
userRouter.get("/delete", handleDeleteUser);
userRouter.get("/logout", logout);
userRouter.get("/:id(\\d+)", profile);

export default userRouter;
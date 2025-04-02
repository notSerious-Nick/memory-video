import express from "express";
import { handleDeleteUser, handleEditUser } from "../controllers/userController";
const userRouter = express.Router();

userRouter.get("/edit", handleEditUser);
userRouter.get("/delete", handleDeleteUser);

export default userRouter;
import express from "express";

const userRouter = express.Router();

const handleDeleteUser = (req, res) =>{
    res.send("Delete User");
}
const handleEditUser = (req, res) =>{
    res.send("Edit User");
}
userRouter.get("/edit", handleEditUser);
userRouter.get("/delete", handleDeleteUser);

export default userRouter;
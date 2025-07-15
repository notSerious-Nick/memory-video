import express from "express";
import { handleDeleteUser, handleEditUser, profile, startKakaoLogin, finishKakaoLogin, startGithubLogin, finishGithubLogin, logout} from "../controllers/userController";
const userRouter = express.Router();

userRouter.get("/edit", handleEditUser);
userRouter.get("/delete", handleDeleteUser);
userRouter.get("/:id(\\d+)", profile);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.get("/kakao/finish", finishKakaoLogin);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout", logout);
export default userRouter;
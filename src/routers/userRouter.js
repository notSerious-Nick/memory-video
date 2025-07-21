import express from "express";
import {
  handleDeleteUser,
  getEditProfile,
  postEditProfile,
  profile,
  startKakaoLogin,
  finishKakaoLogin,
  startGithubLogin,
  finishGithubLogin,
  logout,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import { notUserMiddleware, noSocialMiddleware } from "../middlewares";
const userRouter = express.Router();

userRouter
  .route("/editProfile")
  .all(notUserMiddleware)
  .get(getEditProfile)
  .post(postEditProfile);
userRouter.get("/delete", notUserMiddleware, handleDeleteUser);
userRouter.get("/profile", notUserMiddleware, profile);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.get("/kakao/finish", finishKakaoLogin);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout", notUserMiddleware, logout);
userRouter
  .route("/editProfile/changePassword")
  .all(notUserMiddleware)
  .all(noSocialMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
export default userRouter;

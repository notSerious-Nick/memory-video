import express from "express";
import { trending, search } from "../controllers/videoController";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.get("/search", search);
globalRouter.route("/login").get(getLogin).post(postLogin);

export default globalRouter;
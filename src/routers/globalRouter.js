import express from "express";
import { trending, search } from "../controllers/videoController";
import { getJoin, postJoin, login } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.get("/search", search);
globalRouter.get("/login", login);

export default globalRouter;
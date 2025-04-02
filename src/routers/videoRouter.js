import express from "express";
import { handleDeleteVideo, handleEditVideo } from "../controllers/videoController";
const videoRouter = express.Router();

videoRouter.get("/edit", handleEditVideo);
videoRouter.get("/delete", handleDeleteVideo);

export default videoRouter;
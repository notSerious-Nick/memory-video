import express from "express";
import {
  handleDeleteVideo,
  getEdit,
  postEdit,
  watching,
  getUpload,
  postUpload,
} from "../controllers/videoController";
import { videoMiddleware } from "../middlewares";
const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .get(getUpload)
  .post(videoMiddleware.single("video"), postUpload); // it has to be on the top, if not it can be considered as :id.
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEdit)
  .post(videoMiddleware.single("video"), postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", handleDeleteVideo);
videoRouter.get("/:id([0-9a-f]{24})", watching);

export default videoRouter;

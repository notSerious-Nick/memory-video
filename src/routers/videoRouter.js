import express from "express";
import { handleDeleteVideo, getEdit , postEdit, watching, upload } from "../controllers/videoController";
const videoRouter = express.Router();

videoRouter.get("/upload", upload); // it has to be on the top, if not it can be considered as :id.
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id(\\d+)/delete", handleDeleteVideo);
videoRouter.get("/:id(\\d+)", watching);

export default videoRouter;
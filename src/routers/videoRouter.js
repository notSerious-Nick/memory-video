import express from "express";
import { handleDeleteVideo, handleEditVideo, watching, upload } from "../controllers/videoController";
const videoRouter = express.Router();

videoRouter.get("/:id/edit", handleEditVideo);
videoRouter.get("/:id/delete", handleDeleteVideo);
videoRouter.get("/:id", watching);
videoRouter.get("/upload", upload);

export default videoRouter;
import express from "express";

const videoRouter = express.Router();

const handleDeleteVideo = (req, res) =>{
    res.send("Delete video");
}
const handleEditVideo = (req, res) =>{
    res.send("Edit video");
}

videoRouter.get("/edit", handleEditVideo);
videoRouter.get("/delete", handleDeleteVideo);

export default videoRouter;
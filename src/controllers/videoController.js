import video from "../models/Video";

export const handleDeleteVideo = (req, res) => res.send("Delete video");
export const getEdit = (req, res) => {
    return res.render("edit");
}
export const postEdit = (req, res) => {
    const {id} = req.params;
    return res.redirect(`/videos/${video.id}`);
}
export const trending = async (req, res) => {
    const videos = await video.find({});
    return res.render("home", {pageTitle:"Home", videos});
}
export const watching = (req, res) => {
    const {id} = req.params;
    return res.render("watch",{pageTitle:video.title});
}
export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle:"Upload"});
};
export const postUpload = (req, res) => {
    return res.redirect("/");
}
export const search = (req, res) => res.send("Search");
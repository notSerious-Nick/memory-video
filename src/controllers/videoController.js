import { json } from "express";
import Video from "../models/Video";

export const handleDeleteVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("videos/edit", { pageTitle: video.title, video });
};

export const postEdit = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const { id } = req.params;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  await Video.findOneAndUpdate(
    { _id: `${id}` },
    {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    }
  );

  return res.redirect(`/videos/${id}`);
};

export const trending = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};

export const watching = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  console.log(video);
  return res.render("videos/watch", { pageTitle: video.title, video });
};
export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const { file } = req;
  console.log(req.file);
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      videoUrl: file.path,
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("videos/upload", {
      pageTitle: "Upload",
      error: `${error}`,
    });
  }
};
export const search = async (req, res) => {
  let videos = [];
  const { keyword } = req.query;
  if (keyword) {
    const safe = (keyword) => keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const safeKey = safe(keyword);
    videos = await Video.find({
      title: { $regex: safeKey, $options: "i" },
    });
  }
  return res.render("videos/search", { pageTitle: "Search", videos });
};

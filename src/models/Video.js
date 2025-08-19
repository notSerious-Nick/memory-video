import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 20, trim: true },
  description: { type: String, required: true, minLength: 1, trim: true },
  createdAt: { required: true, type: Date, default: Date.now },
  hashtags: [{ type: String, required: true, trim: true }],
  meta: {
    comments: { type: Number, required: true, default: 0 },
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
  videoUrl: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return (hashtags || "").split(",").map((tags) => {
    const tag = tags.trim();
    return tag.startsWith("#") ? tag : `#${tag}`;
  });
});

const Video = mongoose.model("Video", videoSchema);

export default Video;

import mongoose from "mongoose";

const MediaAssetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["video", "audio", "pdf"], required: true },
  file_key: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Media = mongoose.model("media", MediaAssetSchema, "media");
export default Media;

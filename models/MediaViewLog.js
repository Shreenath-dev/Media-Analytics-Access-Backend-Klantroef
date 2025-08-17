import mongoose from "mongoose";
const MediaViewLogSchema = new mongoose.Schema({
  media_id: { type: mongoose.Schema.Types.ObjectId, ref: "MediaAsset", required: true, index: true },
  viewed_by_ip: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const MediaViewLog = mongoose.model("mediaViewLog", MediaViewLogSchema, "mediaViewLog");
export default MediaViewLog;
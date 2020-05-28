import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  videoFile: {
    type: String,
    required: "Required",
  },
  title: {
    type: String,
    required: "Required",
  },
  description: String,
  views: {
    type: Number,
    default: 0,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const model = mongoose.model("Video", VideoSchema);

export default model;

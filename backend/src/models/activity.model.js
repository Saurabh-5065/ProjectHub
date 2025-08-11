
import mongoose, { Schema } from 'mongoose';

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project" }, // optional
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const Activity = mongoose.model("Activity", activitySchema);

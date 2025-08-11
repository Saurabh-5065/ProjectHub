import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
  task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  comments: { type: String },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date }
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);

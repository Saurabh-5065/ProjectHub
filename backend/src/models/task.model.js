import mongoose, { Schema } from 'mongoose'


const taskSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  dueDate: { type: Date },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  completed: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['In Progress','In Review','Completed'],
    default: 'In Progress'
  },
  project: { type: Schema.Types.ObjectId, ref: "Project" },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignor: {type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);

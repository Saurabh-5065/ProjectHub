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
    enum: ['Not Started', 'In Progress', 'Completed', 'In Review', 'Blocked'],
    default: 'Not Started'
  },
  project: { type: Schema.Types.ObjectId, ref: "Project" },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);

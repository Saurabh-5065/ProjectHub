
import mongoose, { Schema } from 'mongoose'

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  description: {
    type: String,
    default: ""
  },
  dueDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed", "On Hold"],
    default: "Not Started"
  },

  
  teamLead: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]

}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);

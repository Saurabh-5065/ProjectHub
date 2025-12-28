import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ------------------------- Create Task ------------------------------------

export const createTask = asyncHandler(async (req, res) => {
    console.log("Task creation started");
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { title, description, dueDate, priority, projectId, assignedTo } = req.body;

  if (!title || !projectId || !assignedTo) {
    throw new ApiError(400, "Title, projectId, and assignedTo are required");
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    throw new ApiError(400, "Invalid dueDate");
  }

  const project = await Project.findOne({
    _id: projectId,
    $or: [{ teamLead: userId }, { members: userId }],
  });

  if (!project) {
    throw new ApiError(403, "Not authorized for this project");
  }

  const isValidAssignee =
    project.teamLead.toString() === assignedTo ||
    project.members.some(m => m.toString() === assignedTo);

  if (!isValidAssignee) {
    throw new ApiError(400, "Assignee must be a project member");
  }
  const assignor = userId;
  const task = await Task.create({
    title: title.trim(),
    description,
    dueDate,
    priority,
    project: projectId,
    assignedTo,
    assignor,
  });

  const populatedTask = await Task.findById(task._id)
    .populate("project", "name")
    .populate("assignedTo", "username email");

  console.log("Created successfully");
  
  return res.status(201).json(
    new ApiResponse(201, populatedTask, "Task created successfully")
  );
});



// ----------------get my Task----------------------------------------------

export const getMyTasks = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const tasks = await Task.find({ assignedTo: userId })
  .populate("project", "name")
  .populate("assignedTo", "username email")
  .sort({ createdAt: -1 })

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Fetched assigned tasks"));
});


// ----------------------------------------------------------------
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { taskId } = req.params;
  const { status } = req.body;

  if (!["In Review", "Completed", "In Progress"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const task = await Task.findOne({
    _id: taskId,
  });

  if (!task) {
    throw new ApiError(403, "You are not authorized");
  }

  task.status = status;
  // if (status === "Completed") {
  //   task.completed = true;
  // }

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated"));
});

// -------------- get the task which are in Review------------------

export const getTaskInReview = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const tasks = await Task.find({assignor : userId})
  .populate("project", "name")
  .sort({ createdAt: -1 })

  return res
   .status(200)
   .json(new ApiResponse(200, tasks, "Fetched assigned tasks"));
})
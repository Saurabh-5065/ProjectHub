// controllers/project.controller.js

import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Invitation } from "../models/invitation.model.js";

// POST /api/projects
// export const reateProject = asyncHandler(async (req, res) => {
//   const {
//     name,
//     priority,
//     description,
//     dueDate,
//     progress,
//     status,
//     teamLead,
//     members,
//   } = req.body;

//   // Validate required fields
//   if (!name || !dueDate || !teamLead) {
//     throw new ApiError(400, "Name, Due Date, and Team Lead are required");
//   }

//   const project = await Project.create({
//     name,
//     priority,
//     description,
//     dueDate,
//     progress,
//     status,
//     teamLead,
//     members,
//   });

//   return res
//     .status(201)
//     .json(
//       new ApiResponse(201, project, "Project created successfully")
//     );
// });




// new api to create project
export const createProject = asyncHandler(async (req, res) => {
  const {
    name,
    priority,
    description,
    dueDate,
    progress,
    status,
    members // array of userIds
  } = req.body;

  const teamLead = req.user._id;

  // Validate required fields
  if (!name || !dueDate) {
    throw new ApiError(400, "Project name and due date are required");
  }

  // Create the project with the team lead only
  const project = await Project.create({
    name,
    priority,
    description,
    dueDate,
    progress: progress || 0,
    status: status || "not started",
    teamLead
    // Do NOT add members here; only after they accept invitation
  });

  // Create invitations for each member
  if (members?.length > 0) {
    const invitations = members.map((memberId) => ({
      project: project._id,
      sender: teamLead,
      receiver: memberId
    }));
    await Invitation.insertMany(invitations);
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      project,
      "Project created successfully and invitations sent"
    )
  );
});




// GET /api/myProjects
export const getMyProjects = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized. Please log in.");
  }

  const projects = await Project.find({
    $or: [
      { teamLead: userId },
      { members: userId }
    ]
  })
    .populate("teamLead", "username email")
    .populate("members", "username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Fetched user's projects"));
});


// get element projectById
export const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id)
      .populate("teamLead", "username email")   
      .populate("members", "username email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

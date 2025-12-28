// controllers/invitation.controller.js
import { Invitation } from "../models/invitation.model.js";
import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getPendingInvitations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const invitations = await Invitation.find({
    receiver: userId,
    status: "pending",
  })
    .populate("project", "name dueDate description")
    .populate("sender", "name");

  return res
    .status(200)
    .json(new ApiResponse(200, invitations, "Pending invitations"));
});




//accept reject inviataion
export const respondToInvitation = asyncHandler(async (req, res) => {
  const { invitationId, response } = req.body;
  const userId = req.user._id;

  if (!invitationId || !response) {
    throw new ApiError(400, "invitationId and response are required");
  }

  if (!["accepted", "rejected"].includes(response)) {
    throw new ApiError(400, "response must be 'accepted' or 'rejected'");
  }

  const invitation = await Invitation.findById(invitationId).populate("project");
  if (!invitation) {
    throw new ApiError(404, "Invitation not found");
  }

  if (invitation.receiver.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to respond to this invitation");
  }

  let message = "";
  let updatedProject = null;

  if (response === "accepted") {
    updatedProject = await Project.findByIdAndUpdate(
      invitation.project._id,
      { $addToSet: { members: userId } }, // Prevent duplicates
      { new: true }
    );
    message = "You have joined the project!";
  } else {
    message = "You have rejected the invitation.";
  }

  await invitation.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, { project: updatedProject }, message)
  );
});

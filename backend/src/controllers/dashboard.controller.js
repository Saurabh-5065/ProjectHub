// controllers/dashboard.controller.js

import { Project } from '../models/project.model.js';
import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';
import { Activity } from '../models/activity.model.js';
import { Review } from '../models/review.model.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized: User not authenticated');
  }

  const user = await User.findById(userId).populate('myProjects');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  //  Collect all team member IDs from user's projects
  const teamUserIdsSet = new Set();
  user.myProjects.forEach((project) => {
    project.members.forEach((member) => teamUserIdsSet.add(String(member)));
    teamUserIdsSet.add(String(project.teamLead));
  });

  const teamUserIds = Array.from(teamUserIdsSet);

  //  Fetch dashboard data in parallel
  const [activeProjects, completedTasks, recentProjects, recentActivity, pendingReviews] =
    await Promise.all([
      Project.countDocuments({
        $or: [{ teamLead: userId }, { members: userId }],
        status: { $ne: 'Completed' },
      }),

      Task.countDocuments({
        assignedTo: userId,
        completed: true,
      }),

      Project.find({
        $or: [{ teamLead: userId }, { members: userId }],
      })
        .sort({ updatedAt: -1 })
        .limit(3),

      Activity.find({ user: { $in: teamUserIds } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name'),

      Review.countDocuments({
        status: 'Pending',
        reviewer: userId,
      }),
    ]);

  const dashboardData = {
    stats: {
      activeProjects,
      completedTasks,
      teamMembers: teamUserIds.length,
      pendingReviews,
    },
    recentProjects,
    recentActivity,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashboardData, 'Dashboard data fetched successfully'));
});

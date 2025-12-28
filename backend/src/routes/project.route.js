import express from 'express';
import { createProject } from '../controllers/project.controller.js';
import { getMyProjects } from '../controllers/project.controller.js';
import {getProjectById} from '../controllers/project.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getPendingInvitations } from '../controllers/invitation.controller.js';
import { respondToInvitation } from '../controllers/invitation.controller.js';
import { getProjectsforTask } from '../controllers/project.controller.js';
import { createTask } from '../controllers/task.controller.js';
import { getMyTasks } from '../controllers/task.controller.js';
import { updateTaskStatus } from '../controllers/task.controller.js';
import { getTaskInReview } from '../controllers/task.controller.js';

const projectRoute=express.Router();

projectRoute.post('/createProject', verifyJWT , createProject);
projectRoute.get('/myProjects', verifyJWT , getMyProjects);
projectRoute.get("/projects/:id", verifyJWT, getProjectById);
projectRoute.get("/projectforTask",verifyJWT, getProjectsforTask);


projectRoute.get("/requests", verifyJWT, getPendingInvitations);
projectRoute.post("/respond", verifyJWT, respondToInvitation);

projectRoute.post("/createTask",verifyJWT, createTask);
projectRoute.get("/myTask", verifyJWT, getMyTasks);
projectRoute.patch("/:taskId/status", verifyJWT, updateTaskStatus);
projectRoute.get("/taskInReview",verifyJWT, getTaskInReview);


export default projectRoute;

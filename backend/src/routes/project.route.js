import express from 'express';
import { createProject } from '../controllers/project.controller.js';
import { getMyProjects } from '../controllers/project.controller.js';
import {getProjectById} from '../controllers/project.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getPendingInvitations } from '../controllers/invitation.controller.js';
import { respondToInvitation } from '../controllers/invitation.controller.js';

const projectRoute=express.Router();

projectRoute.post('/createProject', verifyJWT , createProject);
projectRoute.get('/myProjects', verifyJWT , getMyProjects);
projectRoute.get("/projects/:id", verifyJWT, getProjectById);


projectRoute.get("/requests", verifyJWT, getPendingInvitations);
projectRoute.post("/respond", verifyJWT, respondToInvitation);

export default projectRoute;

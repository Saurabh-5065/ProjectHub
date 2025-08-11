import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const dashboardRoutes = express.Router();

dashboardRoutes.get('/', verifyJWT, getDashboardData); // GET /api/dashboard/

export default dashboardRoutes;

import express from 'express';
import { loginUser, logoutUser, registerUser, refreshAccessToken } from '../controllers/user.controller.js';
import {verifyJWT, optionalJWT} from '../middlewares/auth.middleware.js';
import { getCurrentUser, getAllUser } from '../controllers/user.controller.js';



const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login',loginUser);
authRouter.route('/logout').post(verifyJWT,logoutUser);
authRouter.route('/refresh-token').post(refreshAccessToken);
authRouter.get('/me', optionalJWT, getCurrentUser);
authRouter.get('/users',verifyJWT,getAllUser);


export default authRouter;

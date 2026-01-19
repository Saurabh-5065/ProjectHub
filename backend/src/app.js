import express from "express"
import cors from "cors"
import authRouter from "./routes/register.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import projectRoute from "./routes/project.route.js";
import cookieParser from "cookie-parser";

const app= express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://projecthub-1hnl.onrender.com/"
];

app.use(cors({
    origin: allowedOrigins, 
    credentials: true,              
  }))

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api",projectRoute);

export {app}
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/register.route.js"; 
import dashboardRoutes from "./routes/dashboard.route.js"; 
import projectRoute from "./routes/project.route.js";  

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://projecthub-1hnl.onrender.com"
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, curl, health checks)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", projectRoute);

export { app };

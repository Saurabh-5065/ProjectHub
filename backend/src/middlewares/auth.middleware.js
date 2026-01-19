// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken"
// import { User } from "../models/user.model.js";

// export const verifyJWT = asyncHandler(async(req, _, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        
//         if (!token) {
//             throw new ApiError(401, "Unauthorized request")
//         }
    
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
//         if (!user) {
//             throw new ApiError(401, "Invalid Access Token")
//         }
    
//         req.user = user;
//         next()
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid access token")
//     }
    
// })

// export const optionalJWT = asyncHandler(async (req, _, next) => {
//   const token =
//     req.cookies?.accessToken ||
//     req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     req.user = null;
//     return next();
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded._id).select(
//       "-password -refreshToken"
//     );
//   } catch {
//     req.user = null;
//   }

//   next();
// });


import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* -------- STRICT AUTH -------- */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(401, "Invalid token");

    req.user = user;
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
});

/* -------- OPTIONAL AUTH -------- */
export const optionalJWT = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );
  } catch {
    req.user = null;
  }

  next();
});


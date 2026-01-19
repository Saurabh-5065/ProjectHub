// import { User } from "../models/user.model.js";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { Project } from "../models/project.model.js";

// const generateAccessAndRefreshToken = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });
//     return { accessToken, refreshToken };
//   } catch (error) {
//     console.log("Error generating tokens:", error);
//   }
// };


// const registerUser = asyncHandler(async (req, res) => {
//   const { name, username, email, password } = req.body;
//   const existingUser = await User.findOne({
//     $or: [{ email }, { username }],
//   });

//   if (existingUser) {
//     throw new ApiError(409, "User with email or username already exists");
//   }

//   const user = await User.create({ name, username, email, password });

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong while registering the user");
//   }

//   return res
//     .status(201)
//     .json(new ApiResponse(200, createdUser, "User registered successfully"));
// });

// //LOGIN USER (via username)
// const loginUser = asyncHandler(async (req, res) => {
//   const { username, password } = req.body;

//   const user = await User.findOne({ username });

//   if (!user) {
//     throw new ApiError(404, "User does not exist");
//   }

//   const isPasswordValid = await user.isPasswordCorrect(password);

//   if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid username or password");
//   }

//   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
//     user._id
//   );

//   const loggedInUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   //  Cookie Options (secure only in production)
//   const options = {
//     httpOnly: true,
//     secure: process.env.MY_ENV === "production", // 🔥 Only secure in prod
//     sameSite: "lax", // Allows cookies on same-origin requests + local dev
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiResponse(
//         200,
//         {
//           user: loggedInUser,
//           accessToken,
//           refreshToken,
//         },
//         "User logged in successfully"
//       )
//     );
// });


// //  LOGOUT USER
// const logoutUser = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate(req.user._id, {
//     $unset: { refreshToken: 1 },
//   });

//   const cookieOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     path: "/",
//   };

//   return res
//     .status(200)
//     .clearCookie("accessToken", cookieOptions)
//     .clearCookie("refreshToken", cookieOptions)
//     .json(new ApiResponse(200, {}, "User logged out successfully"));
// });

// // REFRESH ACCESS TOKEN
// const refreshAccessToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken =
//     req.cookies.refreshToken || req.body.refreshToken;

//   if (!incomingRefreshToken) {
//     throw new ApiError(401, "Unauthorized request");
//   }

//   try {
//     const decodedToken = jwt.verify(
//       incomingRefreshToken,
//       process.env.JWT_SECRET
//     );

//     const user = await User.findById(decodedToken?._id);

//     if (!user) {
//       throw new ApiError(401, "Invalid refresh token");
//     }

//     if (incomingRefreshToken !== user?.refreshToken) {
//       throw new ApiError(401, "Refresh token is expired or used");
//     }

//     const options = {
//       httpOnly: true,
//       secure: true,
//     };

//     const { accessToken, refreshToken: newRefreshToken } =
//       await generateAccessAndRefreshToken(user._id);

//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", newRefreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           { accessToken, refreshToken: newRefreshToken },
//           "Access token refreshed"
//         )
//       );
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid refresh token");
//   }
// });




// const getCurrentUser = asyncHandler(async (req, res) => {
//   if (!req.user) {
//     return res
//       .status(200)
//       .json(new ApiResponse(200, null, "User not logged in"));
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, req.user, "User fetched successfully"));
// });


import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";

/* ---------------- TOKEN HELPERS ---------------- */

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const cookieOptions = {
  httpOnly: true,
  secure: true,        // REQUIRED on Render
  sameSite: "none",    // REQUIRED for cross-origin
  path: "/",
};

/* ---------------- REGISTER ---------------- */

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({ name, username, email, password });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

/* ---------------- LOGIN ---------------- */

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid username or password");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully"
      )
    );
});

/* ---------------- LOGOUT ---------------- */

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});

/* ---------------- REFRESH TOKEN ---------------- */

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, {}, "Token refreshed"));
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

/* ---------------- CURRENT USER ---------------- */

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Not logged in"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched"));
});




// get all Users

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}, "_id username email"); // Only return necessary fields
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ------- getProfile---------

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id

  if (!userId) {
    throw new ApiError(401, "Unauthorized")
  }

 

  const user = await User.findById(userId).select(
    "name username email"
  )

  if (!user) {
    throw new ApiError(404, "User not found")
  }

 

  const projects = await Project.find({
    $or: [
      { teamLead: userId },
      { members: userId },
    ],
  }).select("name teamLead")


  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        projects,
      },
      "Profile fetched successfully"
    )
  )
})


export { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, getAllUser, getProfile};

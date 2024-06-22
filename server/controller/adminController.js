import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const validAdmin = await User.findOne({ email, is_admin: 1 });

  if (validAdmin && bcryptjs.compareSync(password, validAdmin.password)) {
    const { password: hashedPassword, ...rest } = validAdmin._doc;
    const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET);
    const expiryDate = new Date(Date.now() + 3600000);

    res
      .cookie("access_token1", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({
        id: validAdmin._id,
        firstName: validAdmin.firstName,
        email: validAdmin.email,
      });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log("req.body", req.body);
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const user = await newUser.save();

  if (user) {
    res.status(201).json({
      //success: true,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("Invalid user data");
  }
});

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ is_admin: 0 }).select(
      "_id firstName lastName email"
    );
    console.log("users", users);
    res.status(200).json({ users });
    console.log("success");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    console.log(user);
    const users = await User.find();
    console.log(users);
    res.status(200).json({ message: "User has been deleted..", users });
    console.log("successfully deleted");
  } catch (error) {
    throw new Error(error);
  }
});

const singleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  const user = await User.findOne({ _id: id });
  console.log("user", user);
  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
});

const editUser = asyncHandler(async (req, res) => {
  console.log("hey");
  try {
    if (
      !req.body.firstName &&
      !req.body.lastName &&
      !req.body.email &&
      !req.body.password
    ) {
      return res.status(400).json({ message: "No fields to update" });
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const { id } = req.params;
    console.log(id);
    const userData = await User.findOne({ _id: id });
    console.log("userData:", userData);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userData._id,
      {
        $set: {
          firstName: req.body.firstName || userData.firstName,
          lastName: req.body.lastName || userData.lastName,
          email: req.body.email || userData.email,
          password: req.body.password || userData.password,
          image: "",
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    });
    console.log("success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const signout = asyncHandler(async (req, res) => {
  res.clearCookie("access_token1");
  res.status(200).json({ message: "Logged out successfully" });
});

export {
  login,
  editUser,
  createUser,
  getUsers,
  deleteUser,
  singleUser,
  signout,
};

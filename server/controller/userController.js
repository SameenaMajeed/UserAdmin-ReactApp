import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, image } = req.body;
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
    image,
  });

  const user = await newUser.save();

  if (user) {
    res.status(201).json({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("Invalid user data");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const validUser = await User.findOne({ email });

  if (validUser && validUser.is_admin === 0 && bcryptjs.compareSync(password, validUser.password)) {
    const { password: hashedPassword, ...rest } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    console.log(token)
    const expiryDate = new Date(Date.now() + 3600000);
    console.log(expiryDate)
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({
        id: validUser._id,
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        email: validUser.email,
        image: validUser.image,
        message: 'Sucessfully logged In'
      });
  } else {
    res.status(400);
    res.json({ message: "Invalid email or password" })
  }
});

const uploadProfileImage = asyncHandler(async(req,res)=>{
  if(!req.file){
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const image = req.file
  console.log(image)

  const {user} = req

  try {

    const userData = await User.findById(user.id)

    if(!userData){
      const oldImagePath = path.join(__dirname,  '..', 'public', 'profilePic', userData.image);
      fs.unlinkSync(oldImagePath);
    }

    userData.image = image.filename

    const updatedUser = await userData.save()
    console.log('updatedUser :' ,updatedUser )

    res.status(200).json({
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      image: updatedUser.image
    })
    
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

})

const updateUser = asyncHandler(async(req,res)=>{
  try {
    const { user } = req.body;
    console.log('user',user)
    const userData = await User.findOne({ _id : user.id });
    console.log('userData' , userData)

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedFields = {
      firstName: req.body.firstName || userData.firstName,
      lastName: req.body.lastName || userData.lastName,
      email: req.body.email || userData.email,
      password: req.body.password ? bcryptjs.hashSync(req.body.password, 10) : userData.password,
      image: req.body.image || userData.image
    };

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// const updateUser = asyncHandler(async(req,res)=>{

//   try {
    
//     const {user} = req
//     const userData = await User.findOne({_id : user.id})

//     if(req.body.firstName === userData.firstName && req.body.email === userData.email){
//       return res.status(400).json({message : 'No field to update'})
//     }

//     if(req.body.password){
//       req.body.password = bcryptjs.hashSync(req.body.password ,10)
//     }

//     if(!userData){
//       return res.status(404).json({ message: "User not found" })
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userData._id,
//       {
//         $set : {
//           firstName: req.body.firstName || userData.firstName,
//           lastName: req.body.lastName || userData.lastName,
//           email: req.body.email || userData.email,
//           password: req.body.password || userData.password,
//           image: req.body.image || userData.image
//         },
//       },
//       { new: true }
//     )

//     if (!updatedUser) {
//       return res.status(500).json({ message: "Failed to update user" });
//     }

//     const {password , ...rest} = updateUser._doc
//     res.status(200).json({
//       id:updatedUser._id,
//       firstName:updatedUser.firstName,
//       lastName:updatedUser.lastName,
//       email:updatedUser.email,
//       image:updatedUser.image
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// })

const logout = asyncHandler(async(req,res)=>{
  res.clearCookie('access_token').status(200).json('Signout success!')
})



export { signup , login ,uploadProfileImage ,updateUser,logout}

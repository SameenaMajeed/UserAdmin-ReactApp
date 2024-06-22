// const mongoose = require('mongoose')

// const userSchema = mongoose.Schema({
//     firstName :{
//         type : String,
//         required:true
//     },
//     lastName :{
//         type : String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
//     image:{
//         type:String,
//     },
//     is_admin:{
//         type:Number,
//         default:0
//     }
// },{ timestamps: true })

// const User = mongoose.model('User',userSchema);

// module.exports = User;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    is_admin: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;

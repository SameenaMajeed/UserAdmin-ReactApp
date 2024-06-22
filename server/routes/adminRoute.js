import express from 'express'
import {createUser, editUser, getUsers,login,deleteUser,singleUser,signout} from '../controller/adminController.js'
import { protectAdmin } from '../middleware/authMidleware.js'

const router = express.Router()

router.post('/login', login)
router.post('/create',protectAdmin, createUser)
router.put('/edit-user/:id',protectAdmin , editUser)
router.get('/getUser',protectAdmin, getUsers);
router.delete('/delete/:id',protectAdmin  , deleteUser)
router.get('/singleUser/:id',protectAdmin , singleUser)
router.get('/signout',signout)

export default router
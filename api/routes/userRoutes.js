import express from 'express'
import { getUsers, addUser, login } from '../controllers/userController.js'
import { verifyToken, requireAdminRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/users', verifyToken, requireAdminRole, getUsers)
router.post('/users', addUser)
router.post('/login', login)

export default router

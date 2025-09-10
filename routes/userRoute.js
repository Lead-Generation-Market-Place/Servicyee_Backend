import express from 'express'
import { getUsers } from '../controllers/userController.js'

const router = express.Router()

// mounted on /api/users, so this will be /api/users
router.get('/', getUsers)

export default router

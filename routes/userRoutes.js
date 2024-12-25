import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {
	createUser,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	loginUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);

router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const {
	createUser,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	loginUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);

router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;

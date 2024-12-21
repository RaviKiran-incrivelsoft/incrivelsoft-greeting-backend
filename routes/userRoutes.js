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
router.get('/', getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

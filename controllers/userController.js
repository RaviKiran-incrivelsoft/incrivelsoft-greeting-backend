const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Create a new user
const createUser = async (req, res) => {
	const { first_name, last_name, email, password } = req.body;

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'Email already in use' });
		}

		// Create new user
		const user = new User({
			first_name,
			last_name,
			email,
			password,
		});

		await user.save();
		res.status(201).json({ message: 'User created successfully!' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Login user (new method)
const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Find the user by email
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		// Compare the provided password with the stored password
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		// Generate a JWT token
		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.json({ token, userId: user._id });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get all users
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select('-password');
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get a user by ID
const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Update a user
const updateUser = async (req, res) => {
	const { first_name, last_name, email } = req.body;

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{ first_name, last_name, email },
			{ new: true } // Return the updated document
		).select('-password');
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(updatedUser);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Delete a user
const deleteUser = async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.params.id);
		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json({ message: 'User deleted successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = {
	createUser,
	loginUser,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
};

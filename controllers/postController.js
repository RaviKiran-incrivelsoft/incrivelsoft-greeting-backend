import cloudinary from '../cloudinary/config.js';
import PostModel from '../models/PostModel.js';

// Create a new post
const createPost = async (req, res) => {
	const { postName, postDescription } = req.body;
	const userId = req.user.userId;
	if (!postDescription || !postName) {
		return res.status(400).send({ error: "postName, postDescription are required..." });
	}
	if (!req.file) {
		return res.status(400).send({ error: "Image or Video is required..." });
	}
	try {
		const result = await cloudinary.uploader.upload(req.file.path, {
			resource_type: req.file.mimetype.startsWith("video") ? "video" : "image",
		});

		const mediaURL = result.secure_url;
		const newPost = new PostModel({ postDescription, postName, userId, mediaURL });
		const savedPost = await newPost.save();
		res.status(201).json(savedPost);
	} catch (err) {
		console.log("Error in the createPost, ", err)
		res.status(500).json({ error: "Internal server error..." });
	}
};

// Get all posts
const getAllPosts = async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const userId = req.user.userId;
		const skip = (page - 1) * limit;
		const posts = await PostModel.find({ $or: [{ userId }, { isGlobal: true }] }).skip(skip).limit(limit);
		const totalPosts = await PostModel.countDocuments({ $or: [{ userId }, { isGlobal: true }] });
		res.status(200).send({ currentPage: page, totalPages: Math.ceil(totalPosts / limit), posts: posts });
	} catch (err) {
		console.log("Error in the getAllCampaigns, ", err)
		res.status(500).json({ error: "Internal server error..." });
	}
};

// Get a post by ID
const getPostById = async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		res.status(200).json(post);
	} catch (err) {
		console.log("Error in the getPostById, ", err)
		res.status(500).json({ error: "Internal server error..." });
	}
};

// Update a post
const updatePost = async (req, res) => {
	try {
		const { postName, postDescription } = req.body;
		const fieldsToUpdate = {};
		if (postDescription !== undefined) {
			fieldsToUpdate.postDescription = postDescription;
		}
		else if (postName !== undefined) {
			fieldsToUpdate.postName = postName;
		}
		else if (req.file && req.file.path) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				resource_type: req.file.mimetype.startsWith("video") ? "video" : "image",
			});
			fieldsToUpdate.mediaURL = result.secure_url;
		}
		const updatedPost = await PostModel.findByIdAndUpdate(
			req.params.id,
			fieldsToUpdate,
			{ new: true, runValidators: true }
		);
		if (!updatedPost) {
			return res.status(404).json({ message: 'Post not found' });
		}
		res.status(200).json(updatedPost);
	} catch (err) {
		console.log("Error in the updatedPost, ", err)
		res.status(500).json({ error: "Internal server error..." });
	}
};

// Delete a post
const deletePost = async (req, res) => {
	try {
		const deletedPost = await PostModel.findByIdAndDelete(req.params.id);
		if (!deletedPost) {
			return res.status(404).json({ message: 'Post not found' });
		}
		res.json({ message: 'Post deleted successfully' });
	} catch (err) {
		console.log("Error in the deletePost, ", err)
		res.status(500).json({ error: "Internal server error..." });
	}
};

export { createPost, getAllPosts, getPostById, updatePost, deletePost };

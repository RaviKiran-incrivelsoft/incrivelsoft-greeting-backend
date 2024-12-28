import express from 'express';
import {createPost, getAllPosts, getPostById, updatePost, deletePost} from "../controllers/postController.js"
import {configureFileUpload} from '../middleware/fileStorage.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();
const uploadSingleFile = configureFileUpload(true, "media");

router.post('/', authMiddleware, uploadSingleFile, createPost);
router.get('/', authMiddleware, getAllPosts);
router.get('/:id', authMiddleware, getPostById);
router.put('/:id', authMiddleware, uploadSingleFile, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;

import express from 'express';
import {createPost, getAllPosts, getPostById, updatePost, deletePost} from "../controllers/postController.js"
import {configureFileUpload} from '../middleware/fileStorage.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const postRouter = express.Router();
const uploadSingleFile = configureFileUpload(true, "media");

postRouter.post('/', authMiddleware, uploadSingleFile, createPost);
postRouter.get('/', authMiddleware, getAllPosts);
postRouter.get('/:id', authMiddleware, getPostById);
postRouter.put('/:id', authMiddleware, uploadSingleFile, updatePost);
postRouter.delete('/:id', authMiddleware, deletePost);

export default postRouter;

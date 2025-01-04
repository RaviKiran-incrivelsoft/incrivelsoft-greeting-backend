import express from 'express';
import { getResponseById } from "../controllers/mailResponseController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';

const responseRouter = express.Router();

responseRouter.get("/:id", authMiddleware, getResponseById);

export default responseRouter;
import express from 'express';
import {createFestival, getFestival, getAllFestivalDetails, updateFestivalDetails, deleteFestivalDetils} from "../controllers/festivalController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';
import { configureFileUpload } from '../middleware/fileStorage.js';

const festivalRouter = express.Router();
const uploadMultipleFiles  =  configureFileUpload(false);

festivalRouter.post("/", authMiddleware, createFestival);
festivalRouter.get("/:id", authMiddleware, getFestival);
festivalRouter.get("/", authMiddleware, getAllFestivalDetails);
festivalRouter.put("/:id", authMiddleware, uploadMultipleFiles, updateFestivalDetails);
festivalRouter.delete("/:id", authMiddleware, deleteFestivalDetils);

export default festivalRouter;
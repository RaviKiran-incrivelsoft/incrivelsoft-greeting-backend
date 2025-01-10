import express from 'express';
import {createBirthDayDetails, getAllBirthDayDetails, getBirthDayDetails, updateBirthDayDetails, deleteBirthDayDetails} from "../controllers/birthDayController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';
import { configureFileUpload } from '../middleware/fileStorage.js';

const birthDayRouter = express.Router();
const uploadMultipleFiles  =  configureFileUpload(false);

birthDayRouter.post("/", authMiddleware, createBirthDayDetails);
birthDayRouter.get("/:id", authMiddleware, getBirthDayDetails);
birthDayRouter.get("/", authMiddleware, getAllBirthDayDetails);
birthDayRouter.put("/:id", authMiddleware, uploadMultipleFiles, updateBirthDayDetails);
birthDayRouter.delete("/:id", authMiddleware, deleteBirthDayDetails);

export default birthDayRouter;
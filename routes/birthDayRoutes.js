import express from 'express';
import {createBirthDayDetails, getAllBirthDayDetails, getBirthDayDetails, updateBirthDayDetails, deleteBirthDayDetails} from "../controllers/birthDayController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';

const birthDayRouter = express.Router();

birthDayRouter.post("/", authMiddleware, createBirthDayDetails);
birthDayRouter.get("/:id", authMiddleware, getBirthDayDetails);
birthDayRouter.get("/", authMiddleware, getAllBirthDayDetails);
birthDayRouter.put("/:id", authMiddleware, updateBirthDayDetails);
birthDayRouter.delete("/:id", authMiddleware, deleteBirthDayDetails);

export default birthDayRouter;
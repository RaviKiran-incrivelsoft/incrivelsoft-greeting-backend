import express from 'express';

import {createSchedule, updateSchedule, getSchedules, deleteSchedule, getSchedulesByStatus} from "../controllers/scheduleController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';

const scheduleRouter = express.Router();

scheduleRouter.post("/", authMiddleware, createSchedule);
scheduleRouter.put("/:id", authMiddleware, updateSchedule);
scheduleRouter.get("/", authMiddleware, getSchedules);
scheduleRouter.delete("/:id", authMiddleware, deleteSchedule);
scheduleRouter.get("/:status", authMiddleware, getSchedulesByStatus);
export {scheduleRouter};
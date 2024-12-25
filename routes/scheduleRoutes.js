import express from 'express';

import {createSchedule, updateSchedule, getSchedules, deleteSchedule} from "../controllers/scheduleController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';

const scheduleRouter = express.Router();

scheduleRouter.post("/", authMiddleware, createSchedule);
scheduleRouter.put("/:id", authMiddleware, updateSchedule);
scheduleRouter.get("/", authMiddleware, getSchedules);
scheduleRouter.delete("/:id", authMiddleware, deleteSchedule);

export {scheduleRouter};
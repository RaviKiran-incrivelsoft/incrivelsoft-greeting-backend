import express from 'express';
import {createEvent, getAllEventDetails, getEventDetails, updateEventDetails, deleteEventDetails} from "../controllers/eventController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';

const eventRouter = express.Router();

eventRouter.post("/", authMiddleware, createEvent);
eventRouter.get("/:id", authMiddleware, getEventDetails);
eventRouter.get("/", authMiddleware, getAllEventDetails);
eventRouter.put("/:id", authMiddleware, updateEventDetails);
eventRouter.delete("/:id", authMiddleware, deleteEventDetails);

export default eventRouter;
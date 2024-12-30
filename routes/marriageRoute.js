import express from 'express';
import {createMarriageDetails, getAllMarriageDetails, getMarriageDetails, updateMarriageDetails, deleteMarriageDetails} from "../controllers/marriageController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';

const marriageRouter = express.Router();

marriageRouter.post("/", authMiddleware, createMarriageDetails);
marriageRouter.get("/:id", authMiddleware, getMarriageDetails);
marriageRouter.get("/", authMiddleware, getAllMarriageDetails);
marriageRouter.put("/:id", authMiddleware, updateMarriageDetails);
marriageRouter.delete("/:id", authMiddleware, deleteMarriageDetails);

export default marriageRouter;
import express from 'express';

import {createTemple, getAllTemples, getTemple, deleteTemple, updateTemple} from "../controllers/templeController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';
import {configureFileUpload} from "../middleware/fileStorage.js";

const templeRouter = express.Router();
const uploadMultipleFiles  =  configureFileUpload(false);

templeRouter.post("/", authMiddleware, uploadMultipleFiles, createTemple);
templeRouter.delete("/:id", authMiddleware, deleteTemple);
templeRouter.get("/", authMiddleware, getAllTemples);
templeRouter.get("/:id", authMiddleware, getTemple)
templeRouter.put("/:id", authMiddleware, uploadMultipleFiles, updateTemple);

export { templeRouter };
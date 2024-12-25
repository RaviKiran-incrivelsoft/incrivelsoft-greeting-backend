import express from 'express';

import {createTempleData, deleteTempleData} from "../controllers/templeController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';
import {configureFileUpload} from "../middleware/fileStorage.js";

const templeRouter = express.Router();
const uploadMultipleFiles  =  configureFileUpload(false);

templeRouter.post("/", authMiddleware, uploadMultipleFiles, createTempleData);
templeRouter.delete("/:id", authMiddleware, deleteTempleData);

export { templeRouter };
import express from 'express';

import {createTempleData, deleteTempleData, getTemplesDetails} from "../controllers/templeController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';
import {configureFileUpload} from "../middleware/fileStorage.js";

const templeRouter = express.Router();
const uploadMultipleFiles  =  configureFileUpload(false);

templeRouter.post("/", authMiddleware, uploadMultipleFiles, createTempleData);
templeRouter.delete("/:id", authMiddleware, deleteTempleData);
templeRouter.get("/", authMiddleware, getTemplesDetails);

export { templeRouter };
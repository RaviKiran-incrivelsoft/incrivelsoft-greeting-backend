import express from 'express';
import { 
  createCampaign, 
  getAllCampaigns, 
  getCampaignById, 
  updateCampaign, 
  deleteCampaign 
} from '../controllers/campaignController.js';
import {configureFileUpload} from '../middleware/fileStorage.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();
const uploadSingleFile = configureFileUpload(true, "media");

router.post('/', authMiddleware, uploadSingleFile, createCampaign);
router.get('/', authMiddleware, getAllCampaigns);
router.get('/:id', authMiddleware, getCampaignById);
router.put('/:id', authMiddleware, uploadSingleFile, updateCampaign);
router.delete('/:id', authMiddleware, deleteCampaign);

export default router;

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
	createCampaign,
	getAllCampaigns,
	getCampaignById,
	updateCampaign,
	deleteCampaign,
} = require('../controllers/campaignController');

const router = express.Router();

router.post('/', authMiddleware, createCampaign);
router.get('/', authMiddleware, getAllCampaigns);
router.get('/:id', authMiddleware, getCampaignById);
router.put('/:id', authMiddleware, updateCampaign);
router.delete('/:id', authMiddleware, deleteCampaign);

module.exports = router;

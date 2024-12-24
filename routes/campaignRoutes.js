const express = require('express');
const {
	createCampaign,
	getAllCampaigns,
	getCampaignById,
	updateCampaign,
	deleteCampaign,
} = require('../controllers/campaignController');
const storeFile = require("../middleware/fileStorage");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/', authMiddleware, storeFile("media"), createCampaign);
router.get('/', authMiddleware, getAllCampaigns);
router.get('/:id', authMiddleware,  getCampaignById);
router.put('/:id', authMiddleware, storeFile("media"), updateCampaign);
router.delete('/:id', authMiddleware,	 deleteCampaign);

module.exports = router;

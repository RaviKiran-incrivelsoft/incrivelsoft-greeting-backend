const express = require('express');
const {
	createCampaign,
	getAllCampaigns,
	getCampaignById,
	updateCampaign,
	deleteCampaign,
} = require('../controllers/campaignController');

const router = express.Router();

router.post('/', createCampaign);
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

module.exports = router;

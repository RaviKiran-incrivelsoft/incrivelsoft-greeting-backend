const Campaign = require('../models/Campaign');

// Create a new campaign
const createCampaign = async (req, res) => {
	const { campaignName, status } = req.body;

	try {
		const newCampaign = new Campaign({ campaignName, status });
		const savedCampaign = await newCampaign.save();
		res.status(201).json(savedCampaign);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Get all campaigns
const getAllCampaigns = async (req, res) => {
	try {
		const campaigns = await Campaign.find();
		res.json(campaigns);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get a campaign by ID
const getCampaignById = async (req, res) => {
	try {
		const campaign = await Campaign.findById(req.params.id);
		if (!campaign) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		res.json(campaign);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Update a campaign
const updateCampaign = async (req, res) => {
	try {
		const updatedCampaign = await Campaign.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedCampaign) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		res.json(updatedCampaign);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Delete a campaign
const deleteCampaign = async (req, res) => {
	try {
		const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
		if (!deletedCampaign) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		res.json({ message: 'Campaign deleted successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = {
	createCampaign,
	getAllCampaigns,
	getCampaignById,
	updateCampaign,
	deleteCampaign,
};

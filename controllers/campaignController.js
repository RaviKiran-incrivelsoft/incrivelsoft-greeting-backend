const Campaign = require('../models/Campaign');
const User = require('../models/User');

// Create a new campaign
const createCampaign = async (req, res) => {
	const { campaignName, status, media } = req.body;

	try {
		const userId = req.user.userId;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const newCampaign = new Campaign({
			campaignName,
			status,
			media,
			userId,
		});

		await newCampaign.save();
		res.status(201).json({ message: 'Campaign created successfully!' });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Get all campaigns
const getAllCampaigns = async (req, res) => {
	try {
		const campaigns = await Campaign.find()
			.populate('userId', 'first_name last_name email')
			.select('-__v');
		res.json(campaigns);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get a campaign by ID
const getCampaignById = async (req, res) => {
	try {
		const campaign = await Campaign.findById(req.params.id)
			.populate('userId', 'first_name last_name email')
			.select('-__v');
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
	const { campaignName, status, media } = req.body;
	try {
		const campaign = await Campaign.findById(req.params.id);

		if (!campaign) {
			return res.status(404).json({ message: 'Campaign not found' });
		}

		if (campaign.userId.toString() !== req.user.userId) {
			return res.status(403).json({ message: 'Not authorized to update this campaign' });
		}
		campaign.campaignName = campaignName || campaign.campaignName;
		campaign.status = status || campaign.status;
		campaign.media = media || campaign.media;

		const updatedCampaign = await campaign.save();
		res.json({ message: 'Campaign updated successfully!', updatedCampaign });

	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// Delete a campaign
const deleteCampaign = async (req, res) => {
	try {
		const campaign = await Campaign.findById(req.params.id);

		if (!campaign) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		if (campaign.userId.toString() !== req.user.userId) {
			return res.status(403).json({ message: 'Not authorized to delete this campaign' });
		}

		await Campaign.findByIdAndDelete(req.params.id);
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

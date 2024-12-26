import cloudinary from '../cloudinary/config.js';
import Campaign from '../models/Campaign.js';
// const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Create a new campaign
const createCampaign = async (req, res) => {
	const { campaignName, campaignDescription } = req.body;
	const userId = req.user.userId;
	if (!campaignDescription || !campaignName) {
		return res.status(400).send({ error: "campaignName, campaignDescription are required..." });
	}
	if (!req.file) {
		return res.status(400).send({ error: "Image or Video is required..." });
	}
	try {
		const result = await cloudinary.uploader.upload(req.file.path, {
			resource_type: req.file.mimetype.startsWith("video") ? "video" : "image",
		});

		const mediaURL = result.secure_url;
		const newCampaign = new Campaign({ campaignName, campaignDescription, userId, mediaURL });
		const savedCampaign = await newCampaign.save();
		// savedCampaign.mediaURL = `${BASE_URL}/${savedCampaign.mediaURL}`;
		res.status(201).json(savedCampaign);
	} catch (err) {
		console.log("Error in the createCampaign, ", err)
		res.status(500).json({ error: "Internal server error..." });
	}
};

// Get all campaigns
const getAllCampaigns = async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const userId = req.user.userId;
		const skip = (page - 1) * limit;
		const campaigns = await Campaign.find({ userId }).skip(skip).limit(limit);
		const totalCampaigns = await Campaign.countDocuments({ userId });
		// const campaignWithHostedUrl = campaigns.map((campaign) => ({ ...campaign.toObject(), mediaURL: `${BASE_URL}/${campaign.mediaURL}` }));
		res.status(200).send({ currentPage: page, totalPages: Math.ceil(totalCampaigns / limit), campaigns: campaigns });
	} catch (err) {
		console.log("Error in the getAllCampaigns, ", err)
		res.status(500).json({ error: "Internal server error..." });
	}
};

// Get a campaign by ID
const getCampaignById = async (req, res) => {
	try {
		const campaign = await Campaign.findById(req.params.id);
		if (!campaign) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		// campaign.mediaURL = `${BASE_URL}/${campaign.mediaURL}`
		res.status(200).json(campaign);
	} catch (err) {
		console.log("Error in the getCampaignById, ", err)
		res.status(500).json({ error: "Internal server error..." });
	}
};

// Update a campaign
const updateCampaign = async (req, res) => {
	try {
		const { campaignName, campaignDescription } = req.body;
		const fieldsToUpdate = {};
		if (campaignDescription !== undefined) {
			fieldsToUpdate.campaignDescription = campaignDescription;
		}
		else if (campaignName !== undefined) {
			fieldsToUpdate.campaignName = campaignName;
		}
		else if (req.file && req.file.path) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				resource_type: req.file.mimetype.startsWith("video") ? "video" : "image",
			});
			fieldsToUpdate.mediaURL = result.secure_url;
		}
		const updatedCampaign = await Campaign.findByIdAndUpdate(
			req.params.id,
			fieldsToUpdate,
			{ new: true, runValidators: true }
		);
		if (!updatedCampaign) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		res.status(200).json(updatedCampaign);
	} catch (err) {
		console.log("Error in the updateCampaign, ", err)
		res.status(500).json({ error: "Internal server error..." });
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
		console.log("Error in the deleteCampaign, ", err)
		res.status(500).json({ error: "Internal server error..." });
	}
};

export { createCampaign, getAllCampaigns, getCampaignById, updateCampaign, deleteCampaign };

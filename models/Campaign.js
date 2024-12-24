<<<<<<< HEAD
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const campaignSchema = new mongoose.Schema({
	campaignName: {
		type: String,
		required: true,
	},
	campaignDescription: {
		type: String,
		required: true
	},
	mediaURL: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: ["active", "inactive"],
		default: 'active',
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "UserDetails"
	}
});

module.exports = mongoose.model('CampaignDetails', campaignSchema);
=======
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const campaignSchema = new mongoose.Schema({
	campaignId: {
		type: String,
		default: uuidv4,
		unique: true,
	},
	campaignName: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: 'active',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	media: {
		type: {
			type: String,
			enum: ['image', 'video'],
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

module.exports = mongoose.model('Campaign', campaignSchema);
>>>>>>> d0adf6f0bb198a25d1e18b1388978d580228e249

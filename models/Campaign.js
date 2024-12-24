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

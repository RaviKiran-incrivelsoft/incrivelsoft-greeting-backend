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
});

module.exports = mongoose.model('Campaign', campaignSchema);

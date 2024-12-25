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

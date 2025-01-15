import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UserDetails',
		required: true,
	},
	templatesCreated: {
		birthday: { type: Number, default: 0 },
		festival: { type: Number, default: 0 },
		anniversary: { type: Number, default: 0 },
		event: { type: Number, default: 0 },
		occasion: { type: Number, default: 0 },
		temple: { type: Number, default: 0 },
	},
	schedules: {
		birthday: { schedule_now: { type: Number, default: 0 }, schedule_later: { type: Number, default: 0 }, pause: { type: Number, default: 0 }, completed: { type: Number, default: 0 }, automate: { type: Number, default: 0 } },
		festival: { schedule_now: { type: Number, default: 0 }, schedule_later: { type: Number, default: 0 }, pause: { type: Number, default: 0 }, completed: { type: Number, default: 0 }, automate: { type: Number, default: 0 } },
		anniversary: { schedule_now: { type: Number, default: 0 }, schedule_later: { type: Number, default: 0 }, pause: { type: Number, default: 0 }, completed: { type: Number, default: 0 }, automate: { type: Number, default: 0 } },
		event: { schedule_now: { type: Number, default: 0 }, schedule_later: { type: Number, default: 0 }, pause: { type: Number, default: 0 }, completed: { type: Number, default: 0 }, automate: { type: Number, default: 0 } },
		occasion: { schedule_now: { type: Number, default: 0 }, schedule_later: { type: Number, default: 0 }, pause: { type: Number, default: 0 }, completed: { type: Number, default: 0 }, automate: { type: Number, default: 0 } },
		temple: { schedule_now: { type: Number, default: 0 }, schedule_later: { type: Number, default: 0 }, pause: { type: Number, default: 0 }, completed: { type: Number, default: 0 }, automate: { type: Number, default: 0 } },
	},
	media: {
		birthday: {
			whatsapp: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			email: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			both: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } }
		},
		festival: {
			whatsapp: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			email: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			both: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } }
		},
		anniversary: {
			whatsapp: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			email: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			both: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } }
		},
		event: {
			whatsapp: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			email: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			both: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } }
		},
		occasion: {
			whatsapp: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			email: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			both: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } }
		},
		temple: {
			whatsapp: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			email: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
			both: { success: { type: Number, default: 0 }, failed: { type: Number, default: 0 }, pending: { type: Number, default: 0 } }
		}
	}
}, { timestamps: true });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
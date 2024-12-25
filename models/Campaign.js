import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const CampaignDetails = mongoose.model('CampaignDetails', campaignSchema);

export default CampaignDetails;

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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

const CampaignDetails = mongoose.model('CampaignDetails', campaignSchema);

export default CampaignDetails;

import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    address: {
        type: String,
        required: true,
    },
    taxId: {
        type: String,
    },
    phone: {
        type: String,
    },
    fax: {
        type: String,
    },
    templeDescription: {
        type: String,
    },
    websiteUrl: {
        type: String,
        required: true,
    },
    facebookUrl: {
        type: String,
    },
    twitterUrl: {
        type: String,
    },
    instagramUrl: {
        type: String,
    },
    paypalQrCodeURL: {
        type: String,
    },
    zelleQrCodeURL: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDetails",
        required: true
    },
    csvUser: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "CSVUsers",
        default: [],
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CampaignDetails",
        required: true
    }

}, { timestamps: true });

const TempleDetailsModel = mongoose.model('TempleDetails', dataSchema);

export { TempleDetailsModel };

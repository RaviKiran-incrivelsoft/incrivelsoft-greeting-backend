import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    templeName: {
        type: String,
        required: true,
    },
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
    csvData: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "CSVUsers",
        default: [],
    },
    postDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostDetails"
    },
    response: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "mailresponse",
        default: [],
    },

}, { timestamps: true });


// Middleware to delete related csvData before removing a BirthDaysGreetings document
dataSchema.pre('findOneAndDelete', async function (next) {
    const docToDelete = await this.model.findOne(this.getFilter());
    if (docToDelete && docToDelete.csvData.length > 0) {
        await mongoose.model('CSVUsers').deleteMany({ _id: { $in: docToDelete.csvData } });
    }
    next();
});

const TempleDetailsModel = mongoose.model('TempleDetailsGreetings', dataSchema);

export { TempleDetailsModel };

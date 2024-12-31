import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    csvData: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "CSVCoupleUsers"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDetails",
        required: true
    },
    postDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostDetails"
    }
}, { timestamps: true });

const MarriageModel = mongoose.model('MarriagesGreetings', dataSchema);

export { MarriageModel };
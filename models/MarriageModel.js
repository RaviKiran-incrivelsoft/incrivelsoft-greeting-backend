import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    husband_name: {
        type: String,
        required: true
    },
    wife_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    marriage_date: {
        type: String,
        required: true
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
});

const MarriageModel = mongoose.model('MarriageModel', dataSchema);

export { MarriageModel };
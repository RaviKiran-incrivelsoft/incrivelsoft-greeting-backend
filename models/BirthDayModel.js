import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
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
    postDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostDetails"
    }
});

const BirthDayModel = mongoose.model('BirthDayModel', dataSchema);

export { BirthDayModel };
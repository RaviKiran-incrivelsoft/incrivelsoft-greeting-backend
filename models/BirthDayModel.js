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

const BirthDayModel = mongoose.model('BirthDaysGreetings', dataSchema);

export { BirthDayModel };
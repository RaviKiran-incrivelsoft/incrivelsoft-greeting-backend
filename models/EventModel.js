import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventDate: {
        type: String,
        required: true,
    },
    address: {
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

const CSVUsers = mongoose.model('CSVUsers', dataSchema);

export { CSVUsers };
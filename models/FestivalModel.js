import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = new Schema({
    festivalName: {
        type: String,
        required: true,
    },
    festivalDate: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
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
    }
}, { timestamps: true });

const FestivalSchema = mongoose.model('FestivalsGreetings', dataSchema);

export { FestivalSchema };
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

const FestivalSchema = mongoose.model('FestivalSchema', dataSchema);

export { FestivalSchema };
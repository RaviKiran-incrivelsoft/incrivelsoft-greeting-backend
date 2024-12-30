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
    csvData: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "CSVUsers",
        default: [],
    },
    postDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostDetails"
    }
});

const EventSchema = mongoose.model('EventsGreetings', dataSchema);

export { EventSchema };
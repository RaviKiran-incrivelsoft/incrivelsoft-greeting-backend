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
})

const EventSchema = mongoose.model('EventsGreetings', dataSchema);

export { EventSchema };
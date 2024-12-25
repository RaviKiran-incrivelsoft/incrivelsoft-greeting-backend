import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = Schema({
    schedule: {
        type: String,
        enum: ["schedule_now", "schedule_later", "pause", "completed"]
    },
    time: {
        type: Date,
        default: Date.now,
    },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TempleDetails",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDetails",
        required: true
    }
});
const scheduleSchema = mongoose.model("ScheduleDetails", dataSchema)
export {scheduleSchema};
import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = Schema({
    schedule: {
        type: String,
        enum: ["schedule_now", "schedule_later", "pause", "completed", "automate"]
    },
    time: {
        type: Date,
        default: Date.now,
    },
    mode: {
        type: String,
        enum: ["whatsapp", "email", "both"],
        default: "email"
    },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TempleDetails",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDetails",
        required: true
    }
});
const scheduleSchema = mongoose.model("ScheduleDetails", dataSchema)
export {scheduleSchema};
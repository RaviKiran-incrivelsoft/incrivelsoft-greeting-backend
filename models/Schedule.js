import mongoose from 'mongoose';

const { Schema } = mongoose;

const dataSchema = Schema({
    schedule: {
        type: String,
        enum: ["schedule_now", "schedule_later", "pause", "completed", "automate"],
        default: "pause"
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDetails",
        required: true
    },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TempleDetailsGreetings",
    },
    birthday: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BirthDaysGreetings",
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventsGreetings",
    },
    festival: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FestivalsGreetings",
    },
    marriage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MarriagesGreetings",
    }
   
}, {timestamps: true});
const scheduleSchema = mongoose.model("ScheduleDetails", dataSchema)
export {scheduleSchema};
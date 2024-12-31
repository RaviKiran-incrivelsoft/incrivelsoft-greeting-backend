import schedule from 'node-schedule';
import { scheduleSchema } from '../models/Schedule.js';
import { sendScheduledMailsFromTemple, sendAutoMailsFromTemple } from "../utils/templeUtils.js";
import { sendScheduledMailsFromFestival } from "../utils/festivalUtils.js"
import {sendScheduledMailsFromBirthDay, sendAutoMailsFromBirthDay} from "../utils/birthDayUtils.js"


const scheduleJobs = (job) => {
    try {
        if (job.schedule === 'schedule_now') {
            console.log(`Executing schedule_now for job ID: ${job._id}`);
            handleJobExecution(job);
        } 
        else if (job.schedule === "schedule_later") {
            const scheduledTime = new Date(job.time);

            if (isNaN(scheduledTime) || scheduledTime < new Date()) {
                console.log(`Invalid or past schedule for job ID: ${job._id}`);
                return; // Skip invalid or past dates
            }

            schedule.scheduleJob(job._id.toString(), scheduledTime, async () => {
                console.log(`Executing job for ID: ${job._id}`);
                await handleJobExecution(job);
            });
        } 
        else if (job.schedule === 'pause') {
            const existingJob = schedule.scheduledJobs[job._id.toString()];
            if (existingJob) {
                console.log(`Pausing job with ID: ${job._id}`);
                existingJob.cancel();
            }
        } 
        else {
            console.log(`Invalid schedule type for job ID: ${job._id}`);
        }
    } catch (error) {
        console.error(`Error handling job ID: ${job._id}`, error);
    }
};

const handleJobExecution = async (job) => {
    const fields = ["temple", "birthday", "event", "festival", "marriage"];
    const fieldToPopulate = fields.find((field) => job[field]);
    if (!fieldToPopulate) {
        console.log("Invalid request.");
        return;
    }

    try {
        switch (fieldToPopulate) {
            case "temple":
                if (job.mode === "email") {
                    await sendScheduledMailsFromTemple(job.temple);
                }
                else if (job.mode === "whatsapp") {
                    console.log("Whatsapp not yet implemented...");
                }
                else {
                    await sendScheduledMailsFromTemple(job.temple);
                    console.log("Whatsapp not yet implemented...");
                }

                break;
            case "birthday":
                if (job.mode === "email") {
                    await sendScheduledMailsFromBirthDay(job.birthday);
                }
                else if (job.mode === "whatsapp") {
                    console.log("Whatsapp not yet implemented...");
                }
                else {
                    await sendScheduledMailsFromBirthDay(job.birthday);
                    console.log("Whatsapp not yet implemented...");
                }
                break;
            case "event":
                if (job.mode === "email") {
                    await sendScheduledMailsFromTemple(job.temple);
                }
                else if (job.mode === "whatsapp") {
                    console.log("Whatsapp not yet implemented...");
                }
                else {
                    await sendScheduledMailsFromTemple(job.temple);
                    console.log("Whatsapp not yet implemented...");
                }
                break;
            case "festival":
                if (job.mode === "email") {
                    await sendScheduledMailsFromFestival(job.festival);
                }
                else if (job.mode === "whatsapp") {
                    console.log("Whatsapp not yet implemented...");
                }
                else {
                    sendScheduledMailsFromFestival(job.festival);
                    console.log("Whatsapp not yet implemented...");
                }
                break;
            case "marriage":
                if (job.mode === "email") {
                    await sendScheduledMailsFromTemple(job.temple);
                }
                else if (job.mode === "whatsapp") {
                    console.log("Whatsapp not yet implemented...");
                }
                else {
                    await sendScheduledMailsFromTemple(job.temple);
                    console.log("Whatsapp not yet implemented...");
                }
                break;
            default:
                console.log("Invalid request.");
        }
        await scheduleSchema.findByIdAndUpdate(job._id, { schedule: 'completed' });
    } catch (error) {
        console.error(`Error executing job ID: ${job._id}`, error);
    }
};

/**
 * Watch the ScheduleDetails collection for changes.
 */
export const watchSchedules = async () => {
    try {
        const changeStream = scheduleSchema.watch();
        console.log('Watching ScheduleDetails collection for changes...');

        changeStream.on('change', async (change) => {
            console.log('Change detected:', change);

            if (change.operationType === 'insert') {
                const newJob = change.fullDocument;
                console.log("Inserted: ", newJob);
                if (['schedule_now', 'schedule_later'].includes(newJob.schedule)) {
                    scheduleJobs(newJob);
                }
            }

            if (change.operationType === 'update') {
                const updatedJobId = change.documentKey._id;
                const updatedJob = await scheduleSchema.findById(updatedJobId);
                if (updatedJob && updatedJob.schedule !== "completed") {
                    if (updatedJob.schedule === 'pause') {
                        const existingJob = schedule.scheduledJobs[updatedJob_id.toString()];
                        if (existingJob) {
                            console.log(`Pausing job with ID: ${updatedJobId}`);
                            existingJob.cancel();
                        }
                    } else {
                        scheduleJobs(updatedJob);
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error watching ScheduleDetails collection:', error);
    }
};


schedule.scheduleJob('26 09 * * *', async () => {
    console.log('Scheduled job triggered at:', new Date());
    sendAutoMailsFromTemple();
    sendAutoMailsFromBirthDay();

});

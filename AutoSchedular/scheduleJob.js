import mongoose from 'mongoose';
import schedule from 'node-schedule';
import { scheduleSchema } from '../models/Schedule.js';
import sendGreetings from "../mailService/mailService.js";
import sendMails from "../utils/checkBirthAndGreetingsByEmail.js";
/**
 * Schedule jobs automatically based on the database records.
 */
const scheduleJobs = async () => {
    try {
        // Fetch all schedules from the database
        const schedules = await scheduleSchema.find({ schedule: { $in: ['schedule_now', 'schedule_later'] } })
            .populate('temple')
            .populate('user');

        schedules.forEach((job) => {
            const scheduledTime = new Date(job.time);

            // Skip jobs with invalid or past dates for 'schedule_later'
            if (isNaN(scheduledTime) || (job.schedule === "schedule_later" && scheduledTime < new Date())) {
                console.log(`Skipping invalid or past schedule for job ID: ${job._id}`);
                return;
            }

            // Schedule the job
            schedule.scheduleJob(job._id.toString(), scheduledTime, async () => {
                try {
                    console.log(`Executing scheduled job for ID: ${job._id}`);
                    if (job.mode === "email") {
                        await sendGreetings(job.temple);  // Ensure this function returns a promise and handles errors
                        console.log(`Temple: ${job.temple}, User: ${job.user}`);
                        await scheduleSchema.findByIdAndUpdate(job._id, { schedule: 'completed' });
                    }
                    else if (job.mode === "whatsapp") {
                        console.log("Whatsapp services is not yet implemented...");
                    }
                    else {
                        await sendGreetings(job.temple);  // Ensure this function returns a promise and handles errors
                        console.log(`Temple: ${job.temple}, User: ${job.user}`);
                        await scheduleSchema.findByIdAndUpdate(job._id, { schedule: 'completed' });
                        console.log("Whatsapp service is not yet implemented...");

                    }
                    // Mark the schedule as completed

                } catch (error) {
                    console.error(`Error executing job ID: ${job._id}`, error);
                }
            });

            console.log(`Scheduled job ID: ${job._id} for time: ${scheduledTime}`);
        });
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
};

/**
 * Watch the ScheduleDetails collection for changes.
 */
const watchSchedules = async () => {
    try {
        const changeStream = scheduleSchema.watch();

        console.log('Watching ScheduleDetails collection for changes...');

        changeStream.on('change', async (change) => {
            console.log('Change detected:', change);

            if (change.operationType === 'insert') {
                const newJob = change.fullDocument;
                console.log("Inserted: ", newJob);
                if (newJob.schedule === "schedule_later" || newJob.schedule === "schedule_now")
                    await handleJob(newJob);
            }

            if (change.operationType === 'update') {
                const updatedJobId = change.documentKey._id;
                const updatedFields = change.updateDescription.updatedFields;

                console.log(`Job updated with ID: ${updatedJobId}`, updatedFields);

                const updatedJob = await scheduleSchema.findById(updatedJobId);
                if (updatedJob && (updatedJob.schedule !== "completed" || updatedJob.schedule !== "automate")) {
                    await handleJob(updatedJob);
                }
            }
        });
    } catch (error) {
        console.error('Error watching ScheduleDetails collection:', error);
    }
};

const handleJob = async (job, isUpdate = false) => {
    try {

        if (job.schedule === 'schedule_now') {
            console.log(`Executing schedule_now for job ID: ${job._id}`);

            // Execute the job immediately
            try {
                if (job.mode === "email") {
                    await sendGreetings(job.temple); // Ensure this function is awaited and handles errors properly
                    console.log(`Temple: ${job.temple}, User: ${job.user}`);
                    await scheduleSchema.findByIdAndUpdate(job._id, { schedule: 'completed' }); // Mark as completed
                }
                else if (job.mode === "whatsapp") {
                    console.log("Whatsapp service is not yet implemented...");
                }
                else {
                    await sendGreetings(job.temple); // Ensure this function is awaited and handles errors properly
                    console.log(`Temple: ${job.temple}, User: ${job.user}`);
                    console.log("Whatsapp service is not yet implemented...");
                    await scheduleSchema.findByIdAndUpdate(job._id, { schedule: 'completed' }); // Mark as completed
                }
            } catch (error) {
                console.error(`Error executing schedule_now job ID: ${job._id}`, error);
            }
            return; // No need to schedule or handle further
        }

        else if (job.schedule === 'schedule_later') {
            const scheduledTime = new Date(job.time);

            if (isNaN(scheduledTime) || scheduledTime < new Date()) {
                console.log(`Invalid or past schedule for job ID: ${job._id}`);
                return; // Skip invalid or past dates
            }



            // Schedule the new or updated job
            schedule.scheduleJob(job._id.toString(), scheduledTime, async () => {
                try {
                    console.log(`Executing job for ID: ${job._id}`);
                    if (job.mode === "email") {
                        await sendGreetings(job.temple); // Ensure this function is awaited and handles errors properly
                        console.log(`Temple: ${job.temple}, User: ${job.user}`);
                        await scheduleSchema.findByIdAndUpdate(job._id, { schedule: 'completed' }); // Mark as completed
                    }
                    else if (job.mode === "whatsapp") {
                        console.log("Whatsapp service is not yet implemented...");
                    }
                    else {
                        await sendGreetings(job.temple); // Ensure this function is awaited and handles errors properly
                        console.log(`Temple: ${job.temple}, User: ${job.user}`);
                        console.log("Whatsapp service is not yet implemented...");
                        await scheduleSchema.findByIdAndUpdate(job._id, { schedule: 'completed' }); // Mark as completed
                    }
                } catch (error) {
                    console.log(`Error executing job ID: ${job._id}`, error);
                }
            });

            console.log(`Scheduled job ID: ${job._id} for time: ${scheduledTime}`);
        } else if (job.schedule === 'pause') {
            const existingJob = schedule.scheduledJobs[job._id.toString()];
            if (existingJob) {
                console.log(`Pausing job with ID: ${job._id}`);
                existingJob.cancel();
            }
        }
    } catch (error) {
        console.error(`Error handling job ID: ${job._id}`, error);
    }
};

schedule.scheduleJob('09 14 * * *', async() => {
    console.log('Scheduled job triggered at:', new Date());
    await sendMails();
});


export { watchSchedules, scheduleJobs };
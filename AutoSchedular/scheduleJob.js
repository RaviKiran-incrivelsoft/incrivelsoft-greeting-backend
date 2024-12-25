import mongoose from 'mongoose';
import schedule from 'node-schedule';
import { scheduleSchema } from '../models/Schedule.js';
import sendGreetings from "../mailService/mailService.js";

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
                    await sendGreetings(job.temple);  // Ensure this function returns a promise and handles errors
                    console.log(`Temple: ${job.temple}, User: ${job.user}`);

                    // Mark the schedule as completed
                    await scheduleSchema.findByIdAndUpdate(job._id, { schedule: 'completed' });
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
                await handleJob(newJob);
            }

            if (change.operationType === 'update') {
                const updatedJobId = change.documentKey._id;
                const updatedFields = change.updateDescription.updatedFields;

                console.log(`Job updated with ID: ${updatedJobId}`, updatedFields);

                const updatedJob = await scheduleSchema.findById(updatedJobId);
                if (updatedJob) {
                    await handleJob(updatedJob, true); // Pass true to indicate an update
                }
            }
        });
    } catch (error) {
        console.error('Error watching ScheduleDetails collection:', error);
    }
};

const handleJob = async (job, isUpdate = false) => {
    const { _id, schedule, time, temple, user } = job;
    try {

        if (schedule === 'schedule_now') {
            console.log(`Executing schedule_now for job ID: ${_id}`);

            // Execute the job immediately
            try {
                await sendGreetings(temple); // Ensure this function is awaited and handles errors properly
                console.log(`Temple: ${temple}, User: ${user}`);
                await scheduleSchema.findByIdAndUpdate(_id, { schedule: 'completed' }); // Mark as completed
            } catch (error) {
                console.error(`Error executing schedule_now job ID: ${_id}`, error);
            }
            return; // No need to schedule or handle further
        }

        if (schedule === 'schedule_later') {
            const scheduledTime = new Date(time);

            if (isNaN(scheduledTime) || scheduledTime < new Date()) {
                console.log(`Invalid or past schedule for job ID: ${_id}`);
                return; // Skip invalid or past dates
            }

            if (isUpdate) {
                // Cancel existing job if it's being updated
                const existingJob = schedule.scheduledJobs[_id.toString()];
                if (existingJob) {
                    console.log(`Cancelling existing job with ID: ${_id}`);
                    existingJob.cancel();
                }
            }

            // Schedule the new or updated job
            schedule.scheduleJob(_id.toString(), scheduledTime, async () => {
                try {
                    console.log(`Executing job for ID: ${_id}`);
                    await sendGreetings(temple); // Ensure this function handles errors
                    console.log(`Temple: ${temple}, User: ${user}`);

                    // Mark the job as completed
                    await scheduleSchema.findByIdAndUpdate(_id, { schedule: 'completed' });
                } catch (error) {
                    console.error(`Error executing job ID: ${_id}`, error);
                }
            });

            console.log(`Scheduled job ID: ${_id} for time: ${scheduledTime}`);
        } else if (schedule === 'pause') {
            const existingJob = schedule.scheduledJobs[_id.toString()];
            if (existingJob) {
                console.log(`Pausing job with ID: ${_id}`);
                existingJob.cancel();
            }
        }
    } catch (error) {
        console.error(`Error handling job ID: ${_id}`, error);
    }
};


export { watchSchedules, scheduleJobs };

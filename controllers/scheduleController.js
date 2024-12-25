import { scheduleSchema } from "../models/Schedule.js";

const createSchedule = async (req, res) => {
    try {
        const { schedule, time, temple } = req.body;
        const user = req.user.userId;
        const requiredFields = { schedule, time, temple };
        const missingFields = [];
        Object.keys(requiredFields).forEach(key => {
            if (requiredFields[key] === undefined) {
                missingFields.push(key);
            }
        });
        if (missingFields.length !== 0) {
            return res.status(400).send({ error: `${missingFields} are required...` });
        }
        const saveSchedule = new scheduleSchema({ schedule, time, temple, user });
        await saveSchedule.save();
        res.status(201).send({ message: `Schedule is create with id: ${saveSchedule._id}` })
    } catch (error) {
        console.log("Error in the createSchedule, ", error);
        res.status(500).send({ error: "Internal Server error..." });
    }
}

const updateSchedule = async (req, res) => {
    try {
        const { schedule, time, media } = req.body;
        const { id } = req.params;
        const fieldsToUpdate = {};
        if (schedule !== undefined) {
            fieldsToUpdate.schedule = schedule;
        }
        if (time !== undefined) {
            fieldsToUpdate.time = time;
        }
        const updateSchedule = await scheduleSchema.findByIdAndUpdate(id, fieldsToUpdate, { new: true, runValidators: true });
        if (!updateSchedule) {
            return res.status(404).send({ error: `Schedule is not found with id: ${id}` });
        }
        return res.status(200).send({ message: "Schedule is updated...", updateSchedule })
    } catch (error) {
        console.log("Error in the updateSchedule, ", error);
        res.status(500).send({ error: "Internal Server error..." });
    }
}

const getSchedules = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const schedules = await scheduleSchema.find({ user: req.user.userId })
            .skip(skip)
            .limit(limit)
            .populate('temple', 'templeName templeTitle address templeDescription websiteUrl');
        const totalSchedules = await scheduleSchema.countDocuments({ user: req.user.userId });
        res.status(200).send({ currentPage: page, totalPages: Math.ceil(totalSchedules / limit), schedules });
    } catch (error) {
        console.log("Error in the getSchedules, ", error);
        res.status(500).send({ error: "Internal Server error..." });
    }
}

const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteSchedule = await scheduleSchema.findByIdAndDelete(id);
        if (!deleteSchedule) {
            return res.status(404).send({ error: `Schedule details with id: ${id} is found...` });
        }
        res.status(200).send({ message: `schedule with id: ${id} is deleted` });
    } catch (error) {
        console.log("Error in the deleteSchedule, ", error);
        res.status(500).send({ error: "Internal Server error..." });
    }
}

export { createSchedule, updateSchedule, getSchedules, deleteSchedule };
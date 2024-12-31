import { scheduleSchema } from "../models/Schedule.js";

const createSchedule = async (req, res) => {
    try {
        const { schedule, time, temple, marriage, festival, event, birthday, mode } = req.body;
        const fieldsToSave =  { schedule, time, temple, marriage, festival, event, birthday, mode };
        Object.keys(fieldsToSave).forEach((key) => {
            if(fieldsToSave[key] === undefined)
            {
                delete fieldsToSave[key];
            }
        })
        const user = req.user.userId;
        fieldsToSave.user = user;
        console.log("fieldsToSave")

        if (fieldsToSave.schedule === "schedule_later" && !fieldsToSave.time) {
            return res.status(400).send({ error: "Time is required for 'schedule_later'." });
        }
        if(!fieldsToSave.mode)
        {
            return res.status(400).send({error: "Mode is required..."});
        }
        const saveSchedule = new scheduleSchema(fieldsToSave);
        await saveSchedule.save();
        res.status(201).send({ message: 'Schedule created Successfully', saveSchedule })
    } catch (error) {
        console.log("Error in the createSchedule, ", error);
        res.status(500).send({ error: "Internal Server error..." });
    }
}

const updateSchedule = async (req, res) => {
    try {
        const { schedule, time, temple, marriage, festival, event, birthday, mode } = req.body;
        const {id} = req.params;
        const fieldsToUpdate =  { schedule, time, temple, marriage, festival, event, birthday, mode };
        Object.keys(fieldsToUpdate).forEach((key) => {
            if(fieldsToUpdate[key] === undefined)
            {
                delete fieldsToUpdate[key];
            }
        })
        

        if (fieldsToUpdate.schedule === "schedule_later" && !fieldsToUpdate.time) {
            return res.status(400).send({ error: "Time is required for 'schedule_later'." });
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
        // Extract query parameters and convert to numbers
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Ensure the user is authenticated
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).send({ error: "Unauthorized access. User ID is required." });
        }

        // Fetch schedules with pagination
        const schedules = await scheduleSchema.find({ user: userId })
            .skip(skip)
            .limit(limit)
            .lean(); // Use .lean() for faster read operations

        // Dynamically populate the non-null fields
        const fields = ["temple", "birthday", "event", "festival", "marriage"];
        for (const schedule of schedules) {
            const fieldToPopulate = fields.find((field) => schedule[field]);
            if (fieldToPopulate) {
                await scheduleSchema.populate(schedule, { path: fieldToPopulate });
            }
        }

        // Count total schedules
        const totalSchedules = await scheduleSchema.countDocuments({ user: userId });

        // Respond with paginated data
        res.status(200).send({
            currentPage: page,
            totalPages: Math.ceil(totalSchedules / limit),
            schedules,
        });
    } catch (error) {
        console.error("Error in the getSchedules:", error);
        res.status(500).send({ error: "Internal Server error..." });
    }
};


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

const fetchSchedules = async (schedule, type) => {
    try {
        // Fetch schedules based on the `schedule` parameter
        const schedules = await scheduleSchema.find({ schedule });

        // Filter schedules that have a truthy value for the specified `type`
        if (!type) {
            console.error("Type parameter is missing or invalid.");
            return [];
        }

        return schedules.filter((item) => item[type]);
    } catch (error) {
        console.error("Error in the fetchSchedules function:", error);
        return [];
    }
};


export { createSchedule, updateSchedule, getSchedules, deleteSchedule, fetchSchedules };
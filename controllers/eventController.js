import {EventSchema} from "../models/EventModel.js";
import { saveUsers } from "./csvUserController.js";
import {scheduleByDefault} from "./scheduleController.js"

const getEventData = async (eventId, targetDate = null) => {
    try {
        let eventData = null;

        if (eventData === null) {
            eventData = await EventSchema.findById(eventId)
                .populate([
                    { path: "csvData" },
                    { path: "postDetails" },
                ]);
        }
        else {
            eventData = await EventSchema.findById(eventId)
                .populate([
                    { path: "csvData", match: { date_month: targetDate } }, // Filter csvUser by birthdate
                    { path: "postDetails" },
                ]);
        }

        if (!eventData) {
            return null;
        }
        return eventData;
    } catch (error) {
        console.log("Error in the getEventData, ", error);
        return null;
    }
}

const createEvent = async(req, res) => {
    try {
        const {eventName, eventDate, address, postDetails, csvData} = req.body;
        const user = req.user?.userId;
        const requiredFields = {eventName, eventDate, address, postDetails};
        const missingFields = [];

        Object.keys(requiredFields).forEach((key) => {
            if(requiredFields[key] === undefined)
            {
                missingFields.push(key);
            }
        });
        if(csvData === undefined || csvData.length === 0)
            {
                missingFields.push(csvData);
            }

        if(requiredFields.length > 0)
        {
            return res.status(400).send({error: `${missingFields} are also required...`});
        }


        requiredFields.user = user;

        const saveEvent = new EventSchema(requiredFields);
        await saveEvent.save();

        if (csvData?.length !== 0) {
            saveEvent.csvData = await saveUsers(csvData, saveEvent._id);
        }

        await saveEvent.save();

        await scheduleByDefault("event", saveEvent._id, user);

        res.status(201).send({saveEvent});

    } catch (error) {
        console.log("Error in the createEvent, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

const getEventDetails = async(req, res) => {
    try {
        const {id} = req.params;
        const eventDetails = await EventSchema.findById(id);
        if(!eventDetails)
        {
            return res.status(404).send({error: `Event details are not found with id: ${id}`});
        }
        res.status(200).send({eventDetails});
    } catch (error) {
        console.log("Error in the getMarriageDetails, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

const getAllEventDetails = async(req, res) => {
    try {
        const {page=1, limit=10} = req.query;
        const skip = (page - 1) * limit;
        const events = await EventSchema.find({user}).skip(skip).limit(limit);
        const totalEvents = await EventSchema.countDocuments({user});
        res.status({totalPages: Math.ceil(totalEvents/limit), events});
    } catch (error) {
        console.log("Error in the getAllEventDetails, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
};

const updateEventDetails = async(req, res) => {
    try {
        const {id} = req.params;
        const {eventName, eventDate, address, postDetails, csvData} = req.body;
        const fieldsToUpdate = {eventName, eventDate, address, csvData, postDetails};
        Object.keys(fieldsToUpdate).forEach((key) => {
            if(fieldsToUpdate[key] === undefined)
            {
                delete fieldsToUpdate[key]
            }
        });
        if(csvData?.length !== 0)
        {
            const existingEventDetails = await EventSchema.findById(id);
            const ids = await saveUsers(csvData, existingEventDetails._id);
            fieldsToUpdate.csvData = ids;
        }

        const updateMarriageDetails = await EventSchema.findByIdAndUpdate(id, fieldsToUpdate, {new: true, runValidators: true});
        res.status(200).send({updateMarriageDetails});
    } catch (error) {
        console.log("Error in the updateEventDetails, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

const deleteEventDetails = async(req, res) => {
    try {
        const {id} = req.params;
        const deleteEventDetails = await EventSchema.findByIdAndDelete(id);
        if(!deleteEventDetails)
        {
            return res.status(404).send({error: `Event details are found with id: ${id}..`});
        }
        res.status(200).send({message: `Event details are deleted with id: ${id}...`});
    } catch (error) {
        console.log("Error in the deleteEventDetails, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

const updateResponse = async(id, data) => {
    try {
        const updateResponse = await EventSchema.findById(id);
        if(!updateResponse)
        {
            throw new Error(`birthday Details is exists with id: ${id}`);
        }
        updateResponse.response.push(...data);
        await updateResponse.save();
        console.log(updateResponse);
    } catch (error) {
        console.log("Error in the updateReponse, ", error);
    }
}


export {createEvent, getAllEventDetails, getEventDetails, updateEventDetails, deleteEventDetails, getEventData, updateResponse};
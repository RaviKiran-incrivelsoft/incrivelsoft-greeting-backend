import {BirthDayModel} from "../models/BirthDayModel.js";
import { saveUsersWithBirthDay } from "./csvUserController.js";

const createBirthDayDetails = async (req, res) => {
    try {
        const { title, from, csvData, postDetails } = req.body;
        console.log("Request body:", req.body);

        // Ensure `req.user` exists and is populated
        const user = req.user?.userId;
        if (!user) {
            return res.status(401).send({ error: "Unauthorized access. User ID is required." });
        }

        const requiredFields = { title, from, postDetails };
        const missingFields = [];

        // Validate required fields
        Object.entries(requiredFields).forEach(([key, value]) => {
            if (!value || value.length === 0) {
                missingFields.push(key);
            }
        });

        if(csvData === undefined || csvData.length === 0)
        {
            missingFields.push(csvData);
        }

        if (missingFields.length > 0) {
            return res
                .status(400)
                .send({ error: `The following fields are required: ${missingFields.join(", ")}` });
        }

        // Add user to required fields
        requiredFields.user = user;

        // Save BirthDay Details
        const saveBirthDayDetails = new BirthDayModel(requiredFields);
        await saveBirthDayDetails.save();

        // Associate CSV data with the saved record
        saveBirthDayDetails.csvData = await saveUsersWithBirthDay(csvData, saveBirthDayDetails._id);

        // Save the updated record after adding csvData
        await saveBirthDayDetails.save();

        // Respond with the saved details
        res.status(201).send({ saveBirthDayDetails });
    } catch (error) {
        console.error("Error in createBirthDayDetails:", error);
        res.status(500).send({ error: "Internal server error." });
    }
};


const getBirthDayDetails = async(req, res) => {
    try {
        const {id} = req.params;
        const birthDayDetails = await BirthDayModel.findById(id);
        if(!birthDayDetails)
        {
            return res.status(404).send({error: `BirthDay details are not found with id: ${id}`});
        }
        res.status(200).send({birthDayDetails});
    } catch (error) {
        console.log("Error in the getBirthDayDetails, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

const getAllBirthDayDetails = async(req, res) => {
    try {
        const {page=1, limit=10} = req.query;
        const skip = (page - 1) * limit;
        const birthDays = await BirthDayModel.find({user}).skip(skip).limit(limit);
        const totalBirthDays = await BirthDayModel.countDocuments({user});
        res.status({totalPages: Math.ceil(totalBirthDays/limit), birthDays});
    } catch (error) {
        console.log("Error in the getAllBirthDayDetails, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
};

const updateBirthDayDetails = async(req, res) => {
    try {
        const {id} = req.params;
        const {title, from, csvData, postDetails} = req.body;
        const fieldsToUpdate = {title, from, csvData, postDetails};
        Object.keys(fieldsToUpdate).forEach((key) => {
            if(fieldsToUpdate[key] === undefined)
            {
                delete fieldsToUpdate[key]
            }
        });
        if(csvData && csvData.length !== 0)
        {
            const birthdateDetails = await BirthDayModel.findById(id);
            fieldsToUpdate.csvData = await saveUsersWithBirthDay(fieldsToUpdate, birthdateDetails._id);
        }
        const updateMarriageDetails = await BirthDayModel.findByIdAndUpdate(id, fieldsToUpdate, {new: true, runValidators: true});
        res.status(200).send({updateMarriageDetails});
    } catch (error) {
        console.log("Error in the updateBirthDayDetails, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

const deleteBirthDayDetails = async(req, res) => {
    try {
        const {id} = req.params;
        const deleteBirthDayDetails = await BirthDayModel.findByIdAndDelete(id);
        if(!deleteBirthDayDetails)
        {
            return res.status(404).send({error: `BirthDay details are found with id: ${id}..`});
        }
        res.status(200).send({message: `BirthDay details are deleted with id: ${id}...`});
    } catch (error) {
        console.log("Error in the deleteMarriageDetails, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

export {createBirthDayDetails, getAllBirthDayDetails, getBirthDayDetails, updateBirthDayDetails, deleteBirthDayDetails};
import { MarriageModel } from "../models/MarriageModel.js";
import { saveCouples } from "./csvCoupleUserController.js";
import {scheduleByDefault} from "./scheduleController.js"


const getMarriageData = async (marriageId, targetDate = null) => {
    try {
        let marriageData = null;

        if (marriageData === null) {
            marriageData = await MarriageModel.findById(marriageId)
                .populate([
                    { path: "csvData" },
                    { path: "postDetails" },
                ]);
        }
        else {
            marriageData = await MarriageModel.findById(marriageId)
                .populate([
                    { path: "csvData", match: { date_month: targetDate } }, // Filter csvUser by birthdate
                    { path: "postDetails" },
                ]);
        }

        if (!marriageData) {
            return null;
        }
        return marriageData;
    } catch (error) {
        console.log("Error in the getMarriageData, ", error);
        return null;
    }
}

const createMarriageDetails = async (req, res) => {
    try {
        const { title, csvData, postDetails } = req.body;
        const user = req.user?.userId;
        const requiredFields = { title,  postDetails };
        const missingFields = [];

        Object.keys(requiredFields).forEach((key) => {
            if (!requiredFields[key] || requiredFields[key].length === 0) {
                missingFields.push(key);
            }
        });

        if (!csvData || csvData.length === 0) {
            missingFields.push(csvData);
        }

        if (requiredFields.length > 0) {
            return res.status(400).send({ error: `${missingFields} are also required...` });
        }

        requiredFields.user = user;
        const saveMarriageDetails = new MarriageModel(requiredFields);
        await saveMarriageDetails.save();

        saveMarriageDetails.csvData = await saveCouples(csvData, saveMarriageDetails._id);

        await saveMarriageDetails.save();

        await scheduleByDefault("marriage", saveMarriageDetails._id, user);

        res.status(201).send({ saveMarriageDetails });


    } catch (error) {
        console.log("Error in the createMarriageDetails, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
}

const getMarriageDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const marriageDetails = await MarriageModel.findById(id);
        if (!marriageDetails) {
            return res.status(404).send({ error: `Marriage details are not found with id: ${id}` });
        }
        res.status(200).send({ marriageDetails });
    } catch (error) {
        console.log("Error in the getMarriageDetails, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
}

const getAllMarriageDetails = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const marriages = await MarriageModel.find({ user }).skip(skip).limit(limit);
        const totalMarriages = await MarriageModel.countDocuments({ user });
        res.status({ totalPages: Math.ceil(totalMarriages / limit), marriages });
    } catch (error) {
        console.log("Error in the getAllMarriageDetails, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
};

const updateMarriageDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, csvData, postDetails } = req.body;
        const fieldsToUpdate = { title, csvData, postDetails };
        Object.keys(fieldsToUpdate).forEach((key) => {
            if (fieldsToUpdate[key] === undefined) {
                delete fieldsToUpdate[key]
            }
        });
        if (csvData.length > 0) {
            const existingMarriageDetails = await MarriageModel.findById(id);
            updateMarriageDetails.csvData = await saveCouples(csvData, existingMarriageDetails._id);
        }
        const updateMarriageDetails = await MarriageModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true, runValidators: true });
        res.status(200).send({ updateMarriageDetails });
    } catch (error) {
        console.log("Error in the updateMarriageDetails, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
}

const deleteMarriageDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteMarriageDetails = await MarriageModel.findByIdAndDelete(id);
        if (!deleteMarriageDetails) {
            return res.status(404).send({ error: `Marriage details are found with id: ${id}..` });
        }
        res.status(200).send({ message: `marriage details are deleted with id: ${id}...` });
    } catch (error) {
        console.log("Error in the deleteMarriageDetails, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
}

const updateResponse = async(id, data) => {
    try {
        const updateResponse = await MarriageModel.findById(id);
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


export { createMarriageDetails, getAllMarriageDetails, getMarriageDetails, updateMarriageDetails, deleteMarriageDetails, getMarriageData, updateResponse };
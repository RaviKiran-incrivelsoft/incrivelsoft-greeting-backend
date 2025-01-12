import { FestivalSchema } from "../models/FestivalModel.js";
import { saveUsers } from "./csvUserController.js";
import {scheduleByDefault} from "./scheduleController.js"


const getFestivalData = async (festivalId, targetDate = null) => {
    try {
        let festivalData = null;

        if (festivalData === null) {
            festivalData = await FestivalSchema.findById(festivalId)
                .populate([
                    { path: "csvData" },
                    { path: "postDetails" },
                ]);
        }
        else {
            festivalData = await FestivalSchema.findById(festivalId)
                .populate([
                    { path: "csvData", match: { date_month: targetDate } }, // Filter csvUser by birthdate
                    { path: "postDetails" },
                ]);
        }

        if (!festivalData) {
            return null;
        }
        return festivalData;
    } catch (error) {
        console.log("Error in the getFestivalData, ", error);
        return null;
    }
}


const createFestival = async (req, res) => {
    try {
        const { festivalName, festivalDate, from, csvData, address, postDetails } = req.body;
        console.log(req.body)
        const requiredFields = { festivalName, festivalDate, from, address, postDetails };
        const user = req.user?.userId;
        const missingFields = [];
        Object.keys(requiredFields).forEach((key) => {
            if (requiredFields[key] === undefined || requiredFields[key].length === 0) {
                missingFields.push(key);
            }
        });
        if (csvData === undefined || csvData.length === 0) {
            missingFields.push(csvData);
        }
        if (missingFields.length > 0) {
            return res.status(400).send({ error: `${missingFields} are also required...` });
        }

        requiredFields.user = user;

        const createFestival = new FestivalSchema(requiredFields);
        await createFestival.save();

        createFestival.csvData = await saveUsers(csvData, createFestival._id);

        await createFestival.save();

        await scheduleByDefault("festival", createFestival._id, user);
        res.status(201).send({ message: "festival details are saved...", createFestival });
    } catch (error) {
        console.log("Error in the createFestival, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
}

const getFestival = async (req, res) => {
    try {
        const { id } = req.params;
        const festivalData = await FestivalSchema.findById(id);
        if (!festivalData) {
            return res.status(404).send({ error: `Festival details are not found with Id: ${id}...` });
        }
        res.status(200).send({ festivalData });
    } catch (error) {
        console.log("Error in the getFestival, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
}

const getAllFestivalDetails = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const festivals = await FestivalSchema.find({ user }).skip(skip).limit(limit);
        const totalFestivals = await FestivalSchema.countDocuments({ user });
        res.status({ totalPages: Math.ceil(totalFestivals / limit), festivals });
    } catch (error) {
        console.log("Error in the getAllFestivalDetails, ", error);
        res.status(500).send({ error: "Internal server error..." });
    }
}

const updateFestivalDetails = async (req, res) => {
    try {
        const {id} = req.params;
        const { festivalName, festivalDate, from, csvData, address, postDetails } = req.body;
        const fieldsToUpdate = { festivalName, festivalDate, csvData, from, address, postDetails };
        Object.keys(fieldsToUpdate).forEach((key) => {
            if (fieldsToUpdate[key] === undefined) {
                delete fieldsToUpdate[key]
            }
        });

        if (csvData?.length !== 0) {
            const existingFestivalDetails = await FestivalSchema.findById(id);
            const ids = await saveUsers(csvData, existingFestivalDetails._id);
            fieldsToUpdate.csvData = ids;
        }

        const updateFestivalDetails = await FestivalSchema.findByIdAndUpdate(id, fieldsToUpdate, { new: true, runValidators: true });
        if (!updateFestivalDetails) {
            return res.status(404).send({ error: `Festival details with id: ${id} is not foumd...` });
        }
        res.status(200).send({ updateFestivalDetails });

    } catch (error) {
        console.log("Error in the updateFestivalDetails, ", error);
        res.status(500).send({ error: "Internal server error..." })
    }
}

const deleteFestivalDetils = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteFestivalDetils = await FestivalSchema.findByIdAndDelete(id);
        if (!deleteFestivalDetils) {
            return res.status(404).send({ error: `Festival Details not found with id: ${id}` });
        }
        res.status(200).send({ message: `Festival details with id: ${id}...` });
    } catch (error) {
        console.log("Error in the getAllFestivalDetails, ", error);
        res.status(500).send({ error: "Internal server error..." })
    }
}

const updateResponse = async(id, data) => {
    try {
        const updateResponse = await FestivalSchema.findById(id);
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


export { createFestival, getFestival, getAllFestivalDetails, updateFestivalDetails, deleteFestivalDetils, getFestivalData, updateResponse  };
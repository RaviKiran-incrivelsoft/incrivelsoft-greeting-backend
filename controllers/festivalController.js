import { FestivalSchema } from "../models/FestivalModel.js";
import { saveUsers } from "./csvUserController.js";

const createFestival = async(req, res) => {
    try {
        const {festivalName, festivalDate, from, csvData, address, postDetails} = req.body;
        const requiredFields = {festivalName, festivalDate, from, csvData, address, postDetails};
        const user = req.user?.userId;
        const missingFields = [];
        Object.keys(requiredFields).forEach((key) => {
            if(requiredFields[key] === undefined || requiredFields[key].length === 0)
            {
                missingFields.push(key);
            }
        });
        if(missingFields.length !== 0)
        {
            return res.status(400).send({error: `${missingFields} are also required...`});
        }

        const ids = await saveUsers(csvData);
        requiredFields.csvUser = ids;
        requiredFields.user = user;

        const createFestival = new FestivalSchema(requiredFields);
        await createFestival.save();
        res.status(201).send({message: "festival details are saved...", createFestival});
    } catch (error) {
        console.log("Error in the createFestival, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

const getFestival = async (req, res) => {
    try {
        const {id} = req.params;
        const festivalData = await FestivalSchema.findById(id);
        if(!festivalData)
        {
            return res.status(404).send({error: `Festival details are not found with Id: ${id}...`});
        }
        res.status(200).send({festivalData});
    } catch (error) {
        console.log("Error in the getFestival, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

const getAllFestivalDetails = async(req, res) => {
    try {
        const {page=1, limit=10} = req.query;
        const skip = (page - 1) * limit;
        const festivals = await FestivalSchema.find({user}).skip(skip).limit(limit);
        const totalFestivals = await FestivalSchema.countDocuments({user});
        res.status({totalPages: Math.ceil(totalFestivals/limit), festivals});
    } catch (error) {
        console.log("Error in the getAllFestivalDetails, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

const updateFestivalDetails = async(req, res) => {
    try {
        const {festivalName, festivalDate, from, csvData, address, postDetails} = req.body;
        const fieldsToUpdate = {festivalName, festivalDate, from, address, postDetails};
        Object.keys(fieldsToUpdate).forEach((key) => {
            if(fieldsToUpdate[key] === undefined)
            {
                delete fieldsToUpdate[key]
            }
        });

        if(fieldsToUpdate.csvData.length !== 0)
        {
            const ids = await saveUsers(csvData);
            fieldsToUpdate.csvUser = ids;
        }

        const updateFestivalDetails = await FestivalSchema.findByIdAndUpdate(id, fieldsToUpdate, {new: true, runValidators: true});
        if(!updateFestivalDetails)
        {
            return res.status(404).send({error: `Festival details with id: ${id} is not foumd...`});
        }
        res.status(200).send({updateFestivalDetails});
        
    } catch (error) {
        console.log("Error in the updateFestivalDetails, ", error);
        res.status(500).send({error: "Internal server error..."})
    }
}

const deleteFestivalDetils = async(req, res) => {
    try {
        const {id} = req.params;
        const deleteFestivalDetils = await FestivalSchema.findByIdAndDelete(id);
        if(!deleteFestivalDetils)
        {
            return res.status(404).send({error: `Festival Details not found with id: ${id}`});
        }
        res.status(200).send({message: `Festival details with id: ${id}...`});
    } catch (error) {
        console.log("Error in the getAllFestivalDetails, ", error);
        res.status(500).send({error: "Internal server error..."})
    }
}

export {createFestival, getFestival, getAllFestivalDetails, updateFestivalDetails, deleteFestivalDetils};
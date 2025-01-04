import { MailResponse } from "../models/MailResponse.js";

const saveResponse = async (data) => {
    try {
        const saveData = await MailResponse.insertMany(data);
        console.log("saved email response, ", saveData);
        return saveData.map((doc) => doc._id);
    } catch (error) {
        console.log("Error in the saveResponse, ", error);
        return [];
    }
}

const getResponseById = async( req, res ) => {
    try {
        const {id} = req.params;
        const {page=1, limit=20} = req.query;
        const skip = (page - 1) * limit;
        const responses = await MailResponse.find({ref: id}).skip(skip).limit(limit).lean();
        const totalResponses = await MailResponse.countDocuments({ref: id});
        res.status(200).send({totalPages: Math.ceil(totalResponses/limit), responses});

    } catch (error) {
        console.log("Error in the getResponseById, ", error);
        res.status(500).send({error: "Internal server error..."});
    }
}

export {saveResponse, getResponseById}
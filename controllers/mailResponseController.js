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

export {saveResponse}
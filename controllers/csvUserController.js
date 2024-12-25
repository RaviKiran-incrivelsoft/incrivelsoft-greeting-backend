import {CSVUsers} from "../models/CSVUser.js";

const saveUsers = async (data) => {
    try {
        console.log("CSVUsers : ", data);
        const saveData = await CSVUsers.insertMany(data);

        // Extract the _id values from the saved documents
        const ids = saveData.map((doc) => doc._id);

        return ids;
    } catch (error) {
        console.log("Error in the saveUsers of csv, ", error);
        return [];
    }
};

export {saveUsers};
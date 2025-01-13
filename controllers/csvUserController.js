import {CSVUsers} from "../models/CSVUser.js";
import formatDateString from "../utils/formatedate.js"

const saveUsersWithBirthDay = async (data, ref) => {
    try {
        let csvData = [];
        if(Array.isArray(data))
        {
            csvData = data;
        }
        else{
            csvData = JSON.parse(data);
        }
        if (!Array.isArray(csvData)) {
            throw new Error("Expected an array of users but received: " + typeof csvData);
        }


        const processedData = csvData.map((user) => {
            const birthdate = formatDateString(user.birthdate);
            console.log("birthday extract and format, ", birthdate);
            if (!birthdate) return null;
            return {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                contact: user.contact,
                birthdate: user.birthdate,
                date_month: birthdate,
                ref: ref
            };
        }).filter(Boolean);

        const saveData = await CSVUsers.insertMany(processedData);
        return saveData.map((doc) => doc._id);
    } catch (error) {
        console.error("Error in saveUsersWithBirthDay:", error);
        return [];
    }
};


const saveUsers = async (data, ref) => {
    try {
        let csvData = [];
        if(Array.isArray(data))
        {
            csvData = data;
        }
        else{
            csvData = JSON?.parse(data);
        }
        if (!Array.isArray(csvData)) {
            throw new Error("Expected an array of users but received: " + typeof csvData);
        }
        const processedData = csvData.map((user) => ({...user, ref: ref}))
        console.log("CSVUsers:", processedData);
    
        const saveData = await CSVUsers.insertMany(processedData);

        // Extract the _id values from the saved documents
        const ids = saveData.map((doc) => doc._id);

        return ids;
    } catch (error) {
        console.log("Error in the saveUsers of csv, ", error);
        return [];
    }
};

const deleteUsers = async(ids) => {
    try {
        const deletedUsers = await CSVUsers.deleteMany(ids);
        console.log("delete users, ",  deleteUsers);
    } catch (error) {
        console.log("Error in the deleteUsers, ", error);
    }
} 



export {saveUsersWithBirthDay, saveUsers, deleteUsers};
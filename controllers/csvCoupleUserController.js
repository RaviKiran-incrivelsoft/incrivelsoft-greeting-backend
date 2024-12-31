import {CSVCoupleUsers} from "../models/CSVCoupleUser.js";
import formatDateString from "../utils/formatedate.js";

const saveCouples= async (data, ref) => {
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

        const processedData = csvData
        .map((user) => {
            const marriagedate = formatDateString(user.marriagedate);
            if (!marriagedate) return null; // Skip invalid rows
            return {
                husband_name: user.husband_name,
                wife_name: user.wife_name,
                email: user.email,
                contact: user.contact,
                marriagedate: user.marriagedate,
                date_month: marriagedate,
                ref: ref
            };
        })
        .filter(Boolean); // Remove null entries


        const saveData = await CSVCoupleUsers.insertMany(processedData);

        // Extract the _id values from the saved documents
        const ids = saveData.map((doc) => doc._id);

        return ids;
    } catch (error) {
        console.log("Error in the saveCouples of csv, ", error);
        return [];
    }
};





export {saveCouples};
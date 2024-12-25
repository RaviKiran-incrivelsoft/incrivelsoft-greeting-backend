import fs from "fs";
import csv from "csv-parser";
import {TempleDetailsModel} from "../models/TempleData.js";
import {saveUsers} from "./csvUserController.js";

const createTempleData = async (req, res) => {
    try {
        const { campaign } = req.query;
        const user = req.user?.userId; // Ensure user is defined
        const {
            templeName,
            templeTitle,
            instagramUrl,
            twitterUrl,
            facebookUrl,
            websiteUrl,
            templeDescription,
            fax,
            phone,
            taxId,
            address,
        } = req.body;

        const requiredFields = {
            templeName,
            templeTitle,
            instagramUrl,
            twitterUrl,
            facebookUrl,
            websiteUrl,
            templeDescription,
            fax,
            phone,
            taxId,
            address,
        };

        // Check for missing fields
        const missingFields = [];
        Object.keys(requiredFields).forEach((key) => {
            if (!requiredFields[key]) {
                missingFields.push(key);
            }
        });

        // Check for missing files
        const requiredFiles = ["zelleQrCode", "paypalQrCode", "csvFile"];
        requiredFiles.forEach((fileKey) => {
            if (!req.files || !req.files[fileKey]) {
                missingFields.push(fileKey);
            }
        });

        if (missingFields.length !== 0) { 
            return res
                .status(400)
                .json({ error: `Missing fields: ${missingFields.join(", ")}` });
        }

        // Add file paths to requiredFields
        requiredFields.zelleQrCodeURL = req.files.zelleQrCode[0].path;
        requiredFields.paypalQrCodeURL = req.files.paypalQrCode[0].path;
        requiredFields.campaign = campaign;
        requiredFields.user = user;

        // CSV file path
        const csvFilePath = req.files.csvFile[0].path;

        console.log("Processing CSV file...");

        // Parse CSV file and process data
        const results = [];
        fs.createReadStream(csvFilePath)
            .pipe(
                csv({
                    headers: ["first_name", "last_name", "email", "contact", "birthdate"],
                })
            )
            .on("data", (data) => results.push(data))
            .on("end", async () => {
                console.log("CSV file processed. Total rows:", results.length);

                // Parse dates
                function parseDateDDMMYYYY(dateString) {
                    const parts = dateString.split("-");
                    return new Date(Date.UTC(parts[2], parts[1] - 1, parts[0]));
                }

                function parseDateMMDDYYYY(dateString) {
                    const parts = dateString.split("/");
                    return new Date(parts[2], parts[0] - 1, parts[1]);
                }

                function parseBirthdate(dateString) {
                    try {
                        if (dateString.includes("-")) {
                            return parseDateDDMMYYYY(dateString);
                        } else if (dateString.includes("/")) {
                            return parseDateMMDDYYYY(dateString);
                        } else {
                            throw new Error("Invalid date format");
                        }
                    } catch {
                        console.warn(`Unrecognized date format: ${dateString}. Skipping row.`);
                        return null;
                    }
                }

                // Process and filter valid data
                const processedData = results
                    .map((user) => {
                        const birthdate = parseBirthdate(user.birthdate);
                        if (!birthdate) return null; // Skip invalid rows
                        return {
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            contact: user.contact,
                            birthdate,
                        };
                    })
                    .filter(Boolean); // Remove null entries

                try {
                    const ids = await saveUsers(processedData); // Save users to DB
                    requiredFields.csvUser = ids;
                    // Save temple data
                    const templeData = new TempleDetailsModel(requiredFields);
                    await templeData.save();
                    return res
                        .status(201)
                        .json({
                            message: `Temple details saved with ID: ${templeData._id}`,
                            id: templeData._id
                        });
                } catch (error) {
                    console.error("Error saving data:", error);
                    return res
                        .status(500)
                        .json({ error: "Error processing CSV or saving temple details." });
                }
            });
    } catch (error) {
        console.error("Error in createTempleData:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


const getTempleData = async(templeId) => {
    try {
        const templeData = await TempleDetailsModel.findById(templeId).populate([
            { path: "csvUser" },
            { path: "campaign" },
          ]);
          
        if(!templeData)
        {
            return null;
        }
        return templeData;
    } catch (error) {
        console.log("Error in the getTemplateData, ", error);
        return null;
    }
}


const deleteTempleData = async(req, res) => {
  try {
    const {id} = req.params;
    const deleteTempleData = await TempleDetailsModel.findByIdAndDelete(id);
    if(!deleteTempleData)
    {
      return res.status(404).send({error: `Templa data is not found with id: ${id}`});
    }
    res.status(200).send({message: `Temple Data is deleted having id: ${id}...`});
  } catch (error) {
    console.error("Error in deleteTempleData:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
export  { createTempleData, deleteTempleData, getTempleData };

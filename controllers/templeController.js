import { TempleDetailsModel } from "../models/TempleData.js";
import { saveUsers } from "./csvUserController.js";
import cloudinary from "../cloudinary/config.js";


function formatDateString(input) {
    // Regular expression to check the format dd-mm
    const dateRegex = /^\d{2}-\d{2}$/;

    // If the string is already in the correct format, return it
    if (dateRegex.test(input)) {
        return input;
    }

    // Try to format the string to dd-mm
    const parts = input.split(/[-\/.]/); // Split on -, /, or .
    if (parts.length >= 2) {
        const [day, month] = parts;

        // Ensure day and month are valid numbers
        if (
            day.length === 2 &&
            month.length === 2 &&
            !isNaN(Number(day)) &&
            !isNaN(Number(month))
        ) {
            return `${day.padStart(2, "0")}-${month.padStart(2, "0")}`;
        }
    }

    // If input cannot be formatted, throw an error or return null

    return null;
}


const getTempleData = async (templeId, targetDate = null) => {
    try {
        let templeData = null;

        if (targetDate === null) {
            templeData = await TempleDetailsModel.findById(templeId)
                .populate([
                    { path: "csvUser" },
                    { path: "PostDetails" },
                ]);
        }
        else {
            templeData = await TempleDetailsModel.findById(templeId)
                .populate([
                    { path: "csvUser", match: { birthdate: targetDate } }, // Filter csvUser by birthdate
                    { path: "PostDetails" },
                ]);
        }

        if (!templeData) {
            return null;
        }
        return templeData;
    } catch (error) {
        console.log("Error in the getTemplateData, ", error);
        return null;
    }
}



const createTemple = async (req, res) => {
    try {
        const user = req.user?.userId;
        const {
            templeName,
            instagramUrl,
            twitterUrl,
            facebookUrl,
            websiteUrl,
            phone,
            taxId,
            address,
            csvData,
            postDetails
        } = req.body;

        const requiredFields = {
            templeName,
            instagramUrl,
            twitterUrl,
            facebookUrl,
            websiteUrl,
            phone,
            taxId,
            address,
            csvData,
            postDetails
        };

        // Check for missing fields
        const missingFields = [];
        Object.keys(requiredFields).forEach((key) => {
            if (requiredFields[key] === undefined || requiredFields[key].length === 0) {
                missingFields.push(key);
            }
        });

        // Check for missing files
        const requiredFiles = ["zelleQrCode", "paypalQrCode"];
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
        const zelleQrCodeURL = await cloudinary.uploader.upload(req.files.zelleQrCode[0].path);
        requiredFields.zelleQrCodeURL = zelleQrCodeURL.secure_url

        const paypalQrCodeURL = await cloudinary.uploader.upload(req.files.paypalQrCode[0].path);
        requiredFields.paypalQrCodeURL = paypalQrCodeURL.secure_url

        requiredFields.campaign = campaign;
        requiredFields.user = user;


        // Process and filter valid data
        const processedData = csvData
            .map((user) => {
                const birthdate = formatDateString(user.birthdate);
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


        const ids = await saveUsers(processedData); // Save users to DB
        requiredFields.csvUser = ids;
        // Save temple data
        const templeData = new TempleDetailsModel(requiredFields);
        await templeData.save();

    } catch (error) {
        console.log("Error in the createTemple, ", error);
        res.status(500).send({ error: "Internal server error..." })
    }
}

const deleteTemple = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTemple = await TempleDetailsModel.findByIdAndDelete(id);
        if (!deleteTemple) {
            return res.status(404).send({ error: `Temple data not found with id: ${id}` });
        }
        const userIds = deleteTemple.csvUser;
        res.status(200).send({ message: `Temple data deleted with id: ${id}` });
    } catch (error) {
        console.log("Error in the deleteTemple, ", error);
        res.status(500).send({ error: "Internal server error..." })
    }
}

const updateTemple = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            templeName,
            instagramUrl,
            twitterUrl,
            facebookUrl,
            websiteUrl,
            phone,
            taxId,
            address,
            csvData,
            postDetails
        } = req.body;

        const fieldsToUpdate = {
            templeName,
            instagramUrl,
            twitterUrl,
            facebookUrl,
            websiteUrl,
            phone,
            taxId,
            address,
            postDetails
        };


        Object.keys(fieldsToUpdate).forEach((key) => {
            if (fieldsToUpdate[key] === undefined || fieldsToUpdate[key].length === 0) {
                delete fieldsToUpdate[key];
            }
        });

        if (req.files && req.files[zelleQrCode]) {
            const zelleQrCodeURL = await cloudinary.uploader.upload(req.files.zelleQrCode[0].path);
            fieldsToUpdate.zelleQrCodeURL = zelleQrCodeURL.secure_url
        }
        if (req.files && req.files[paypalQrCode]) {
            const paypalQrCodeURL = await cloudinary.uploader.upload(req.files.paypalQrCode[0].path);
            fieldsToUpdate.paypalQrCodeURL = paypalQrCodeURL.secure_url
        }
        if (csvData.length !== 0) {
            const processedData = csvData
                .map((user) => {
                    const birthdate = formatDateString(user.birthdate);
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

            const ids = await saveUsers(processedData); // Save users to DB
            fieldsToUpdate.csvUser = ids;
        }
        const updatedPost = await TempleDetailsModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true, runValidators: true });
        res.status(200).send({ updatedPost });

    } catch (error) {
        console.log("Error in the updateTemple, ", error);
        res.status(500).send({ error: "Internal server error..." })
    }
}

const getTemple = async (req, res) => {
    try {
        const { id } = req.params;
        const templeData = await TempleDetailsModel.findById(id);
        if (!templeData) {
            return res.status(404).send({ error: `Temple not found with id:  ${id}.` });
        }
        return res.status(200).send(templeData);
    } catch (error) {
        console.log("Error in the createTemple, ", error);
        res.status(500).send({ error: "Internal server error..." })
    }
}

const getAllTemples = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const user = req.user?.userId;
        const skip = (page - 1) * limit;
        const temples = await TempleDetailsModel.find({ user }).skip(skip).limit(limit);
        const totalTemples = await TempleDetailsModel.countDocuments({ user });

        res.status(200).send({ totalPages: Math.ceil(totalTemples / limit), temples });
    } catch (error) {
        console.log("Error in the createTemple, ", error);
        res.status(500).send({ error: "Internal server error..." })
    }
}

export { getTempleData, createTemple, getAllTemples, getTemple, deleteTemple, updateTemple };

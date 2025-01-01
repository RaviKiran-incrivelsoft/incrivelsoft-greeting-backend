import { TempleDetailsModel } from "../models/TempleData.js";
import { saveUsersWithBirthDay } from "./csvUserController.js";
import cloudinary from "../cloudinary/config.js";
import {scheduleByDefault} from "./scheduleController.js"


const getTempleData = async (templeId, targetDate = null) => {
    try {
        let templeData = null;

        if (targetDate === null) {
            templeData = await TempleDetailsModel.findById(templeId)
                .populate([
                    { path: "csvData" },
                    { path: "postDetails" },
                ]);
        }
        else {
            templeData = await TempleDetailsModel.findById(templeId)
                .populate([
                    { path: "csvData", match: { date_month: targetDate } }, // Filter csvUser by date_month
                    { path: "postDetails" },
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

        // Validate required fields
        const missingFields = [];
        const requiredFields = {
            templeName,
            instagramUrl,
            twitterUrl,
            facebookUrl,
            websiteUrl,
            phone,
            taxId,
            address,
            postDetails,
        };

        Object.entries(requiredFields).forEach(([key, value]) => {
            if (!value || (typeof value === "string" && value.trim() === "")) {
                missingFields.push(key);
            }
        });

        // Validate required files
        const requiredFiles = ["zelleQrCode", "paypalQrCode"];
        requiredFiles.forEach((fileKey) => {
            if (!req.files || !req.files[fileKey]) {
                missingFields.push(fileKey);
            }
        });

        if(csvData === undefined || csvData.length === 0)
        {
            missingFields.push(csvData);
        }

        if (missingFields.length > 0) {
            return res
                .status(400)
                .json({ error: `Missing fields: ${missingFields.join(", ")}` });
        }

        // Upload files to Cloudinary
        const fileUploadPromises = requiredFiles.map((fileKey) =>
            cloudinary.uploader.upload(req.files[fileKey][0].path)
        );

        const [zelleQrCodeUpload, paypalQrCodeUpload] = await Promise.all(fileUploadPromises);

        // Prepare data for saving
        const templeData = {
            ...requiredFields,
            zelleQrCodeURL: zelleQrCodeUpload.secure_url,
            paypalQrCodeURL: paypalQrCodeUpload.secure_url,
            user,
        };

        templeData.user = user;

        // Save temple data
        const newTemple = new TempleDetailsModel(templeData);
        await newTemple.save();
         
        newTemple.csvData = await saveUsersWithBirthDay(csvData, newTemple._id);

        await newTemple.save();

        await scheduleByDefault("temple", newTemple._id, user);

        // Send success response
        res.status(201).json({ message: "Temple created successfully", temple: newTemple });
    } catch (error) {
        console.error("Error in createTemple:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


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
            postDetails,
            csvData
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
        if (csvData.length > 0) {
            const ids = await saveUsersWithBirthDay(csvData); // Save users to DB
            fieldsToUpdate.csvData = ids;
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

const updateResponse = async(id, data) => {
    try {
        const updateResponse = await TempleDetailsModel.findById(id);
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


export { getTempleData, createTemple, getAllTemples, getTemple, deleteTemple, updateTemple, updateResponse };

import nodemailer from "nodemailer";
import path from "path";
import fs from 'fs';
import { getTempleData } from "../controllers/templeController.js";

const EMAIL = process.env.EMAIL;
const PASS_KEY = process.env.PASS_KEY;
const BASE_URL = process.env.BASE_URL;

export default async function sendGreetings(templeId) {
    console.log("Entered into mail service and temple id: ", templeId);

    const templeDetails = await getTempleData(templeId);
    console.log("templeDetails: ", templeDetails);
    const templeImage = "uploads/santaImage.png";

    for (const user of templeDetails.csvUser) {
        // Constructs a JSON object templateJSON using string interpolation
        const templateJSON = JSON.stringify({
            fullName: `${user.first_name} ${user.last_name}`,
            templeBanner: `${BASE_URL}/${templeDetails.campaign.mediaURL.replace(/\\/g, '/')}`,
            templeImage: `${BASE_URL}/${templeImage.replace(/\\/g, '/')}`,
            templeDescription: templeDetails.templeDescription,
            address: templeDetails.address,
            taxId: templeDetails.taxId,
            phone: templeDetails.phone,
            fax: templeDetails.fax,
            websiteUrl: templeDetails.websiteUrl,
            facebookUrl: templeDetails.facebookUrl,
            twitterUrl: templeDetails.twitterUrl,
            instagramUrl: templeDetails.instagramUrl,
            paypalQrCode: `${BASE_URL}/${templeDetails.paypalQrCodeURL.replace(/\\/g, '/')}`,
            zelleQrCode: `${BASE_URL}/${templeDetails.zelleQrCodeURL.replace(/\\/g, '/')}`
        });
        console.log("templateJSON: , ", templateJSON)

        // Parses the JSON object to create a proper JavaScript object
        const template = JSON.parse(templateJSON);

        // Nodemailer transporter configured with a Gmail account
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: EMAIL,
                pass: PASS_KEY
            }
        });

        // Constructs an email object with the following details
        const mailOptions = {
            from: "",
            to: user.email,
            subject: "Happy Christmas!",
            html: createEmailContent(template)
        };

        // Sends the email using transporter.sendMail and logs success or error messages
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    }

    /// Function to generate the HTML content of the email
    function createEmailContent(template) {
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Wishes</title>
        </head>
        <body style="font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
            <div style="width: 100%; max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #1dbffc; padding: 20px; text-align: center; color: white;">
                    <img src="${template.templeBanner}" alt="Temple Banner" style="width: 100%; max-width: 650px; height: auto; border-radius: 10px;">
                </div>
                <div style="background-color: #1dbffc; padding: 20px; text-align: center; font-size: 24px; color: #ffffff; font-weight: bold;">
                    <p>Namaste, <span style="text-transform: uppercase;">${template.fullName}</span></p>
                </div>
                <div style="padding: 20px; background-color: #ffffff; font-size: 16px; color: #333; line-height: 1.6;">
                    <div style="display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
                        <div style="flex: 1; max-width: 300px; border-radius: 8px; overflow: hidden;">
                            <img src="${template.templeImage}" alt="Hindu Community and Cultural Center" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 20px 0;">
                        </div>
                        <div style="flex: 2; max-width: 380px; font-family: 'Georgia', serif; color: #333;">
                            <p>${template.templeDescription}</p>
                        </div>
                    </div>
                </div>
                <div style="background-color: #1dbffc; padding: 20px; text-align: center; color: white; border-radius: 8px; margin: 20px 0;">
                    <p style="font-size: 26px; font-weight: bold; margin: 0;">Wishing You a Merry Christmas!</p>
                    <a href="http://localhost:3000/video-page" style="color: white; text-decoration: none; padding: 12px 25px; background-color: #ff9f32; border-radius: 5px; margin-top: 10px; display: inline-block;">Watch Our Christmas Video</a>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 18px; color: #333;">Please consider donating to help us make a difference:</p>
                    <div style="display: flex; justify-content: center; gap: 20px;">
                        <img src="${template.paypalQrCode}" alt="PayPal" style="width: 120px; height: 120px; margin: 0 15px; border-radius: 10px;">
                        <img src="${template.zelleQrCode}" alt="Zelle" style="width: 120px; height: 120px; margin: 0 15px; border-radius: 10px;">
                    </div>
                </div>
                <div style="background-color: #eeeeee; padding: 20px; text-align: center; font-size: 14px; color: #777;">
                    <p style="margin: 5px 0;">For more details, visit our website: <b>${template.websiteUrl}</b></p>
                    <p style="margin: 5px 0;">Address: ${template.address} | Tax ID: ${template.taxId} | Phone: ${template.phone} | Fax: ${template.fax}</p>
                    <p style="margin: 5px 0;">Stay Connected:</p>
                    <div style="display: inline-block;">
                        <a href="${template.facebookUrl}"><img src="https://via.placeholder.com/40?text=FB" alt="Facebook" style="width: 40px; height: 40px; margin: 0 10px; border-radius: 50%;"></a>
                        <a href="${template.twitterUrl}"><img src="https://via.placeholder.com/40?text=TW" alt="Twitter" style="width: 40px; height: 40px; margin: 0 10px; border-radius: 50%;"></a>
                        <a href="${template.instagramUrl}"><img src="https://via.placeholder.com/40?text=IG" alt="Instagram" style="width: 40px; height: 40px; margin: 0 10px; border-radius: 50%;"></a>
                    </div>
                </div>
            </div>
        </body>
        </html>`;

        return html;
    }
}

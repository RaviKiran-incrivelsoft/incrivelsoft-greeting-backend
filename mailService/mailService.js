import nodemailer from "nodemailer";
import { getTempleData } from "../controllers/templeController.js";

const EMAIL = process.env.EMAIL;
const PASS_KEY = process.env.PASS_KEY;
const BASE_URL = process.env.BASE_URL;
const ChristmasVideo = BASE_URL+"christhmasVideo.mp4".replace(/\\/g, '/');
const ChristmasImage = BASE_URL+"christhmasImage.png".replace(/\\/g, '/');


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
        <html>
        <head>
            <title>Happy Christmas</title>
        </head>
        <body>
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td valign="top">
                        <div>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td align="center">
                                            <img src="${template.templeBanner}" alt="Temple Banner"/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style="margin: 10px 0px; text-align: center">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div style="text-align: left; margin-left: 180px">
                                                    <p><b class="namaste-text" style="color: #5a0901; font-size: 20px;">Namaste <span style="text-transform: uppercase;">${template.fullName}</span></b></p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table border="0" cellspacing="0" cellpadding="0" width="800" align="center" style="text-align: left; background-color:#ffaf4d; border: 5px solid #5a0901; line-height: 20px; font-family: Verdana, Geneva, sans-serif; color: #000000; font-size: 13px;">
                                    <tbody>
                                        <tr>
                                            <td valign="top">
                                                <div align="center">
                                                    <table border="0" cellspacing="0" cellpadding="0" width="800" align="center">
                                                        <tr>
                                                            <td>
                                                                <div style="float: left; width: 40%; margin-top: 10px; margin-left: 10px;">
                                                                    <div style="width: 440px; overflow: hidden; border-radius: 30% 30% 0% 0%;">
                                                                        <img src="${template.templeImage}" alt="Hindu Community and Cultural Center" style="width: 100%; height: auto;">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div style="float: right; width: 80%; margin-right: 20px;">
                                                                    <description>
                                                                        <p style="font-style: normal; font-size: 15px; text-align: justify; font-family: 'Georgia', serif;">${template.templeDescription}</p>
                                                                    </description>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div style="text-align: center; background-color: #ed6f0e; padding: 18px; border-radius: 8px; margin: 10px 10px;">
                                                    <p style="font-size: 25px; font-weight: bold; color: #ffffff; font-family: 'Georgia', serif, cursive; margin: 0;">Happy Christmas</p>
                                                </div>
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>
                                                            <div style="margin-top: 1px; margin-right: 10px; margin-left: 10px; position: relative; display: inline-block;">
                                                                <a href="${ChristmasVideo}" style="position: relative;"><img src="${ChristmasImage}" alt="Birthday Wishes" style="max-width: 100%; height: auto; border-radius: 10px;"></a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <div style="text-align: center;">
                                                    <p style="font-family: 'Georgia', serif; text-align: center; font-size: 18px; margin: 0; margin-top: 15px;">Our mission is to make our community a better place. Your support is essential to achieving this goal. Please consider donating today.</p>
                                                    <table cellspacing="0" cellpadding="0" style="margin: 2% auto;">
                                                        <tr>
                                                            <td>
                                                                <img src="${template.paypalQrCode}" alt="PayPal" style="width: 140px; height: 140px; margin-top: 15px; margin-bottom: 20px;">
                                                            </td>
                                                            <td>
                                                                <img src="${template.zelleQrCode}" alt="Zelle" style="width: 140px; height: 140px; margin-top: 15px; margin-bottom: 20px;">
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div style="color: black; text-align: center; margin: 10px auto; font-size: 18px; font-family: 'Georgia', serif;">
                                                    <p>For further details and the latest information:</p>
                                                    <p>Please visit the temple website <b>${template.websiteUrl}</b></p>
                                                </div>
                                                <footer style="padding: 10px; margin-top: 20px;">
                                                    <div style="text-align: left; font-family: 'Georgia', serif; font-size: 18px; color: #000;">
                                                        <b>ADDRESS AND OTHER INFORMATION</b><br><br>
                                                        ${template.address}<br>   
                                                        Tax ID # ${template.taxId}<br>
                                                        Phone: ${template.phone}; Fax: ${template.fax}<br>
                                                        ${template.websiteUrl}<br>
                                                    </div>
                                                    <div>
                                                        <b>Stay Connected:</b>&nbsp;<a href="${template.facebookUrl}"><img src="${BASE_URL}/uploads/facebook.jpg" alt="Facebook" style="width: 40px; height: 40px; margin-top: 10px; border-radius: 10px;"></a>&nbsp;&nbsp;
                                                        <a href="${template.twitterUrl}"><img src="${BASE_URL}/uploads/twitter.png" alt="Twitter" style="width: 40px; height: 40px; margin-top: 10px; border-radius: 10px;"></a>&nbsp;&nbsp;
                                                        <a href="${template.instagramUrl}"><img src="${BASE_URL}/uploads/instagram.jpg" alt="Instagram" style="width: 40px; height: 40px; margin-top: 10px; border-radius: 10px;"></a>
                                                    </div>
                                                </footer>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;

        return html;
    }
}

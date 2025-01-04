import {transporter} from "../utils/transporterUtil.js";
import calculateAge from "../utils/ageCalculator.js";

const EMAIL = process.env.EMAIL;
const BASE_URL = process.env.BASE_URL;


export default async function sendGreetings(template, userDetails) {

    console.log("Sending the birthday email for ", userDetails.email);

    // Constructs an email object with the following details
    const mailOptions = {
        from: `Incrivelsoft Team ${EMAIL}`,
        to: userDetails.email,
        subject: "Happy Birthday!",
        html: createEmailContent(template, userDetails)
    };

    // Sends the email using transporter.sendMail and logs success or error messages
    try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent: ", info.response);
		return { success: true, email: userDetails.email };
	} catch (error) {
		console.log(error);
		return { success: false, email: userDetails.email };
	}
}

/// Function to generate the HTML content of the email
function createEmailContent(template, userDetails) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Happy Birthday</title>
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
                                                    <p><b class="namaste-text" style="color: #5a0901; font-size: 20px;">Namaste <span style="text-transform: uppercase;">${userDetails.last_name} ${userDetails.first_name}</span></b></p>
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
                                                    <p style="font-size: 25px; font-weight: bold; color: #ffffff; font-family: 'Georgia', serif, cursive; margin: 0;">Happy BirthDay</p>
                                                </div>
                                    
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


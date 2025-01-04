import calculateAge from "../utils/ageCalculator.js";
import {transporter} from "../utils/transporterUtil.js";

const EMAIL = process.env.EMAIL;

export default async function sendGreetings(template, userDetails) {

    console.log("Sending the marriage email for ", userDetails.email);

    const age = calculateAge(userDetails.marriagedate);
	
    // Constructs an email object with the following details
    const mailOptions = {
        from: `Incrivelsoft Team ${EMAIL}`,
        to: userDetails.email,
        subject: template.title || "Happy Anniversary",
        html: createEmailContent(template, userDetails, age)
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
function createEmailContent(template, userDetails, age) {
    const html = `
        <!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>${template.title || "Happy Anniversary"}</title>
</head>

<body style="margin: 0; padding: 0; font-family: 'Open Sans', sans-serif;">
	<table role="presentation" cellpadding="0" cellspacing="0" border="0"
		style="max-width: 600px; margin: 20px auto; background-color: #521c25; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
		<!-- Image -->
		<tr>
			<td style="text-align: center;">
				<img src=${template.banner || "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735597028/anniversary_npxxyd.png"}
					alt="Anniversary Image" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;">
			</td>
		</tr>
		<!-- Anniversary Title and Couple Names -->
		<tr>
			<td style="padding: 20px 0px; text-align: center; color: #ffffff;">
				<h1
					style="margin: 0; font-size: 40px; font-weight: bold; color: #e7afb5; text-align: center; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);">
					${template.title || "Happy Anniversary"}</h1>

				<p
					style="font-size: 24px; margin: 20px 0; text-align: center; font-weight: normal; color: #444; line-height: 1.6;">
					<span style="font-size: 50px; font-family: 'Brush Script MT', cursive; color: #d4757e;">${userDetails.husband_name || "Mohan"}</span>
					<span
						style="font-size: 40px; font-family: 'Brush Script MT', cursive; font-weight: normal; color: #ffc6cc; margin: 0 15px;">&</span>
					<span style="font-size: 50px; font-family: 'Brush Script MT', cursive; color: #d4757e;">${userDetails.wife_name || "Rasmika"}</span>
				</p>
				<p style="font-size: 20px; line-height: 1.5; margin: 10px 100px;">Celebrating the Love of <span
						style="color: #ff909b;">${age || "10"}</span> of Wonderful Years Together</p>
				<p style="font-size: 16px; line-height: 1.5; margin: 20px 60px;">${template.description || "Wishing you both a lifetime of love,happiness, and cherished memories. May your journey together continue to be filled with joy and affection!"}</p>
			</td>
		</tr>
		<!-- Footer -->
		<tr>
			<td style="background-color: #521c25; color: #ffdede; text-align: center; padding: 15px; font-size: 14px;">
				<p style="margin: 5px 0;">&copy; 2024 Your Anniversary Team. All rights reserved.</p>
				<p style="margin: 5px 0;">If you have any questions, contact us at <a href="mailto:hr@incrivelsoft.com"
						style="color: #ffdede;">hr@incrivelsoft.com</a></p>
			</td>
		</tr>
	</table>
</body>

</html>
`;

    return html;
}


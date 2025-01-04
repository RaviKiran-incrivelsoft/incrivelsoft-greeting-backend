import {transporter} from "../utils/transporterUtil.js";

const EMAIL = process.env.EMAIL;

export default async function sendGreetings(template, userDetails) {

	console.log("Sending the birthday email for ", userDetails.email);

	// Constructs an email object with the following details
	const mailOptions = {
		from: `Incrivelsoft Team ${EMAIL}`,
		to: userDetails.email,
		subject: template.title,
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
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>${template.title}</title>
</head>

<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #ffffff;">
	<table role="presentation" cellpadding="0" cellspacing="0" border="0"
		style="max-width: 600px; margin: 20px auto; background: #020d21; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);">
		<!-- Image -->
		<tr>
			<td style="text-align: center;">
				<img
					src=${template.banner || "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735622347/New_Year__3_-removebg-preview_huihni.png"}
					alt="Happy New Year 2025" style="width: 100%; max-width: 600px; height: auto;">
			</td>
		</tr>
		<!-- Title and Description -->
		<tr>
			<td style="padding: 40px; text-align: center;">
				<h1
					style="margin: 0; font-size: 32px; font-style: italic; font-weight: bold; color: #ffcc33; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); font-family: serif;">
					${template.title || "Cheers to New Beginnings!"}
				</h1>

				<p style="font-size: 16px; line-height: 1.8; margin: 30px 0; color: #e0e0e0;">
					${template.description || "As we welcome 2025, let’s embrace new opportunities, celebrate friendships, and cherish the memories that shape our lives. Here's to a year of success, happiness, and endless possibilities!"}
				</p>

				<!-- Address Section -->
				<p style="font-size: 14px; margin: 20px; color: #c0c0c0; line-height: 1.5;">
					Whether you're celebrating this special moment with loved ones at home or creating unforgettable memories elsewhere, we send our heartfelt wishes to you and yours.

				</p>

				<!-- From Section -->
				<p style="font-size: 16px; margin: 20px; color: #c0c0c0; line-height: 1.5;">
					Sent with warm wishes and gratitude, <br>
					<span style="color: #ffcc33; font-style: italic; font-family: serif;">${template.from}</span>
				</p>
			</td>
		</tr>
		<!-- Footer -->
		<tr>
			<td style="background-color: #041026; color: #ffffff; text-align: center; padding: 15px; font-size: 12px;">
				<p style="margin: 5px 0;">&copy; 2025 incrivelSoft. All rights reserved.</p>
				<p style="margin: 5px 0;">If you have any questions, contact us at <a href="mailto:hr@incrivelsoft.com" style="color: #ffdede;">hr@incrivelsoft.com</a></p>
			</td>
		</tr>
	</table>
</body>

</html>

`;

	return html;
}


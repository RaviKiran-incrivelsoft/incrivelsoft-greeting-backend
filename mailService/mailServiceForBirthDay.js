import {transporter} from "../utils/transporterUtil.js";
import calculateAge from "../utils/ageCalculator.js";

const EMAIL = process.env.EMAIL;


export default async function sendGreetings(template, userDetails) {

	console.log("Sending the birthday email for ", userDetails.email);
	const age = calculateAge(userDetails.birthdate);

	// Constructs an email object with the following details
	const mailOptions = {
		from: `Incrivelsoft Team ${EMAIL}`,
		to: userDetails.email,
		subject: template.title || "Happy Birthday",
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
	<title>Happy Birthday ${userDetails.first_name || "Ravi"} ${userDetails.last_name || "kiran"}</title>
</head>

<body style="margin: 0; padding: 0; font-family: 'Open Sans', sans-serif;">
	<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 20px auto; background-color: #ffdede; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
		<!-- Header -->
		<tr>
			<td style="background-color: #bb395e; color: #ffffff; text-align: center; padding: 30px;">
				<h1 style="margin: 0; font-size: 36px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">Happy ${age || "18"}th Birthday, ${userDetails.first_name || "Ravi"} ${userDetails.last_name || "Kiran"}!</h1>
				<p style="margin: 5px 0 0; font-size: 20px; font-weight: 300; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);">Wishing you a day filled with love and joy!</p>
			</td>
		</tr>
		<!-- Image -->
		<tr>
			<td style="text-align: center; padding: 20px;">
				<img src="${template.banner || 'https://cdn.templates.unlayer.com/assets/1676265088672-cake.png'}" alt="Birthday Cake" style="width: 70%; max-width: 300px; height: auto; border-radius: 8px;">
			</td>
		</tr>
		<!-- Content -->
		<tr>
			<td style="padding: 20px; text-align: center; color: #bb395e;">
				<h2 style="margin: 10px 0; font-size: 24px; font-weight: 400;">Enjoy Your Special Day!</h2>
				<p style="font-size: 16px; line-height: 1.5; margin: 10px 0 20px;">We’re thrilled to celebrate your ${age || "18"}th birthday with you. As a token of our appreciation, here’s a little surprise to make your day even more memorable. Have a fantastic birthday, ${userDetails.first_name} ${userDetails.last_name}!</p>
				<p style="font-size: 16px; line-height: 1.5; margin: 10px 0 20px;">${template?.description || ""} </p>
                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0 20px;">Warm wishes, </p>
                <p style="font-size: 16px; line-height: 1.5; margin: 10px 0 20px;">${template.from || "Incrivelsoft Team"}</p>
			</td>
		</tr>
		<!-- Footer -->
		<tr>
			<td style="background-color: #bb395e; color: #ffdede; text-align: center; padding: 15px; font-size: 14px;">
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


const nodemailer = require('nodemailer');
const path = require('path');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

// Verify SMTP connection
transporter.verify(function (error) {
	if (error) {
		console.error('SMTP connection error:', error);
	} else {
		console.log('SMTP connection successful. Ready to send emails.');
	}
});

const sendEmails = async (req, res) => {
	const { birthdayUsers, template, mediaUrl, pay_base64, zelle_base64, user_image_base64 } = {
		birthdayUsers: [
			{
				first_name: "John",
				last_name: "Doe",
				email: "ravivarma25052@gmail.com"
			},
			{
				first_name: "Jane",
				last_name: "Smith",
				email: "ravivarma2552@gmail.com"
			}
		],
		template: {
			userDescription: "Wishing you a wonderful birthday! May your day be filled with joy and happiness.",
			websiteUrl: "https://example.com",
			facebookUrl: "https://facebook.com/example",
			twitterUrl: "https://twitter.com/example",
			instagramUrl: "https://instagram.com/example"
		},
		mediaUrl: "https://example.com/image.png",
		pay_base64: "iVBORw0KGgoAAAANSUhEUgAA...yourbase64string",
		zelle_base64: "iVBORw0KGgoAAAANSUhEUgAA...yourbase64string",
		user_image_base64: "iVBORw0KGgoAAAANSUhEUgAA...yourbase64string"
	};

	const sentEmails = [];
	const failedEmails = [];

	console.log(path.join(__dirname, '..', "assets/facebook.png"));
	
	for (const user of birthdayUsers) {
		if (!user.email) {
			console.error(`No email address found for user: ${user.first_name} ${user.last_name}`);
			continue;
		}

		const fullName = `${user.first_name} ${user.last_name}`;
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: user.email,
			subject: "Happy Birthday!",
			html: createEmailContent(template, fullName, user_image_base64, mediaUrl),
			attachments: [
				{ filename: 'paypal.png', content: pay_base64, encoding: 'base64', cid: 'paypal', contentType: 'image/png', contentDisposition: 'inline' },
				{ filename: 'zelle.png', content: zelle_base64, encoding: 'base64', cid: 'zelle', contentType: 'image/png', contentDisposition: 'inline' },
				{ filename: 'userImage.png', content: user_image_base64, encoding: 'base64', cid: 'userImage', contentType: 'image/png', contentDisposition: 'inline' },
			]
		};

		console.log(`Sending email to: ${user.email}`);
		try {
			await transporter.sendMail(mailOptions);
			console.log(`Email sent successfully to: ${fullName}`);
			sentEmails.push(user.email);
		} catch (error) {
			console.error(`Failed to send email to: ${fullName}`, error);
			failedEmails.push(user.email);
		}
	}

	res.status(200).send({
		sentEmails,
		failedEmails,
		message: "Birthday greetings sent successfully!"
	});
};

// Function to create HTML email content
const createEmailContent = (template, fullName, userImage, mediaUrl) => {
	return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Happy Birthday</title>
  </head>
  <body>
    <div style="text-align: center; font-family: Arial, sans-serif;">
      <h1 style="color: #ff9800;">Happy Birthday, ${fullName}!</h1>
      <img src="cid:userImage" alt="Birthday Image" style="max-width: 100%; height: auto; border-radius: 10px;">
      <p>${template.userDescription}</p>
      <p>Visit us: <a href="${template.websiteUrl}">${template.websiteUrl}</a></p>
      <p>Stay connected:</p>
      <a href="${template.facebookUrl}"><img src="${path.join(__dirname, '..', "assets/facebook.png")}" alt="Facebook" style="width: 40px; margin: 5px;"></a>
      <a href="${template.twitterUrl}"><img src="${path.join(__dirname, '..', "assets/twitter.png")}" alt="Twitter" style="width: 40px; margin: 5px;"></a>
      <a href="${template.instagramUrl}"><img src="${path.join(__dirname, '..', "assets/instagram.png")}" alt="Instagram" style="width: 40px; margin: 5px;"></a>
    </div>
  </body>
  </html>
  `;
};

module.exports = {
	sendEmails
};

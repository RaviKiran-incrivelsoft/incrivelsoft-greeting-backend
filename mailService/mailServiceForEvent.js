import {transporter} from "../utils/transporterUtil.js";

const EMAIL = process.env.EMAIL;

export default async function sendGreetings(template, userDetails) {

  console.log("Sending the event email for ", userDetails.email);

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
  <title>${template.title || "Custom Event Email"}</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #d9eae4; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
    <!-- Header -->
    <div style="background-color: #b49d80; color: #ffffff; text-align: center; padding: 20px;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Mr/Mrs ${userDetails.first_name} ${userDetails.last_name}, you're Invited!</h1>
      <h2 style="margin: 5px 0; font-size: 18px; font-weight: normal;">Join us for a special occasion ${template.title}</h2>
    </div>

    <div style="text-align: center; color: #b49d80; font-size: 20px; margin: 10px 0;">
      <h3>Celebrating Innovation and Togetherness</h3>
    </div>

    <!-- Image Section -->
    <div style="text-align: center; padding: 10px;">
      <img src=${template.banner || "https://tlr.stripocdn.email/content/guids/CABINET_b3ad24678cbb4d23876b91c37b9a8eb8/images/inviterafiki_1.png"} alt="Event Image" style="width: 100%; max-width: 500px; max-height: 300px; object-fit: contain; border-radius: 10px;" />
    </div>

    <!-- Description Section -->
    <div style="text-align: center; font-size: 16px; color: #555555; margin: 20px; line-height: 1.6;">
      ${template.description || "Welcome to our special event! Customize this message to include details about the occasion, such as what to expect, activities planned, or any important information. Make it personal and engaging!"}
      </div>

    <!-- Date and Time -->
    <div style="text-align: center; margin: 20px 0; display: flex; justify-content: center; align-items: center; font-size: 18px;">
      <div style="color: #b49d80; font-weight: bold; margin: 0 10px;">${monthName}</div>
      <div style="width: 2px; height: 60px; background-color: #b49d80;"></div>
      <div style="font-size: 48px; font-weight: bold; margin: 0 10px; color: #333333;">${day}</div>
      <div style="width: 2px; height: 60px; background-color: #b49d80;"></div>
      <div style="color: #b49d80; font-weight: bold; margin: 0 10px;">5 PM</div>
    </div>

    <!-- Venue -->
    <div style="text-align: center; font-size: 16px; color: #555555; margin: 20px; line-height: 1.5;">
      <strong style="display: block; color: #333333; margin-bottom: 5px;">Venue:</strong>
      <div style="margin: 0 80px;">${template.address || "123 Beach Road, Near RK Beach, Visakhapatnam, Andhra Pradesh 530002"}</div><br>
      <em>Join us for a memorable event at one of the most beautiful locations!</em>
    </div>

    <!-- Footer -->
    <div style="background-color: #b49d80; color: #ffffff; text-align: center; padding: 15px; font-size: 14px;">
      <p style="margin: 5px 0;">&copy; 2024 incrivelSoft. All rights reserved.</p>
      <p style="margin: 5px 0;">If you have any questions, contact us at <a href="mailto:hr@incrivelsoft.com" style="color: #ffffff; text-decoration: underline;">hr@incrivelsoft.com</a></p>
    </div>
  </div>
</body>

</html>
`;

  return html;
}


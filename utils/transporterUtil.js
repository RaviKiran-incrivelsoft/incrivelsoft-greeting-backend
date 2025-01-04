import nodemailer from "nodemailer";

const EMAIL = process.env.EMAIL; // Your Gmail address
const PASS_KEY = process.env.PASS_KEY; // Your Gmail app password

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail SMTP server
    port: 465, // Secure SMTP port
    secure: true, // Use TLS (recommended for Gmail)
    auth: {
        user: EMAIL,
        pass: PASS_KEY,
    },
});

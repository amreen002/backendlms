const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const axios = require('axios');
const twilio = require('twilio');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, TWILIO_WHATSAPP_NUMBER } = process.env;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function generateOTP() {
    return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
}

function sendOTPViaEmail(otp, email) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVICE_HOST,
        port: process.env.SMTP_SERVICE_PORT,
        secure: process.env.SMTP_SERVICE_SECURE === 'true',
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER_NAME,
            pass: process.env.SMTP_USER_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: process.env.SMTP_USER_NAME,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending OTP email:', error);
        } else {
            console.log('OTP email sent:', info.response);
        }
    });
}
function sendOTPViaSMS(otp, phoneNumber) {
    console.log('Sending OTP via SMS:', otp, 'to Phone Number:', phoneNumber);

    client.messages.create({
        body: `Your OTP code is ${otp}`,
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumber
    })
    .then(message => console.log('OTP SMS sent:', message.sid))
    .catch(error => {
        console.error('Error sending OTP SMS:', error.message);
    });
}
function sendOTPViaWhatsApp(otp, phoneNumber) {
    const token = 'YOUR_360DIALOG_API_TOKEN'; // Replace with your 360dialog API token

    axios.post('https://waba.360dialog.io/v1/messages', {
        to: phoneNumber,
        type: 'text',
        text: { body: `Your OTP code is ${otp}` }
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('OTP sent via WhatsApp:', response.data);
    })
    .catch(error => {
        console.error('Error sending OTP via WhatsApp:', error.message);
    });
}


module.exports = {
    generateOTP,
    sendOTPViaEmail,
    sendOTPViaSMS,
    sendOTPViaWhatsApp
};

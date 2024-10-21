const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL, PASSWORD } = process.env;

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Using Gmail as the email service
  auth: {
    user: 'manohar@symfor.com',
    pass: 'ythe grkf fyxz vvna',
  },
  tls: {
    rejectUnauthorized: false, // This line can help if you're having SSL issues
  },
});

// Function to send OTP
const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: EMAIL,
    to,
    subject: 'Your OTP for Login Verification',
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};

module.exports = { sendOTP };

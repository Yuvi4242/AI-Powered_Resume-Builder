const nodemailer = require('nodemailer');

/**
 * Send OTP via email using Gmail SMTP
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 */
const sendEmailOTP = async (email, otp) => {
  console.log('=== EMAIL DEBUG ===');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
  console.log('Sending OTP:', otp);
  console.log('Sending email to:', email);
  console.log('==================');

  // Create transporter with Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It expires in 2 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email response:', info.response);
    console.log('Email sent successfully!');
    return true;
  } catch (error) {
    console.error('EMAIL ERROR:', error.message);
    throw error;
  }
};

/**
 * Test email function - sends a fixed test email
 */
const sendTestEmail = async (email) => {
  console.log('=== TEST EMAIL DEBUG ===');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
  console.log('Sending test email to:', email);
  console.log('========================');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Test Email - AI Resume Builder',
      text: 'This is a test email. If you receive this, email is working!',
    });
    console.log('Test email response:', info.response);
    return { success: true, message: 'Test email sent' };
  } catch (error) {
    console.error('TEST EMAIL ERROR:', error.message);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendEmailOTP,
  sendTestEmail,
};

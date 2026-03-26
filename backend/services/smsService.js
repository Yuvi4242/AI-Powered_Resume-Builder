const twilio = require('twilio');

// Check if Twilio credentials are configured
const isTwilioConfigured = () => {
  return process.env.TWILIO_ACCOUNT_SID && 
         process.env.TWILIO_ACCOUNT_SID !== 'your_twilio_sid' &&
         process.env.TWILIO_AUTH_TOKEN && 
         process.env.TWILIO_AUTH_TOKEN !== 'your_twilio_token' &&
         process.env.TWILIO_PHONE_NUMBER && 
         process.env.TWILIO_PHONE_NUMBER !== 'your_twilio_phone_number';
};

// Initialize Twilio client only if credentials exist
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('Twilio SID:', process.env.TWILIO_ACCOUNT_SID);
  } catch (error) {
    console.error('Twilio Initialization Error:', error.message);
  }
} else {
  console.warn('TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is missing in .env');
}

/**
 * Send OTP via SMS using Twilio Messaging API
 * @param {string} phone - Recipient phone number
 * @param {string} otp - OTP code to send
 */
const sendSMSOTP = async (phone, otp) => {
  if (!client) {
    console.error('Twilio client not initialized. Cannot send SMS.');
    throw new Error('SMS service unavailable');
  }
  const formattedPhone = formatPhoneNumber(phone);
  console.log('Sending OTP to:', formattedPhone);

  try {
    const message = await client.messages.create({
      body: `Your AI Resume Builder OTP is ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });
    
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('Twilio SMS Error:', error.message);
    throw new Error('Failed to send SMS: ' + error.message);
  }
};

const formatPhoneNumber = (phone) => {
  if (!phone.startsWith('+')) {
    if (phone.startsWith('91') && phone.length > 10) {
      return '+' + phone;
    } else if (phone.length === 10) {
      return '+91' + phone;
    }
  }
  return phone.startsWith('+') ? phone : '+' + phone;
};

module.exports = {
  sendSMSOTP,
  isTwilioConfigured,
};

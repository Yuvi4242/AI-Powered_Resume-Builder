const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send OTP via email using Resend API (HTTP)
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<object>} response from Resend
 */
const sendOtpEmail = async (to, otp) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Verify your email</h2>
          <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 32px;">Please use the following single-use code to complete your verification process. This code will expire in 5 minutes.</p>
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 32px;">
            <h1 style="color: #2563eb; font-size: 40px; font-weight: 800; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #94a3b8; font-size: 14px; line-height: 20px;">If you didn't request this code, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="color: #64748b; font-size: 12px; text-align: center;">&copy; 2026 AI Powered Resume Builder. All rights reserved.</p>
        </div>
      `,
    });

    if (response.error) {
       console.error("❌ Resend API Error:", response.error);
       throw new Error(response.error.message || "Email failed to send via Resend");
    }

    console.log("✅ Email sent via Resend:", response.data.id);
    return response;
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    throw error;
  }
};

module.exports = {
  sendOtpEmail
};

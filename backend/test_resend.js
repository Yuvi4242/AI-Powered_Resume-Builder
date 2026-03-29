const { Resend } = require('resend');
require('./config/env');

const resend = new Resend(process.env.RESEND_API_KEY);

console.log('Testing Resend...');
console.log('API KEY type:', typeof process.env.RESEND_API_KEY);
console.log('EMAIL FROM:', process.env.EMAIL_FROM);

const test = async () => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: 'delivered@resend.dev', // Resend test address
      subject: "Test",
      html: "<h1>Test</h1>"
    });
    
    console.log('Response:', JSON.stringify(response, null, 2));
    
    if (response.error) {
       console.log('Error found in response');
    } else {
       console.log('Success! ID:', response.data?.id);
    }
  } catch (err) {
    console.error('Caught error:', err);
  }
};

test();

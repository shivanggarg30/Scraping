const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const otps = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/send-otp
router.post('/send-otp', async (req, res) => {
  console.log('Received OTP request:', req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = generateOTP();
  otps[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  };

  console.log(`Generated OTP for ${email}: ${otp}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gargshivang701@gmail.com',
      pass: 'equnrdseiqhjvstw',
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP connection failed:', error.message);
    } else {
      console.log('SMTP server is ready to send emails');
    }
  });

  const mailOptions = {
    from: '"Australian Events" <gargshivang701@gmail.com>',
    to: email,
    subject: 'Your OTP for Australian Events Access',
    html: `
      <div style="font-family: Arial; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0;">
        <h2 style="color: #4a90e2;">Australian Events</h2>
        <p>Use the code below to continue:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center;">
          <h1 style="font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', info.response);
    return res.status(200).json({ message: 'OTP sent successfully', success: true });
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return res.status(500).json({ message: 'Failed to send OTP email', success: false });
  }
});

// POST /api/verify-otp
router.post('/verify-otp', (req, res) => {
  console.log('Verifying OTP:', req.body);
  const { email, otp, eventUrl } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const stored = otps[email];
  console.log('Stored OTP info:', stored);

  if (!stored) {
    return res.status(400).json({ success: false, message: 'No OTP found for this email' });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  if (stored.expires < Date.now()) {
    delete otps[email];
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }

  // Clean up the OTP after successful verification
  delete otps[email];

  // Make sure we have a valid redirectUrl
  let redirectUrl = eventUrl;
  
  // If no eventUrl provided or it's not a valid URL, use default
  if (!redirectUrl || !redirectUrl.startsWith('http')) {
    redirectUrl = 'https://eventbrite.com.au';
  }
  
  console.log('✅ OTP verified successfully, redirecting to:', redirectUrl);

  return res.json({
    success: true,
    message: 'OTP verified successfully',
    redirectUrl: redirectUrl // Make sure redirectUrl is always returned
  });
});

module.exports = router;

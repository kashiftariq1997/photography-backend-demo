const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set up Nodemailer transporter using Gmail
// It requires EMAIL_USER and EMAIL_PASS (App Password) from .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST route for the contact form
app.post('/api/contact', async (req, res) => {
  const { 
    name, 
    phone, 
    email, 
    instagram, 
    shootType, 
    dateRequired, 
    flexible, 
    location, 
    totalHrs, 
    additionalInfo 
  } = req.body;

  if (!name || !phone || !email || !shootType || !flexible || !totalHrs) {
    return res.status(400).json({ success: false, message: 'Please fill out all required fields.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address (your email)
    to: process.env.EMAIL_USER,   // Receiver address (send to yourself)
    replyTo: email,               // Reply to the person who submitted
    subject: `New Inquiry from ${name}: ${shootType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-w-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #c29b62; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">
          New Photography Inquiry
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea; width: 35%;"><strong>Client Name</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;"><strong>Email</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;"><a href="mailto:${email}" style="color: #c29b62;">${email}</a></td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;"><strong>Phone Number</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;"><strong>Instagram</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">${instagram || 'N/A'}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;"><strong>Type of Shoot</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">${shootType}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;"><strong>Date/Time Required</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">${dateRequired || 'Not specified'}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;"><strong>Flexible on dates?</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">${flexible === 'flexible_yes' ? 'Yes' : flexible === 'flexible_no' ? 'No' : flexible}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;"><strong>Location / Venue</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">${location || 'Not specified'}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;"><strong>Total hrs required</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">${totalHrs}</td>
          </tr>
        </table>

        <div style="margin-top: 25px; padding: 15px; background-color: #f4f4f4; border-left: 4px solid #c29b62;">
          <h3 style="margin-top: 0; color: #555; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Additional Information</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${additionalInfo || 'No additional information provided.'}</p>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
          This email was generated securely from your website's contact form.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent for inquiry from ${name}`);
    return res.status(200).json({ success: true, message: 'Your inquiry has been sent successfully!' });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: 'Failed to send inquiry. Please try again later.' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

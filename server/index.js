require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3001; // We'll use this port for our backend

// Middleware
app.use(cors()); // Allow requests from our frontend
app.use(bodyParser.json()); // Parse JSON bodies

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API Endpoint for booking
app.post('/api/book-appointment', (req, res) => {
  const { date, email, subject } = req.body;

  console.log('Received booking request:', { date, email, subject });

  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: process.env.EMAIL_USER,   // list of receivers (send to yourself)
    replyTo: email,               // user's email to reply to
    subject: `New Appointment Request: ${subject}`, // Subject line
    html: `
      <h1>New Appointment Request</h1>
      <p><b>Date:</b> ${new Date(date).toLocaleDateString()}</p>
      <p><b>From:</b> ${email}</p>
      <p><b>Subject:</b></p>
      <p>${subject}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send email notification.' });
    }
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'Appointment request received and email sent!' });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 
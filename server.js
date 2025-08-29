const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email transporter configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Admin email list (could be loaded from environment variable)
const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];

// Form submission endpoint
app.post('/submit', async (req, res) => {
    try {
        const { name, email, phone, message, timestamp } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Create email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmails.join(','),
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <p><strong>Submitted at:</strong> ${new Date(timestamp).toLocaleString()}</p>
            `
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        
        // Send response
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

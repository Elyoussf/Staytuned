const nodemailer = require('nodemailer');
const Email = require('../models/Email');

const send = async (req, res) => {
    const { subject, body } = req.body;
    
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'strangeamazigh1968@gmail.com', // Your email address
                pass: process.env.app_password       // Your app password
            }
        });

        const emails = await Email.find();
        if (emails.length === 0) {
            return res.status(404).send('No emails found in the database.');
        }

        const sendEmailPromises = emails.map(email => {
            const mailOptions = {
                from: 'strangeamazigh1968@gmail.com',
                to: email.receiver_email, // Corrected field name
                subject: subject,
                text: body
            };

            return transporter.sendMail(mailOptions);
        });

        // Wait for all emails to be sent
        const results = await Promise.allSettled(sendEmailPromises);

        // Check results for any errors
        const failedEmails = results.filter(result => result.status === 'rejected');
        if (failedEmails.length > 0) {
            console.error('Some emails failed to send:', failedEmails);
            return res.status(500).send('Some emails failed to send.');
        }

        res.status(200).send('All emails sent successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while sending emails.');
    }
};

module.exports = { send };

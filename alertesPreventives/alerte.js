const nodemailer = require('nodemailer')
const send = async (req, res) => {
    const { to, subject, body } = req.body;

    // Create a transporter object using Gmail SMTP and the app password
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'strangeamazigh1968@gmail.com', // Your email address
            pass: process.env.app_password     // Your app password
        }
    });

    // Email options
    const mailOptions = {
        from: 'strangeamazigh1968@gmail.com',
        to: to,
        subject: subject,
        text: body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
}

module.exports = {send};
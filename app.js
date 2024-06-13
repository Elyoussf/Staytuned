const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./database/db');
const Camion = require('./models/Camion');
const dotenv = require('dotenv')
const app = express();
const port = 5000;
dotenv.config()
connectDB();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.options('*', cors());

// Create a new camion
app.post('/camions', async (req, res) => {
    try {
        const { immatriculation, type, kilometrage, dernierVidangeDate, dernierVidangeKilometrage ,details} = req.body;
        const nouveauCamion = new Camion({
            immatriculation,
            type,
            kilometrage,
            vidanges: [{ date: dernierVidangeDate, kilometrage: dernierVidangeKilometrage,details:details }],
            
        });
       
        await nouveauCamion.save();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update camion using POST
app.post('/camions/update', async (req, res) => {
    
    try {
        const { immatriculation, type, kilometrage, dernierVidangeDate, dernierVidangeKilometrage ,details} = req.body;
        const camion = await Camion.findOneAndUpdate(
            { immatriculation },
            {
                type,
                kilometrage,
                $push: { vidanges: { date: dernierVidangeDate, kilometrage: dernierVidangeKilometrage,details:details } },
                     
              },
            { new: true }
        );
        if (!camion) {
            return res.status(404).json({ error: 'Camion non trouvé' });
        }
        console.log("Update request received");
        res.status(200).json(camion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all camions
app.get('/camions', async (req, res) => {
    try {
        const camions = await Camion.find();
        res.status(200).json(camions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a camion by immatriculation
app.get('/camions/:immatriculation', async (req, res) => {
    try {
        const camion = await Camion.findOne({ immatriculation: req.params.immatriculation });
        if (!camion) {
            return res.status(404).json({ error: 'Camion non trouvé' });
        }
        res.status(200).json(camion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a camion by immatriculation
app.delete('/camions/:immatriculation', async (req, res) => {
    try {
        const camion = await Camion.findOneAndDelete({ immatriculation: req.params.immatriculation });
        if (!camion) {
            return res.status(404).json({ error: 'Camion non trouvé' });
        }
        res.status(200).json({ message: 'Camion supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server

/*app.post('/send-email', (req, res) => {
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
});






*/
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
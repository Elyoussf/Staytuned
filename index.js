const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // Add this line

const connectDB = require('./database/db');
const Camion = require('./models/Camion');
const Admin = require('./models/admin');
const Email = require('./models/Email');
const { send } = require('./alertesPreventives/alerte');
const authController = require('./controllers/auth');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // Enable CORS for all routes
app.use(cookieParser()); // Use cookie-parser middleware

// Routes

// Landing page route
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'landPage.html'));
});

// Create a new camion
app.post('/camions', auth, async (req, res) => {
    try {
        const { immatriculation, type, kilometrage, dernierVidangeDate, dernierVidangeKilometrage, cout, details } = req.body;
        const nouveauCamion = new Camion({
            immatriculation,
            type,
            kilometrage,
            vidanges: [{ date: dernierVidangeDate, kilometrage: dernierVidangeKilometrage, cout, details }],
        });

        await nouveauCamion.save();
        console.log("Camion ajouté avec succès");
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update camion using POST
app.post('/camions/update', auth, async (req, res) => {
    try {
        const { immatriculation, type, kilometrage, dernierVidangeDate, dernierVidangeKilometrage, cout, details } = req.body;
        const camion = await Camion.findOneAndUpdate(
            { immatriculation },
            {
                type,
                kilometrage,
                $push: { vidanges: { date: dernierVidangeDate, kilometrage: dernierVidangeKilometrage, cout, details } },
            },
            { new: true }
        );
        if (!camion) {
            return res.status(404).json({ error: 'Camion non trouvé' });
        }
        console.log("Camion mis à jour avec succès");
        res.status(200).json(camion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all camions
app.get('/camions', auth, async (req, res) => {
    try {
        const camions = await Camion.find();
        res.status(200).json(camions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a camion by immatriculation
app.get('/camions/:immatriculation', auth, async (req, res) => {
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
app.delete('/camions/:immatriculation', auth, async (req, res) => {
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

// Endpoint to send emails
app.post('/send-email', auth, send);

// Authentication endpoints
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.post('/api/logout', authController.logout);

// Get costs by year endpoint
app.post('/api/getCoutByYear', auth, async (req, res) => {
    const { year } = req.body;

    try {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);

        const camions = await Camion.find({ 'vidanges.date': { $gte: startDate, $lte: endDate } });

        const result = camions.reduce((acc, camion) => {
            camion.vidanges.forEach(vidange => {
                if (vidange.date >= startDate && vidange.date <= endDate) {
                    acc.push({
                        date: vidange.date,
                        cout: vidange.cout
                    });
                }
            });
            return acc;
        }, []);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to verify admin key
app.post('/verify-key', async (req, res) => {
    const { secret_key } = req.body;

    if (!secret_key) {
        return res.status(400).send('No secret key provided');
    }

    try {
        const admin = await Admin.findOne();
        if (!admin) {
            return res.status(404).send('Admin data not found');
        }
        if (admin.compareSecretKey(secret_key)) {
            return res.status(200).json({ success: true, message: 'Clé secrète vérifiée' });
        } else {
            return res.status(500).json({ success: false, error: 'Erreur de serveur' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Erreur de serveur');
    }
});

// Endpoint to change email
app.post('/change-email', async (req, res) => {
    const { receiver_email } = req.body;
    const newEmail = new Email({
        receiver_email: receiver_email
    });

    await newEmail.save();
    console.log("Email ajouté avec succès");
    res.status(200).json({ success: true, message: 'Email ajouté avec succès' });
});

app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));

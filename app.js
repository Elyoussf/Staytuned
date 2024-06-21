const express = require('express');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const Admin = require('./models/admin')
const bodyParser = require('body-parser');
const Email = require('./models/Email')
const cors = require('cors');
const connectDB = require('./database/db');
const Camion = require('./models/Camion');
const dotenv = require('dotenv')
const path = require('path')
const {send} = require('./alertesPreventives/alerte');
const authController= require('./controllers/auth');
const auth = require('./middleware/auth');
const { Console } = require('console');
const app = express();
const port = process.env.PORT
dotenv.config()
connectDB();

app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(cors({
    origin: 'https://80b2-196-81-60-153.ngrok-free.app', 
    credentials: true
  }));
 
app.options('*', cors());
app.get('/',function (req,res){
res.sendFile(path.join(__dirname,'public/landPage.html'))



})


// Create a new camion
app.post('/camions',auth,async (req, res) => {
  
    try {
        const { immatriculation, type, kilometrage, dernierVidangeDate, dernierVidangeKilometrage ,cout,details} = req.body;
        console.log(cout);
        const nouveauCamion = new Camion({
            immatriculation,
            type,
            kilometrage,
            vidanges: [{ date: dernierVidangeDate, kilometrage: dernierVidangeKilometrage,cout:cout,details:details }],
            
        });
        
        await nouveauCamion.save();
        console.log("received")
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update camion using POST
app.post('/camions/update',auth, async (req, res) => {
    
    try {
        const { immatriculation, type, kilometrage, dernierVidangeDate, dernierVidangeKilometrage ,cout,details} = req.body;
        const camion = await Camion.findOneAndUpdate(
            { immatriculation },
            {
                type,
                kilometrage,
                $push: { vidanges: { date: dernierVidangeDate, kilometrage: dernierVidangeKilometrage,cout:cout,details:details } },
                     
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
app.get('/camions', auth,async (req, res) => {
    try {
        const camions = await Camion.find();
        res.status(200).json(camions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a camion by immatriculation
app.get('/camions/:immatriculation', auth,async (req, res) => {
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
app.delete('/camions/:immatriculation', auth,async (req, res) => {
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
app.post("/send-email",auth,send);

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.post('/api/logout', authController.logout);

app.post('/api/getCoutByYear',auth,async (req, res) => {
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

// access admin space
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
            return res.status(200).json({ success: true, message: 'Secret key verified' });
        } else {
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
});
app.post('/change-email',async (req, res) => {
    const { receiver_email } = req.body;
    const newEmail = new Email({
        receiver_email:receiver_email
    })
  
    await newEmail.save()
    console.log("saved")
    res.status(200).json({ success: true, message: 'Email added successfully' });
});



app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));


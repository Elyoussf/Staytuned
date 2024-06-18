const express = require('express');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./database/db');
const Camion = require('./models/Camion');
const dotenv = require('dotenv')
const path = require('path')
const {send} = require('./alertesPreventives/alerte');
const authController= require('./controllers/auth');
const auth = require('./middleware/auth');
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

app.options('*', cors());
app.get('/',function (req,res){
res.sendFile(path.join(__dirname,'public/landPage.html'))
})
// Create a new camion
app.post('/camions', auth,async (req, res) => {
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
app.post('/camions/update',auth, async (req, res) => {
    
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
app.get('/camions',auth, async (req, res) => {
    try {
        const camions = await Camion.find();
        res.status(200).json(camions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a camion by immatriculation
app.get('/camions/:immatriculation',auth, async (req, res) => {
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
app.delete('/camions/:immatriculation',auth, async (req, res) => {
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
//app.post("/send-email",auth,send);

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.post('/api/logout', authController.logout);
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));

const notlogged = (req,res)=>{
    fetch('http://127.0.0.1')
}
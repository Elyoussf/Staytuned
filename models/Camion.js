const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const EnregistrementMaintenanceSchema = new Schema({
 
  date: { type: Date, required: true,unique:true },
  kilometrage: { type: Number, required: true },
  cout:{type:Number,required:true},
  details: { type: String, required: false }
});


const CamionSchema = new mongoose.Schema({
  // Utiliser immatriculation comme identifiant unique
  immatriculation: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  kilometrage: { type: Number, required: true },
  // Array of maintenance records
  vidanges: {
    type: [EnregistrementMaintenanceSchema], // Use the EnregistrementMaintenanceSchema here
    required: false // Make the array optional, if needed
  }
});
CamionSchema.pre('save', function(next) {
  this._id = this.immatriculation;
  next();
});
CamionSchema.methods.calculateKilometrageRestant = function() {
  const dernierVidange = this.vidanges.length > 0 ? this.vidanges[this.vidanges.length - 1].kilometrage : 0;
  return this.prochaineVidange - (this.kilometrage - dernierVidange);
};

const Camion = mongoose.model('Camion', CamionSchema);

module.exports = Camion;
const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    receiver_email: { type: String, required: true, unique: true }
});

const Email = mongoose.model('Email', EmailSchema); 
module.exports = Email;

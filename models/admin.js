const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv')
dotenv.config()
require('dotenv').config();
const secret_key = process.env.SECRET_KEY
const adminSchema = new mongoose.Schema({
    secret_key_hash: { type: String, required: true, unique: true }
});

adminSchema.pre('save', function(next) {
    const admin = this;
    // Hash the secret_key using SHA-256
    admin.secret_key_hash = crypto.createHash('sha256').update(secret_key).digest('hex');
    next();
});

adminSchema.methods.compareSecretKey = function(secretKey) {
    // Compare hashed secret_key_hash with the hash of the provided secretKey
    const hashedInput = crypto.createHash('sha256').update(secretKey).digest('hex');
    return this.secret_key_hash === hashedInput;
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;

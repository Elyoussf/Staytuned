const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Admin = require('../models/admin')
dotenv.config()
async function createAdmin(){
    try{
        const newAdmin = new Admin({secret_key_hash:process.env.SECRET_KEY})
        await newAdmin.save();
    console.log("created!!!")
    }catch(err){}
}

const dbPath = process.env.MONGO_URI
const connectDB = async ()=>{await mongoose.connect(dbPath)
    
    .then(()=>{console.log("connected successfully!!")
createAdmin()}
)
    .catch((err)=>{
    console.log(err)
})}



module.exports = connectDB;















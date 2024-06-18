const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const dbPath = process.env.MONGO_URI
const connectDB = async ()=>{await mongoose.connect(dbPath)
    .then(()=>console.log("connected successfully!!"))
    .catch((err)=>{
    console.log(err)
})}


module.exports = connectDB;















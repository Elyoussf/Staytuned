const mongoose = require('mongoose')

const dbPath = "mongodb://127.0.0.1:27017/yahala"
const connectDB = async ()=>{await mongoose.connect(dbPath)
    .then(()=>console.log("connected successfully!!"))
    .catch((err)=>{
    console.log(err)
})}


module.exports = connectDB;















const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema({
    username:{type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    password:{
        type:String,
        required:true
    }
})
UserSchema.pre('save',async function(next){
    if (!this.isModified('password')) return next()

    try{
        constslat = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
    }catch(err){
        next(err)
    }
})






module.exports = mongoose.model('user',UserSchema)
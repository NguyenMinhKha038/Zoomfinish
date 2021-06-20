const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const TeacherSchema = new Schema({
    Name: String,
    Email: {
        type: String,
        unique:true
    },
    Sdt: String,
    Image: String,
    Password: String
    
})
// TeacherSchema.pre('save', async function (next) {
//     //Hash the password before saving the user model
//     const Teacher = this
    
//     Teacher.Password = await bcrypt.hash(Teacher.Password, 8)
    
//     next()
// })


const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;
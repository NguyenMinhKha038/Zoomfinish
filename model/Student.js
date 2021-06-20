const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StudentSchema = new Schema({
    Name: String,
    Email: {
        type: String,
        unique:true
    },
    Password: String,
    ClassID:String,
    StudentID:String
    
})
const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
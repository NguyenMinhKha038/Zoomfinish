const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var filesSchema = new Schema({
    TeacherID: String,
    ClassID: String,
    StudentID:String,
    filepath: String,
    Title: String,
    FileName:String
})

const Homework = mongoose.model('filesSchema', filesSchema);
module.exports = Homework;
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ClassSchema = new Schema({
Name: String,
ClassName:String,
TeacherID: String,

});
const Class = mongoose.model('Class',ClassSchema);
module.exports = Class
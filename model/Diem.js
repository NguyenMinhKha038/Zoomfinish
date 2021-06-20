const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const DiemtSchema = new Schema({
    GiuaKy: {
        type:[]
    },
    CuoiKy: 0,
    Tong:0,
    StudentID: String,
    TeacherID: String,
    ClassID:String
 
});
const Diem = mongoose.model('Diem',DiemtSchema);
module.exports = Diem
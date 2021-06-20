const Student = require('../model/Student.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const StudentRegister = (req, res, next) => {
    bcrypt.hash(req.body.Password, 10, function (err, hashPassword) {
        if (err) {
            res.json({
                error:err
            })
        }
        

    
        let student = new Student({
        Name: req.body.studentName,
        Email: req.body.Email,
        StudentID: req.session.TeacherID,
        ClassID:req.session.ClassID,
        Password: hashPassword
        
    })
    student.save()
        .then(student => {
            res.redirect('/pgTeacher');
        })
        .catch(err => {
            res.json({
                message:'An error'
            })
        })
    })
    
} 
module.exports = StudentRegister;

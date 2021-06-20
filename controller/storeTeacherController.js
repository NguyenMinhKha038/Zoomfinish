const Teacher = require('../model/Teacher.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TeacherRegister = (req, res, next) => {
    bcrypt.hash(req.body.Password, 10, function (err, hashPassword) {
        if (err) {
            res.json({
                error:err
            })
        }
        
        
    
        let teacher = new Teacher({
        Name: req.body.Name,
        Email: req.body.Email,
        Sdt: req.body.Sdt,
        Password: hashPassword
    })
    teacher.save()
        .then(teacher => {
            res.redirect('/')
        })
        .catch(err => {
            res.json({
                message:'An error'
            })
        })
    })
    
} 
module.exports =  TeacherRegister

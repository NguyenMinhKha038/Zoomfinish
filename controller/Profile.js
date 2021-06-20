const bcrypt = require('bcrypt');
const { Session } = require('express-session');
const Teacher = require('../model/Teacher');
const Student = require('../model/Student');

module.exports = (req, res) => {

  //console.log(Email);
  //console.log(Password);
  if (TeacherloggedIn) {
     Teacher.findOne({Email: req.session.TeacherID}, (error, profile) => {
      //console.log(Teacher.Email);
        if (profile) {
          res.render('Profile.ejs', {
            Profile:profile
          })
        } else {
          console.log('Khong ton tai Teacher');
        }
    })
  }
  if (TeacherloggedIn == null) {
    Student.findOne({Email: req.session.StudentID}, (error, profile) => {
      //console.log(Teacher.Email);
        if (profile) {
          
          res.render('Profile.ejs', {
            Profile:profile
          })
        } else {
          
          console.log('Khong ton tai Teacher');
        }
    })
  }
   
}
const bcrypt = require('bcrypt')
const Teacher = require('../model/Teacher');

module.exports = (req, res) => {
    
  const { Email, Password } = req.body;
  //console.log(Email);
  //console.log(Password);
    Teacher.findOne({ Email: Email }, (error, teacher) => {
      //console.log(Teacher.Email);
        if (teacher) {
            
            bcrypt.compare(Password,teacher.Password, (err, same) => {
                //console.log(Teacher.Password)
              if (same) { // if passwords match
                  TeacherloggedIn = teacher.Email;
                  req.session.TeacherID= teacher.Email ;
                  console.log("Session class: "+req.session.ClassID);
                  msTeacherName = teacher.Name;
                  res.render('pgTeacher')
                }else if(err) {
                  res.redirect('/teacher/loginform')
                  console.log('mat khau khong dung')
                }
            })
        } else {
          res.redirect('/teacher/loginform')
          console.log('Khong ton tai Teacher');
        }
    })
}
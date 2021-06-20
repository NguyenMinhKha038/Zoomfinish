const bcrypt = require('bcrypt')
const Studnet = require('../model/Student');

module.exports = (req, res) => {
    
  const { Email, Password } = req.body;
  //console.log(Email);
  //console.log(Password);
    Studnet.findOne({ Email: Email }, (error, student) => {
      //console.log(Teacher.Email);
        if (student) {
            
            bcrypt.compare(Password,student.Password, (err, same) => {
                //console.log(Teacher.Password)
                if (same) { // if passwords match
                    //req.session.StudentID = student.StudentID;
                    req.session.ClassID = student.ClassID;
                  req.session.StudentID = student.Email;
                  req.session.StudentName = student.Name;
                  global.NameofStudent = student.Name;
                  console.log(req.session.StudentName);
    
                    res.render('pgTeacher')
                }else  {
                  //res.render('StundentLoginForm', { "err": req.flash('Email hoặc Mật khẩu không đung') });
                  // req.flash("error", "Email hoặc Mật khẩu không đung");
                  // res.render('StundentLoginForm');
                  //console.log('mat khau khong dung')
                  // req.flash('err', 'Flash is back!');
                  res.send('<script>alert("Mật khẩu không đúng")</script>');
                  
                  
                  
                }
            })
        } else {
          // res.redirect('/student')
          //console.log('Khong ton tai Student');
          // req.flash("error", "Email hoặc Mật khẩu không đung");
          res.send('<script>alert("Không tồn tại User")</script>');
          
          
        }
    })
}
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const server = require('http').createServer();  //Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const nodeMailer = require('nodemailer');
const peerServer = ExpressPeerServer(server, {
	debug: true,
})
const Student = require('../model/Student');

//gửi mail
const adminEmail = 'thanhhoai260299@gmail.com'
const adminPassword = 'eesezflxvaubojdq'
// Mình sử dụng host của google - gmail
const mailHost = 'smtp.gmail.com'
// 587 là một cổng tiêu chuẩn và phổ biến trong giao thức SMTP
const mailPort = 587;


const sendMail = (to, subject, htmlContent) => {
    // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        }
    })
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: htmlContent // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
};

module.exports = (req, res) => {
    var id= uuidv4();
    Student.find({ ClassID: req.session.ClassID }, (error, student) => {
    //console.log(Teacher.Email);
        for (let i = 0; i < student.length; i++){
        sendMail(student[i].Email,"Thông báo lớp học","Lớp học đã được mở hãy đăng nhập và "+`<a href="https://zoom-clone-done.herokuapp.com/room/create/${id}">tham gia lớp học</a>`);
        }
    });
    
    res.redirect(`/room/create/${id}`)
}
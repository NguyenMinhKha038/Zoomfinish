const express = require('express');
var flash = require('connect-flash');
const app = express();
app.use(flash());
const router = express.Router();
const ejs = require('ejs');
const expressSession = require('express-session');
app.set('view engine', 'ejs');
const bodyParser = require('body-parser')
const Teacher = require('./model/Teacher');
const BlogPost = require('./model/BlogPost');
const Class = require('./model/Class');
const Student = require('./model/Student');
const Diem = require('./model/Diem');
const Homework = require('./model/filesSchema');


const path = require('path');
const connectDb = require('./connection/db');



const newTeacher = require('./controller/newTeacherController');
const storeTeacherController = require('./controller/storeTeacherController');
const TeacherLoginFormController = require('./controller/TeacherLoginFormController');
const TeacherLoginController = require('./controller/TeacherLoginController');
const StudentLoginFormController = require('./controller/StudentLoginFormController');
const NewClass = require('./controller/Newclass');
const Logout = require('./controller/Logout');
const Profile = require('./controller/Profile');
const CreateRoom = require('./controller/CreateRoom');
const newPostController = require('./controller/newPostController');
const storeStudentController = require('./controller/storeStudentController');
const studentLoginController = require('./controller/StudentLoginController');
const multer = require('multer')



var storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'./public/uploads')
	},
	filename:function(req,file,cb){
		cb(null,file.originalname)
	}
})
var upload = multer({storage:storage})


var pathh = path.resolve(__dirname,'public');
app.use(express.static(pathh));
app.use(bodyParser.urlencoded({extended:false}));
app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');

const PORT = process.env.PORT || 3000

app.use(express.static('public'));
app.use(express.static('../public'))


const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const { Console } = require('console');
const { response } = require('express');
const peerServer = ExpressPeerServer(server, {
	debug: true,
})
app.use('/peerjs', peerServer)
app.use(bodyParser.json())
app.use(expressSession({
  resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 600000 }}));

connectDb();



app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));



const validateMiddleWare = (req, res, next) => {
 if ( req.body.Name == null || req.body.Email == null || req.body.Sdt == null
) {
 return res.redirect('/create/teacher')
 }
 next()
}
const checkSession = (req, res, next) => {
	if (req.session.TeacherID == null&&req.session.StudentID==null) {
		return res.send('<script>alert("Phiên làm việc đã hết,vui lòng đăng nhập lại")</script>');
	}

	next();
}
global.TeacherloggedIn = null;
app.use('/create/teacher',validateMiddleWare)
app.get('/', (req, res) => {
    res.render('Trangchu');
})
app.get('/student', StudentLoginFormController);
app.post('/student/login',studentLoginController);

app.get('/singup', newTeacher);
app.post('/create/teacher', storeTeacherController);
app.get('/teacher/loginform', TeacherLoginFormController);
app.post('/teacher/login', TeacherLoginController);
app.get('/logout', Logout);
app.get('/create/class',checkSession, NewClass);
app.get('/profile',checkSession, Profile);
app.get('/create/room',checkSession, CreateRoom);
app.get('/room/create/:room', checkSession, (req, res) => {
	console.log("Session"+req.session.StudentName);
	res.render('room', { roomId: req.params.room })
})
app.get('/create/post', checkSession, newPostController);
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});
app.post('/posts/store', (req, res) => {
	
	BlogPost.create({ title: req.body.title, body: req.body.body, PostID: req.session.TeacherID,ClassID:req.session.ClassID}, (err, blogpost) => {
		console.log(blogpost)
		res.redirect('/viewClass');
	})
})
app.get('/create/student',checkSession ,(req, res) => {
	res.render('createStudent')
})
app.post('/create/students', checkSession, storeStudentController);
app.post('/create/classs', checkSession, (req, res) => {
	Class.create({ Name: req.body.Name, ClassName: req.body.ClassName, TeacherID: req.session.TeacherID }, (err, classs) => {
		console.log(classs)
		res.render('pgTeacher');
	})
})
// app.get('/viewpost', (req, res) => {
// 	BlogPost.find({ClassID:req.session.ClassID }, function (error, posts) {
//  		res.render('viewPost', {
//  			blogposts: posts
//  		});
//  	})
// })

app.get('/viewpost/:id', (req, response) => {
	BlogPost.findById(req.params.id, function (error, detailPosts) {
 		response.render('detailPost', {
 			detailPosts
 		});
 	})
})
app.get('/viewclass', (req, res) => {
	if (TeacherloggedIn) {
		Class.find({ TeacherID: req.session.TeacherID}, function (error, classs) {
 			res.render('viewClass', {
 				classs: classs
 			});
 		})
	}
	if (TeacherloggedIn == null) {
		Class.find({ _id: req.session.ClassID}, function (error, classs) {
 			res.render('viewClass', {
 				classs: classs
 			});
 		})
	}
})
app.get('/viewclass/:id', (req, res) => {
	Class.findById(req.params.id, function (error, detailClass) {
		req.session.ClassID =req.params.id;
		console.log(req.session);
 		// res.render('detailClass', {
 		// 	detailClass
		 // });
		BlogPost.find({ ClassID: req.session.ClassID }, function (error, posts) {
			res.render('detailClass', {
 			blogposts: posts
 		});
 	})
 	})
})
app.get('/deleteClass/:id', (req, res) => {

	Class.findById(req.params.id, function (error, detailClass) {
		req.session.ClassID = req.params.id;
		ClassID = req.session.ClassID;
		console.log(ClassID);
		BlogPost.deleteMany({ ClassID: ClassID }).then(response => {
    		console.log(response)
  			})
  			.catch(err => {
    			console.error(err)
  			})
		Diem.deleteMany({ ClassID: ClassID }).then(response => {
    		console.log(response)
  			})
  			.catch(err => {
    			console.error(err)
  			})
		Class.deleteMany({ _id: ClassID }).then(response => {
    		console.log(response)
  			})
  			.catch(err => {
    		console.error(err)
  			})
			
		Homework.deleteMany({ ClassID: ClassID }).then(response => {
    		console.log(response)
  			})
  			.catch(err => {
    		console.error(err)
  			})	
			
		Student.deleteMany({ ClassID: ClassID }).then(response => {
   	 		console.log(response)
  			})
  			.catch(err => {
    		console.error(err)
  			})
			
		res.redirect('/viewClass');
	
	})
	
	
	
	
	
})

app.get('/studentviewclass', (req, res) => {
	Class.find({ _id: req.session.ClassID }, function (error, classStudent) {
 		res.render('StudentViewClass', {
 			classStudent: classStudent
 		});
 	})
})
app.get('/studentviewclass/:id', (req, res) => {
	Class.findById(req.params.id, function (error, detailClass) {
		req.session.ClassID =req.params.id;
		console.log(req.session);
 		res.render('detailClass', {
 			detailClass
 		});
 	})
})
app.get('/pgTeacher',checkSession, (req, res) => {
	res.render('pgTeacher');
})
app.get('/viewstudent', (req, res) => {
	Student.find({ ClassID: req.session.ClassID }, function (error, student) {
		console.log(req.session);
 		res.render('Student', {
 			student: student
 		});
 	})
})
//xem chi tiết 1 sv
app.get('/viewstudent/:id', (req, res) => {
	Student.findById(req.params.id, function (error, detailstudent) {
		req.session.StudentID = detailstudent.Email;
		req.session.StudentMail=detailstudent.Email;
		console.log(req.session.StudentMail);
 		res.render('detailStudent', {
 			detailstudent: detailstudent
 		});
 	})
})
//tao diem sv
app.post('/diem', (req, res) => {
	Diem.findOne({ StudentID: req.session.StudentID,ClassID:req.session.ClassID}, function (error, sldiem) {
		if (sldiem) {
			console.log("đã tồn tại");
			var arr = [];
			for (let i = 0; i < sldiem.GiuaKy.length; i++){
				arr += sldiem.GiuaKy[i];
			}
			arr += req.body.GiuaKy;
			
			var giuaky = 0;
			for (let i = 0; i <= arr.length-1; i++){
				giuaky = (Number(giuaky) + Number(arr[i]));
			}
			giuaky = giuaky / (arr.length);
			var Tong = (Number(giuaky) + Number(sldiem.CuoiKy)) / 2;
			console.log("Giua ky:" + giuaky);
			console.log("Cuoi ky:" + req.body.CuoiKy);
			console.log("Tong:" + Tong);
			if (req.body.CuoiKy) {
				Diem.findOneAndUpdate({ StudentID: req.session.StudentID, ClassID: req.session.ClassID }, { $set: { GiuaKy: arr,Tong:Number(Tong),CuoiKy:req.body.CuoiKy } }, function (err, data) {
				res.render('pgTeacher');
				})
			} else {
				Diem.findOneAndUpdate({ StudentID: req.session.StudentID, ClassID: req.session.ClassID }, { $set: { GiuaKy: arr,Tong:Number(Tong)} }, function (err, data) {
				res.render('pgTeacher');
				})
			}
			
		} else {
			Diem.create({ GiuaKy: req.body.GiuaKy, CuoiKy: req.body.CuoiKy,Tong:Number(req.body.GiuaKy)/2+Number(req.body.CuoiKy)/2, StudentID: req.session.StudentID,ClassID:req.session.ClassID,TeacherID:req.session.TeacherID}, (err, diem) => {
			console.log(req.session);
			console.log(diem)
			res.render('pgTeacher');
	})
		}
 	})
	
	
})
app.get('/xemdiem', (req, res) => {
	Diem.find({ ClassID:req.session.ClassID,StudentID:req.session.StudentID}, function (error, xemdiem) {
		//console.log(req.session);
		console.log("Xem điểm"+xemdiem);
 		res.render('viewCore', {
 			xemdiem:xemdiem
 		});
 	})
})
app.get('/nopbaitap', (req, res) => {
	console.log(req.session);
	res.redirect('/homework');
})




app.get('/homework', (req, res) => {
	if (TeacherloggedIn == null) {
		Homework.find({ ClassID: req.session.ClassID, StudentID: req.session.StudentID }, (err, data) => {
			res.render('homework', { data: data, });
		})
	} else {
		Homework.find({ ClassID: req.session.ClassID, TeacherID: req.session.TeacherID }, (err, data) => {
			res.render('homework', { data: data, });
		})
	}
})
	

app.post('/homework',upload.single('fil'),(req,res)=>{
	var x = 'uploads/' + req.file.originalname;
	var filename = req.file.originalname;
	if (TeacherloggedIn == null) {
		var temp = new Homework({
			ClassID: req.session.ClassID,
			StudentID: req.session.StudentID,
			//Title: Title,
			filepath: x,
			FileName:filename
   		})
	} else {
		var temp = new Homework({
			ClassID: req.session.ClassID,
			TeacherID: req.session.TeacherID,
			//Title: title,
			filepath:x
   		})
	}
	
    temp.save((err,data)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/homework')
    })
})

app.get('/download/:id',(req,res)=>{
    Homework.find({_id:req.params.id},(err,data)=>{
	console.log(data.filepath)
         if(err){
             console.log(err)
         }
         else{
             var x= __dirname+'/public/' + data[0].filepath;
             res.download(x)
         }
    })
})
app.get('/delete/student', (req, res) => {
	Student.findOneAndDelete({Email: req.session.StudentMail,ClassID:req.session.ClassID }, function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
         Diem.deleteMany({Email: req.session.StudentMail,ClassID:req.session.ClassID }).then(response => {
    		console.log(response)
  			})
  			.catch(err => {
    			console.error(err)
			})
		Homework.deleteMany({Email: req.session.StudentMail,ClassID:req.session.ClassID }).then(response => {
    		console.log(response)
  			})
  			.catch(err => {
    		console.error(err)
				})	
		res.redirect('/viewstudent');
		
    } 
}); 
})


const formatMessages = require('./utils/messages');
const formatUserId = require('./utils/information');

io.on('connection', (socket) => {
	socket.on('join-room', (roomId, userId) => {
	socket.join(roomId)
	if(TeacherloggedIn == null)
		socket.to(roomId).broadcast.emit('user-connected',formatUserId(NameofStudent,userId))
	else
		socket.to(roomId).broadcast.emit('user-connected',formatUserId(msTeacherName,userId))
	socket.on('message', (message) => {
		if(TeacherloggedIn == null){
			io.to(roomId).emit('createMessage',formatMessages(NameofStudent,message) , userId)
		}
		else{
			io.to(roomId).emit('createMessage',formatMessages(msTeacherName,message) , userId)
		}
	})
	socket.on('disconnect', () => {
		if(TeacherloggedIn == null)
			socket.to(roomId).broadcast.emit('user-disconnected',formatUserId(NameofStudent,userId))
		else
			socket.to(roomId).broadcast.emit('user-disconnected',formatUserId(msTeacherName,userId))
	})
})
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))

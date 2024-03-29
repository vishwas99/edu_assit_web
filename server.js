var express = require("express");
var app = express();
var session = require('express-session');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = __dirname;
const multer = require('multer');
const upload = multer({dest: __dirname + '/images'});
//var book = require(./books.js)

//multer images

app.post('/upload', upload.single('photo'), (req, res) => {
    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
});

//end

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "/Landing" + "/landing.html");
});

router.get("/engg.html",function(req,res){
  res.sendFile(path + "/Engineering" + "/engg.html");
});

router.get("/engg/mba.html",function(req,res){
  res.sendFile(path + "/Mba" + "/mba.html");
});

router.get("/engg/mtech-ms.html",function(req,res){
  res.sendFile(path + "/MTechMS" + "/mtech-ms.html");
});

router.get("/engg/upsc.html",function(req,res){
  res.sendFile(path + "/Upsc" + "/civil-services.html");
});

router.get("/team.html",function(req,res){
  res.sendFile(path + "/Team" + "/team.html");
});

router.get("/engg/mtech-ms/resources-mtech-ms.html",function(req,res){
  res.sendFile(path + "/Resources" + "/resource-mtech-ms.html");
});

router.get("/engg/mtech-ms/resources-mtech-ms.html", function (req, res) {
  res.sendFile(path + "/Resources" + "/resource-mtech-ms.html");
});

router.get("/signup.html", function (req, res) {
  res.sendFile(path + "/signup" + "/signup.html");
});

router.get("/login.html", function (req, res) {
  res.sendFile(path + "/login" + "/login.html");
});

router.get("/resell.html", function (req, res) {
	res.sendFile(path + "/Book" + "/resel.html");
});

router.get("/register", function (req, res) {
  res.sendFile(path + "/login" + "/login.html");
});

app.use(express.static(path + '/Landing'))
app.use(express.static(path + '/Engineering'))
app.use('/engg',express.static(path + '/Mba'))
app.use('/engg',express.static(path + '/MtechMS'))
app.use('/engg',express.static(path + '/Upsc'))
app.use(express.static(path + '/Team'))
app.use('/engg/mtech-ms',express.static(path + '/Resources'))
app.use(express.static(path + '/signup'))
app.use(express.static(path + '/login'))
app.use(express.static(path + '/Book'))

// var arry = ["Saab", "Volvo", "BMW"];
// app.get('/sample-api', (req, res) => {
// 	res.json({ text: arry });
// })

//sql database
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'nodelogin',

});
// Books

app.post('/sale',function(request,response){
	var title = request.body.title;
	var price = request.body.price;
	var contact = request.body.contact;
	var desc = request.body.desc;
	var date = request.body.date;
	console.log(title,price,contact,desc,date);

			//var insert = 'insert into books (`title` , `price` , `contact` , `date`) values ?';
			//var query = mysql.format(insert , [title , price , contact, date]);
		connection.query("insert into books (`title` , `price` , `contact` , `data`) values('" + title + "', '" + price + "', '" + contact + "', '" + date + "');",(error , response) => {
					if(error){
						console.log(error);
					}	else {
							console.log('Your book is now up for sale. Interested parties will contact you');
					}
					//connection.end();
				});

			//	connection.end();

	});

	app.get('/books', function(req , res){
		connection.query('SELECT * FROM books ORDER BY  `date`', function(error , result, fields){
			if(err){
				console.log("err");
			}	 else {
							res.json({result : result})
						}
							});
		});



//login
app.post('/auth', function(request, response) {
	var email = request.body.email;
  //console.log(email);
	var password = request.body.password;
	if (email && password) {
		connection.query('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.email = email;
				response.redirect('/');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/logout',function(request,response){
	request.session.loggedin = false;
	response.json({logout: 'YES'});
})

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


//sign up

app.post('/register', function(req , res){

	var	username = req.body.name;
	var	password = req.body.password;
	var	email = req.body.email;
	console.log(username);

	connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields){
		if(results.length > 0){
			res.send("User already exist");
		}	else{
			connection.query("insert into accounts (`username` , `password` , `email` ) values ('" + username + "', '" + password + "', '" + email + "');", (error , result) => {
				if(error){
					console.log(error);
				}	else {
					res.redirect("/");
				}
			});
		}
	});

});

// (`username` , `password` , `email` )
app.get('/user', (req, res) => {
	res.json({ check: req.session.loggedin, email: req.session.email });
	// res.json({text: "val", check: 'lue'})
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});

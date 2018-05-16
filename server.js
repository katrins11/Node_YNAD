//SPURJA Á ÞETTA AÐ VERA VAR EÐA CONST!?
const mysql = require('mysql');
const express = require('express');
global.app = express();
global.gFs = require('fs');
//WHAT IS FORMIDABLE FOR?
var formidable = require('express-formidable');
//WHAT IS BODYPARSER FOR?
var bodyParser = require('body-parser');
//WHAT IS cookieParser FOR?
global.cookieParser = require('cookie-parser');
//WHAT IS session FOR?
global.session = require('express-session');
//WHAT IS passport FOR? To test if the user is logged in
global.passport = require('passport');
//WHAT IS LocalStrategy FOR?
global.LocalStrategy = require('passport-local').Strategy;
//WHAT IS MySQLStore FOR?
global.MySQLStore = require('express-mysql-session')(session);
//WHAT IS bcrypt FOR?
global.bcrypt = require('bcrypt');
//WHAT IS mailer FOR? It is to verify the user when he signes up. 
global.mailer = require('node-mailer');
global.nodemailer = require('nodemailer');

// app.use(formidable());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser());

const sHeaderHTML = gFs.readFileSync( __dirname + '/html/header.html', 'utf8');
const sHomeHTML = gFs.readFileSync( __dirname + '/html/pages/home.html', 'utf8');
const sFooterHTML = gFs.readFileSync( __dirname + '/html/footer.html', 'utf8');
const sMyProfileHTML = gFs.readFileSync( __dirname + '/html/admin/admin-my-profile.html', 'utf8');
const ChatFile = require(__dirname + '/public/js/chat.js');
const UserFile = require(__dirname + '/public/js/users.js');
const PiecesFile = require(__dirname + '/public/js/pieces.js');
const sendSmsFile = require(__dirname + '/public/js/sms.js');
ChatFile.getChat();

/* *** *** Access to pages *** *** */
function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
	    if (req.isAuthenticated()) return next();
	    res.redirect('/log-in');
	}
}

/* *** *** OUR DATABASE *** *** */
global.db = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    database: "dbynad",
    port: 8889
});
/* *** *** CONNET TO OUR DATABASE *** *** */
db.connect(err => {
    if(err){console.log(err), process.exit()}
    console.log('connected');
});


/* *** *** Home *** *** */
app.get('/', (req, res) => {
    console.log(req.isAuthenticated());
    res.send(sHeaderHTML + sHomeHTML + sFooterHTML);
});


/* *** *** *** *** *** PAGES *** *** *** *** *** */
/* *** *** LogIn *** *** */
app.get('/log-in', (req, res) => {
    var sLogInHTML = gFs.readFileSync( __dirname + '/html/pages/log-in.html', 'utf8');
    res.send(sHeaderHTML + sHomeHTML + sLogInHTML + sFooterHTML);
});
app.post('/log-in', passport.authenticate('local',{
    successRedirect:'/admin-add-piece', failureRedirect:'/log-in'}));

/* *** *** LogOut *** *** */
app.get('/log-out', (req, res) => {
    req.logOut();
    req.session.destroy();
    res.redirect('/');
});

/* *** *** SignUp *** *** */
app.get('/get-user-location', (req, res) => {
    UserFile.getUserLocation(req, res);
});
app.get('/sign-up', (req, res) => {
    var sSignUpHTML = gFs.readFileSync( __dirname + '/html/pages/sign-up.html', 'utf8');
    res.send(sHeaderHTML + sHomeHTML + sSignUpHTML + sFooterHTML);
});
app.post('/sign-up', (req, res) => {
    UserFile.saveUser(req, res);
});
app.get('/verification', (req, res) => {
    token = "hi";
    db.query('SELECT * FROM users WHERE secretToken = ?', [token], (err, results, fields)=>{
        if(err){ done(err);}
        else{
            db.query('UPDATE users SET active=true WHERE secretToken="hi"', (err, results, fields)=>{
                console.log("user is now active");
            });
        }
    });
});

/* *** *** Pieces *** *** */
app.get('/pieces', (req, res) => {
    var sPiecesHTML = gFs.readFileSync( __dirname + '/html/pages/pieces.html', 'utf8');
    res.send(sHeaderHTML + sPiecesHTML + sFooterHTML);
});

/* *** *** Creatives *** *** */
app.get('/creatives', (req, res) => {
    var sCreativesHTML = gFs.readFileSync( __dirname + '/html/pages/creatives.html', 'utf8');
    res.send(sHeaderHTML + sCreativesHTML + sFooterHTML);
});

/* *** *** About *** *** */
app.get('/about', (req, res) => {
    var sAboutHTML = gFs.readFileSync( __dirname + '/html/pages/about.html', 'utf8');
    res.send(sHeaderHTML + sAboutHTML + sFooterHTML);
});

/* *** *** SMS *** *** */
app.get('/sms', (req, res) => {
    var sSmsHTML = gFs.readFileSync( __dirname + '/html/admin/sms.html', 'utf8');
    res.send(sHeaderHTML + sHomeHTML + sSmsHTML + sFooterHTML);
});
/* *** *** Send SMS To User *** *** */
app.post('/sms', (req, res) => {
    sendSmsFile.sendSmsData(req, res);
});

/* *** *** Newsletter *** *** */
app.post('/newsletter', (req, res) => {
});


/* *** *** *** *** *** ADMIN *** *** *** *** *** */
/* *** *** My Profile *** *** */
app.get('/admin-my-profile', authenticationMiddleware(), (req, res) => {
    res.send(sHeaderHTML + sMyProfileHTML + sFooterHTML);
});

/* *** *** Edit Profile *** *** */
app.get('/admin-edit-profile', authenticationMiddleware(), (req, res) => {
    var sEditProfileHTML = gFs.readFileSync( __dirname + '/html/admin/admin-edit-profile.html', 'utf8');
    res.send(sHeaderHTML + sEditProfileHTML + sFooterHTML);
});

/* *** *** My Pieces *** *** */
app.get('/admin-my-pieces', authenticationMiddleware(), (req, res) => {
    var sMyPiecesHTML = gFs.readFileSync( __dirname + '/html/admin/admin-my-pieces.html', 'utf8');
    res.send(sHeaderHTML + sMyPiecesHTML + sFooterHTML);
});

/* *** *** Chat *** *** */
app.get('/admin-chat', authenticationMiddleware(), (req, res) => {
    var sChatHTML = gFs.readFileSync( __dirname + '/html/admin/admin-chat.html', 'utf8');
    res.send(sHeaderHTML + sChatHTML + sFooterHTML);
});

/* *** *** Add Piece *** *** */
app.get('/admin-add-piece', authenticationMiddleware(), (req, res) => {
    var sAddPieceHTML = gFs.readFileSync( __dirname + '/html/admin/admin-add-piece.html', 'utf8');
    res.send(sHeaderHTML + sAddPieceHTML + sFooterHTML);
});
app.post('/submit-piece',(req, res) => {
    PiecesFile.savePiece(req, res);
});
app.get('/get-piece-media', (req, res) => {
    PiecesFile.getPieceMedia(req, res);
});
app.get('/get-piece-date-created', (req, res) => {
    PiecesFile.getPieceDate(req, res);
});




/* *** *** LISTENING TO PORT *** *** */
var port = 1983;
app.listen(port, err => {
    if(err) {
        console.log("error");
        return;
    }
    console.log("server is running on port 1983");
})
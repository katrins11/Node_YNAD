//SPURJA Á ÞETTA AÐ VERA VAR EÐA CONST!?
var mysql = require('mysql');
var express = require('express');
var app = express();
var formidable = require('express-formidable');
var bodyParser = require('body-parser');
global.gFs = require('fs');
app.use(express.static(__dirname + '/public'));


// app.use(formidable());
app.use(bodyParser());

const sHeaderHTML = gFs.readFileSync( __dirname + '/html/header.html', 'utf8');
const sFooterHTML = gFs.readFileSync( __dirname + '/html/footer.html', 'utf8');
const chatFile = require(__dirname + '/chat.js');
const UserFile = require(__dirname + '/users.js');
chatFile.getChat();

/* *** *** ATH.. ANNAÐHVORT Á ÞETTA AÐ VERA HERNA EF VIÐ NOTUM DATAB. ANNARSTAÐAR EN Í users.js ANNARS TAKA ÚT // Taka þá út í users *** *** */
// //OUR DATABASE
// global.db = mysql.createConnection({
//     host: "localhost",
//     user: "admin",
//     password: "password",
//     database: "dbynad",
//     port: 8889
// });

// //CONNET TO OUR DATABASE
// db.connect(err => {
//     if(err){console.log(err), process.exit()}
//     console.log('connected');
// });



/* *** *** Home *** *** */
app.get('/', (req, res) => {
    var sHomeHTML = gFs.readFileSync( __dirname + '/html/home.html', 'utf8');
    res.send(sHeaderHTML + sHomeHTML + sFooterHTML);
});

/* *** *** Chat *** *** */
app.get('/chat', (req, res) => {
    var sChatHTML = gFs.readFileSync( __dirname + '/html/chat.html', 'utf8');
    res.send(sHeaderHTML + sChatHTML + sFooterHTML);
});

/* *** *** Pieces *** *** */
app.get('/pieces', (req, res) => {
    var sPiecesHTML = gFs.readFileSync( __dirname + '/html/pieces.html', 'utf8');
    res.send(sHeaderHTML + sPiecesHTML + sFooterHTML);
});

/* *** *** LogIn Page *** *** */
app.get('/log-in', (req, res) => {
    var sLogInHTML = gFs.readFileSync( __dirname + '/html/log-in.html', 'utf8');
    res.send(sHeaderHTML + sLogInHTML + sFooterHTML);
});

/* *** *** SignUp Page *** *** */
app.get('/sign-up', (req, res) => {
    var sHomeHTML = gFs.readFileSync( __dirname + '/html/home.html', 'utf8');
    var sSignUpHTML = gFs.readFileSync( __dirname + '/html/sign-up.html', 'utf8');
    res.send(sHeaderHTML + sHomeHTML + sSignUpHTML + sFooterHTML);
});
/* *** *** Add User *** *** */
app.post('/submit-sign-up', (req, res) => {
    UserFile.saveUser(req, res);
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
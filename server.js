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
//passport IS FOR THE LOGIN, HAS OVERVIEW FOR IF USER IS LOGGED IN OR NOT
global.passport = require('passport');
//WHAT IS LocalStrategy FOR?
global.LocalStrategy = require('passport-local').Strategy;
//WHAT IS MySQLStore FOR?
global.MySQLStore = require('express-mysql-session')(session);
//bcrypt IS USED FOR THE PASSWORD TO HASH IT / PROTECT IT. THEN IT'S NOT VISABLE IN THE DATABASE(JUST COMES AS A RANDOM CARACTERS)
global.bcrypt = require('bcrypt');

//nodemailer IS USED TO VERIFY THE USER WHEN HE REGISTERS.
global.nodemailer = require('nodemailer');

// app.use(formidable());
app.use(bodyParser());
app.use(cookieParser());

/* *** TO ECCESS THE PULIC FILE *** */
app.use(express.static(__dirname + '/public'));

/* *** FILES NOT CHANGING SO... CONST *** */
const sSignUpHTML = gFs.readFileSync( __dirname + '/html/pages/sign-up.html', 'utf8');
const sVerificationHTML = gFs.readFileSync( __dirname + '/html/pages/verification.html', 'utf8');
const sLogInHTML = gFs.readFileSync( __dirname + '/html/pages/log-in.html', 'utf8');
const sAddPieceHTML = gFs.readFileSync( __dirname + '/html/admin/admin-add-piece.html', 'utf8');

const sHeaderHTML = gFs.readFileSync( __dirname + '/html/header.html', 'utf8');
const sAdminHeaderHTML = gFs.readFileSync( __dirname + '/html/admin-header.html', 'utf8');
const sFooterHTML = gFs.readFileSync( __dirname + '/html/footer.html', 'utf8');

const sFrontBackgroundHTML = gFs.readFileSync( __dirname + '/html/background-front.html', 'utf8');
const sHomeHTML = gFs.readFileSync( __dirname + '/html/pages/home.html', 'utf8');

const sAboutHTML = gFs.readFileSync( __dirname + '/html/pages/about.html', 'utf8');
const sCreativesHTML = gFs.readFileSync( __dirname + '/html/pages/creatives.html', 'utf8');

const sPiecesHTML = gFs.readFileSync( __dirname + '/html/pages/pieces.html', 'utf8');
const sSmsHTML = gFs.readFileSync( __dirname + '/html/pages/sms.html', 'utf8');
const sChatHTML = gFs.readFileSync( __dirname + '/html/admin/admin-chat.html', 'utf8');

/* *** CHANGEABLE INFORMATIONS SO... VAR *** */
var sMyProfileHTML = gFs.readFileSync( __dirname + '/html/admin/admin-my-profile.html', 'utf8');
var sEditProfileHTML = gFs.readFileSync( __dirname + '/html/admin/admin-edit-profile.html', 'utf8');
var sMyPiecesHTML = gFs.readFileSync( __dirname + '/html/admin/admin-my-pieces.html', 'utf8');

/* *** JS FILES *** */
const ChatFile = require(__dirname + '/public/js/chat.js');
const UserFile = require(__dirname + '/public/js/users.js');
const PiecesFile = require(__dirname + '/public/js/pieces.js');
const sendSmsFile = require(__dirname + '/public/js/sms.js');
ChatFile.getChat();

/* *** *** Access to pages *** *** */
function authenticationMiddleware () {  
	return (req, res, next) => {
        console.log('req.session.passport.user:', req.session.passport);
        console.log('isAuthisfd: ', req.isAuthenticated());
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


/* *** HOME *** HOME *** HOME *** HOME *** HOME *** HOME *** HOME *** HOME *** HOME *** */
app.get('/', (req, res) => {
    if(req.isAuthenticated()){
        res.send(sAdminHeaderHTML + sHomeHTML + sFooterHTML);
    }
    else{
        res.send(sHeaderHTML + sHomeHTML + sFooterHTML);
    }
});


/* *** PAGES *** PAGES *** PAGES *** PAGES *** PAGES *** PAGES *** PAGES *** PAGES *** PAGES *** */
/* *** *** SignUp *** *** */
app.get('/get-user-location', (req, res) => {
    UserFile.getUserLocation(req, res);
});
app.get('/sign-up', (req, res) => {
    res.send(sHeaderHTML + sFrontBackgroundHTML + sSignUpHTML + sFooterHTML);
});
app.post('/sign-up', (req, res) => {
    UserFile.saveUser(req, res);
});
app.get('/verification', (req, res) => {
    res.send(sHeaderHTML + sVerificationHTML + sFooterHTML);
});
app.post('/verification',(req, res) => {
    UserFile.verificationUser(req, res);
});


/* *** *** LogIn *** *** */
app.get('/log-in', (req, res) => {
    res.send(sHeaderHTML + sFrontBackgroundHTML + sLogInHTML + sFooterHTML);
});
app.post('/log-in', passport.authenticate('local',{
    successRedirect:'/admin-my-profile', failureRedirect:'/log-in'}));


/* *** *** LogOut *** *** */
app.get('/log-out', (req, res) => {
    req.logOut();
    req.session.destroy();
    res.redirect('/');
});


/* *** *** About *** *** */
app.get('/about', (req, res) => {
    if(req.isAuthenticated()){
        res.send(sAdminHeaderHTML + sAboutHTML + sFooterHTML);
    }
    else{
        res.send(sHeaderHTML + sAboutHTML + sFooterHTML);
    }
});


/* *** *** Creatives *** *** */
app.get('/creatives', (req, res) => {
    if(req.isAuthenticated()){
        res.send(sAdminHeaderHTML + sCreativesHTML + sFooterHTML);
    }
    else{
        res.send(sHeaderHTML + sCreativesHTML + sFooterHTML);
    }
});


/* *** *** Pieces *** *** */
app.get('/pieces', (req, res) => {
    if(req.isAuthenticated()){
        res.send(sAdminHeaderHTML + sPiecesHTML + sFooterHTML);
    }
    else{
        res.send(sHeaderHTML + sPiecesHTML + sFooterHTML);
    }
});


/* *** *** SMS *** *** */
app.get('/sms', (req, res) => {
    if(req.isAuthenticated()){
        res.send(sAdminHeaderHTML + sFrontBackgroundHTML + sSmsHTML + sFooterHTML);
    }
    else{
        res.send(sHeaderHTML + sFrontBackgroundHTML + sSmsHTML + sFooterHTML);
    }
});
/* Send SMS To User */
app.post('/sms', (req, res) => {
    sendSmsFile.sendSmsData(req, res);
});


/* *** *** Newsletter *** *** */
// app.post('/newsletter', (req, res) => {
// });




/* *** ADMIN *** ADMIN *** ADMIN *** ADMIN *** ADMIN *** ADMIN *** ADMIN *** ADMIN *** ADMIN *** */
/* *** *** Get My Profile *** *** */
app.get('/admin-my-profile', authenticationMiddleware(), (req, res) => { 
    UserFile.getLoggedInUserInfo(req, res, function (err, datafromDB) {
        if (err) {
          someerrorjson = { some: 'error'}
          return res.send({someerrorjson})
        }
        sMyProfileHTML = sMyProfileHTML.replace('{{userID}}', datafromDB[0].idusers);
        sMyProfileHTML = sMyProfileHTML.replace('{{userFirstName}}', datafromDB[0].firstname);
        sMyProfileHTML = sMyProfileHTML.replace('{{userLastName}}', datafromDB[0].lastname);
        sMyProfileHTML = sMyProfileHTML.replace('{{userProfession}}', datafromDB[0].profession);
        sMyProfileHTML = sMyProfileHTML.replace('{{userDescription}}', datafromDB[0].description);
        sMyProfileHTML = sMyProfileHTML.replace('{{userProfileImage}}', datafromDB[0].profile_image);
        sMyProfileHTML = sMyProfileHTML.replace('{{userFacebook}}', datafromDB[0].facebook_url);
        sMyProfileHTML = sMyProfileHTML.replace('{{userInstagram}}', datafromDB[0].instagram_url);
        sMyProfileHTML = sMyProfileHTML.replace('{{ userTwitter}}', datafromDB[0].twitter_url);
        sMyProfileHTML = sMyProfileHTML.replace('{{userMail}}', datafromDB[0].email);
        sMyProfileHTML = sMyProfileHTML.replace('{{userMail2}}', datafromDB[0].email);
        sMyProfileHTML = sMyProfileHTML.replace('{{userPhone}}', datafromDB[0].phone_number);
        sMyProfileHTML = sMyProfileHTML.replace('{{userPhone2}}', datafromDB[0].phone_number);
    
        return res.send(sAdminHeaderHTML + sMyProfileHTML + sFooterHTML);
    });
});

/* *** *** Get Profile Info in Form: *** *** */
app.get('/admin-edit-profile', authenticationMiddleware(), (req, res) => {
    UserFile.getLoggedInUserForInput(req, res, function (err, datafromDB) {
        if (err) {
          someerrorjson = { some: 'error'}
          return res.send({someerrorjson})
        }
        sEditProfileHTML = sEditProfileHTML.replace('{{getUserFirstName}}', datafromDB[0].firstname);
        sEditProfileHTML = sEditProfileHTML.replace('{{getUserLastrName}}', datafromDB[0].lastname);
        sEditProfileHTML = sEditProfileHTML.replace('{{getUseremail}}', datafromDB[0].email);
        sEditProfileHTML = sEditProfileHTML.replace('{{getUsernumber}}', datafromDB[0].phone_number);
        
        res.send(sAdminHeaderHTML + sEditProfileHTML + sFooterHTML);
    }); 
});


/* *** *** Edit Profile *** *** */
app.post('/admin-edit-profile',(req, res) => {
    UserFile.editUser(req, res);
});


////////////////////////////////////// CHECK BEFORE EXAM - TO PUT IN PIECES.js //////////////////////////////////////
/* *** *** My Pieces *** *** */
app.get('/admin-my-pieces', authenticationMiddleware(), (req, res) => {
    // PiecesFile.getPieces(req, res);
    var stmt = 'SELECT * FROM pieces';
    try{
        db.query(stmt, (err, ajData)=>{
            if(err){
                return res.send('Error - adding piece: ', err);
            }
            var pieceList = '';
            var status ='';
            for(i = 0; i < ajData.length; i++) {
                if(ajData[i].status_idstatus == 1){
                    status = 'pending';
                }
                else if(ajData[i].status_idstatus == 2){
                    status = 'approved';
                }
                else {
                    status = 'denied';
                }
                pieceList += '<tr>\
                                    <td>\
                                        <div class="piece-thumbnail">\
                                            <img src="/images/pieces/abstract.png">\
                                        </div>\
                                    </td>\
                                    <td>\
                                        <p>'+ajData[i].title+'</p>\
                                    </td>\
                                    <td>\
                                        <p>'+ajData[i].description+'</p>\
                                    </td>\
                                    <td>\
                                        <p>'+ajData[i].material+'</p>\
                                    </td>\
                                    <td>\
                                        <p>'+ajData[i].size+'</p>\
                                    </td>\
                                    <td>\
                                        <p>'+ajData[i].price+'</p>\
                                    </td>\
                                    <td>\
                                        <div class="pieces-status">\
                                            <p>'+status+'</p>\
                                            <div class="status '+status+'"></div>\
                                        </div>\
                                    </td>\
                                    <td>\
                                        <a class="btnNone" href="/admin-delete-piece/'+ajData[i].idpieces+'">Delete</a>\
                                    </td>\
                                </tr>';
            }   
            sMyPiecesHTML = sMyPiecesHTML.replace('{{listOfPieces}}', pieceList);
                // console.log(pieceList);
                // res.json(ajData);
            res.send(sAdminHeaderHTML + sMyPiecesHTML + sFooterHTML);
        });
        }catch(err){
            return res.send('We had some problem with adding a piece');
        }  
});


/* *** *** Add Piece *** *** */
app.get('/admin-add-piece', authenticationMiddleware(), (req, res) => {
    res.send(sAdminHeaderHTML + sAddPieceHTML + sFooterHTML);
});
app.post('/add-piece',(req, res) => {
    PiecesFile.savePiece(req, res);
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


////////////////////////////////////// CHECK BEFORE EXAM - TO PUT IN PIECES.js //////////////////////////////////////
/* *** *** Delete Piece *** *** */
app.get('/admin-delete-piece/:pieceID', authenticationMiddleware(), (req, res ) => { 
    // PiecesFile.savePiece(req, res);
    var piedeID = req.params.pieceID;
    console.log(piedeID);
    var stmt = 'DELETE FROM pieces WHERE idpieces = ?';
    try{
        db.query(stmt,[piedeID], (err, ajData)=>{
            if(err){
                return res.send('Error - deleting piece: ', err);
            }
            
            res.redirect('/admin-my-pieces');
        });
    }catch(error){
        return res.send('Error in /admin-edit-profile:', error);
    } 
});


/* *** *** Chat *** *** */
app.get('/admin-chat', authenticationMiddleware(), (req, res) => {
    res.send(sAdminHeaderHTML + sChatHTML + sFooterHTML);
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
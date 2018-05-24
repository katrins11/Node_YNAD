/* *** saltRounds (cost factor). It controls how much time is needed to calculate a single BCrypt hash. 
The higher the cost factor, the more hashing rounds are done. Increasing te cost factor by 1 doubles the necessary time. 
The more time is necessary, the more difficult is brute-forcing. *** */
const saltRounds = 10;

var options = {
    host: "localhost",
    user: "admin",
    password: "password",
    database: "dbynad",
    port: 8889
};
var sessionStore = new MySQLStore(options);

app.use(session({
    secret: secretTokenGenerator(),
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

/* *** 20 CARECTER RANDOM GENERATOR *** */
function secretTokenGenerator() {
    var length = 20,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

jUser = {};

/* *** *** GET USER-LOCATION *** *** */
jUser.getUserLocation = function(req,res){
    var stmt = 'SELECT * FROM location';
    try{
        db.query(stmt, (err, ajData)=>{
            if(err){
                return res.send('ERROR - IN getUserLocation() - users.js -> getting UserLocation: ', error);
            }
            //console.log(ajData);
            res.json(ajData);
        });
    }catch(error){
        return res.send('ERROR - IN getUserLocation() - users.js -> User Location: ', error);
    }
    
}

/* *** GET USER LOGGED IN PROFILE *** */
jUser.getLoggedInUserInfo = function (req, res, fCallback) {
    try{
        var userID = req.session.passport.user;
        db.query('SELECT * FROM users WHERE idusers = ?', [userID], (err, dbData) => { 
            if (err) {
                fCallback(true, dbData)
            }
            fCallback(false, dbData)
        });
    }catch(error){
        return res.send('ERROR - IN getLoggedInUserInfo() - users.js -> getting UserInfo: ', error);
    }  
}

jUser.getLoggedInUserForInput = function (req, res, fCallback) {
    try{
        var userID = req.session.passport.user;
        //console.log("Witch User is logged in/ ID: ", userID);
        db.query('SELECT idusers, firstname, lastname, email, phone_number FROM users WHERE idusers = ?', [userID], (err, dbData) => { 
            if (err) {
                fCallback(true, dbData)
            }
            fCallback(false, dbData)
        });
    }catch(error){
        return res.send('ERROR - IN getLoggedInUserInfo() - users.js -> getting UserInfo: ', error);
    }  
}

/* *** EDIT LOGGED IN USER *** */
jUser.editUser = function(req, res) {
    //console.log("sign up: ", req.body);
    const userID = req.session.passport.user;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var phone_number = req.body.phone_number;

    try{
        //NEED TO THINK ABOUT IF SOME INPUT ARE NOT TUTCHED THEN THEY WILL BE EMPTY!!?? OOOOOORRRR DO I??
        db.query('UPDATE users SET firstname=?, lastname=?, email=?, phone_number=? WHERE idusers=? ', [firstname, lastname, email, phone_number, userID], (error, jData, fields) => {
            if(error) {
                return res.send('ERROR - IN editUser() - users.js -> editing User: ', error);
            }
            if(jData.affectedRows == 1){
                console.log('great, User info has been changed');

                //REDERECT TO HOME OR LOGIN
                res.redirect('/admin-my-profile');
            }
        });
    }catch(error){
        return res.send('ERROR - IN editUser() - users.js -> getting UserInfo: ', error);
    }

    
}

/* *** *** INSERT USER *** *** */
jUser.saveUser = function(req, res) {
    //console.log("sign up: ", req.body);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var profession = req.body.profession;
    var description = req.body.description;
    var email = req.body.email;
    var password = req.body.password;
    var phone_number = req.body.phone_number;
    var instagram_url = req.body.instagram_url;
    var facebook_url = req.body.facebook_url;
    var twitter_url = req.body.twitter_url;
    var profile_image = req.body.profile_image;
    var roles_idroles = '2';
    var location_idlocation = req.body.location;
    var active = false;
    var secretToken = secretTokenGenerator();

    try{
        bcrypt.hash(password, saltRounds, (err, hash) => {
            db.query('INSERT INTO users (firstname, lastname, profession, description, email, password, phone_number, instagram_url, facebook_url, twitter_url, profile_image, roles_idroles, location_idlocation, active, secretToken) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [firstname, lastname, profession, description, email, hash, phone_number, instagram_url, facebook_url, twitter_url, profile_image, roles_idroles, location_idlocation, active, secretToken], (error, jData, fields) => {
                if(error) {
                    throw error;
                }
                if(jData.affectedRows == 1){
                    console.log('great, JSON user inserted');
    
                    /* *** SEND MAIL TO USER MAIL TO VARIFY *** */
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'ynadgallery@gmail.com',
                            pass: 'ynad0040'
                        }
                    });
                    const htmlMail = '<p>Congratulations! You are now registered to YNAD!<br><br> Please verify your email by typing the following token: <br><br><strong>Token:</strong> "'+secretToken+'" <br> On the following page: <a href="http://localhost:1983/verification">http://localhost:1983/verification</a></p>'
                    var mailOptions = {
                        from: 'ynadgallery@gmail.com',
                        to: req.body.email,
                        subject: 'Verification mail for YNAD',
                        text: 'That was easy!',
                        html: htmlMail
                    };
                          
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log('ERROR - user.js - sending mail: ',error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
               
                    /* *** REDERECT TO LOGIN {[WANT TO SEND SOME MESSAGE TELLING THAT YOU WILL GET A MAIL TO VERIFY THE ACCOUNT]} *** */
                    res.redirect('/log-in');
                }
            });
        }); 
    }catch(error){
        return res.send('ERROR - IN saveUser() - users.js -> saving User: ', error);
    }
}

//This is for? 
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

/* *** LOG IN *** */
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username);
        console.log("put in password", password);
        try{
            db.query('SELECT idusers, password, active FROM users WHERE email = ?', [username], (err, results, fields)=>{
                if(err){ 
                    done(err); 
                }
                if(results.length === 0){
                    done(null, false);
                }
                else{
                    //Is ACTIVE user ACTIVE
                    const userActive = results[0].active;
                    console.log("Is User Active: ", userActive);
                    const userID = results[0].idusers;
                    const dbPassword = results[0].password.toString();
                    //console.log('db password:' ,dbPassword);
                    const hash = results[0].password.toString();
                    bcrypt.compare(password, hash, (err, response)=>{
                        console.log(response);
                        /* *** CHECK, Is user active and is he putting in the right password??*** */
                        if(userActive == 1 && hash == dbPassword){
                            return done(null, userID);
                        }
                        else{
                            return done(null, false);
                        }
                    });
                }
            });
        }catch(error){
            return res.send('ERROR - IN passport/logIn - users.js -> LoggedIn: ', error);
        }
        
    }
));

/* *** *** VERIFY USER *** *** */
jUser.verificationUser = function(req,res) {
    const token = req.body.verificationCode;
    try{
        db.query('SELECT * FROM users WHERE secretToken = ?', [token], (err, results, fields)=>{
            if(err){ 
                done(err);
            }
            else{
                db.query('UPDATE users SET active=true WHERE secretToken= ?', [token], (err, results, fields)=>{
                    console.log("user is now active");
                });
            }
        });
        res.redirect('/log-in');
    }catch(error){
        return res.send('ERROR - IN verificationUser() - users.js -> Verification: ', error);
    }
    
}

module.exports = jUser;
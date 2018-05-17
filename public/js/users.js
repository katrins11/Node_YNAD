//WHAT IS saltRounds FOR? 
// It has to do with the hash
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
//RANDOM
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

/* *** *** SELECT ALL USERS *** *** */
// jUser.getUsers = function(req,res) {
//     var stmt = 'SELECT * FROM users';
//     db.query(stmt, (err, ajData)=>{
//         if(err){
//             return res.send('We had some problem getting all the users');
//         }
//         console.log(ajData)
//     });
// } 

/* *** *** GET USERLOCATION *** *** */
jUser.getUserLocation = function(req,res){
    var stmt = 'SELECT * FROM location';
    
    db.query(stmt, (err, ajData)=>{
        if(err){
            return res.send('We had some problem getting userRoles');
        }
        //console.log(ajData);
        res.json(ajData);
    });
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

    bcrypt.hash(password, saltRounds, (err, hash) => {
        //need to put the query in here but then we need to do something like
        // "INSERT INTO users (firstname, ..., hash)..."
        // db.query('INSERT INTO users (firstname, lastname, profession, description, email, password, phone_number, instagram_url, facebook_url, twitter_url, profile_image, roles_idroles, location_idlocation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [firstname, lastname, profession, description, email, hash, phone_number, instagram_url, facebook_url, twitter_url, profile_image, roles_idroles, location_idlocation], (error, jData, fields) => {
        db.query('INSERT INTO users (firstname, lastname, profession, description, email, password, phone_number, instagram_url, facebook_url, twitter_url, profile_image, roles_idroles, location_idlocation, active, secretToken) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [firstname, lastname, profession, description, email, password, phone_number, instagram_url, facebook_url, twitter_url, profile_image, roles_idroles, location_idlocation, active, secretToken], (error, jData, fields) => {      
            if(error) {
                throw error;
            }
            if(jData.affectedRows == 1){
                console.log('great, JSON user inserted');

                //SEND MAIL TO USER MAIL
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
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
           
                //REDERECT TO HOME OR LOGIN
                res.redirect('/log-in');
            }
        });
    }); 
}
//This is for? 
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });
//This is for?   
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

//THIS is for?
passport.use(new LocalStrategy(
    function(username, password, done) {
        //console.log(username);
        //console.log("put in password", password);
        db.query('SELECT idusers, password, active FROM users WHERE email = ?', [username], (err, results, fields)=>{
            if(err){ done(err); }

            if(results.length === 0){
                done(null, false);
            }
            else{
                //Is ACTIVE user ACTIVE
                console.log('db password:' ,results[0].password.toString());
                const dbPassword = results[0].password.toString();
                // const hash = results[0].password.toString();
                // bcrypt.compare(password, hash, (err, response)=>{
                //Hash is not changing the password back so I'm always getting false
                // console.log(response);
                if(password === dbPassword){
                    //console.log("her");
                    console.log('user:',results[0].idusers);
                    return done(null, {user_id: results[0].idusers});
                }
                else{
                    //console.log("vill ekki vera her");
                    return done(null, false);
                }
                // });
            }
        });
    }
));

/* *** *** VERIFY USER *** *** */
jUser.verificationUser = function(req,res) {
    const token = req.body.verificationCode;
    db.query('SELECT * FROM users WHERE secretToken = ?', [token], (err, results, fields)=>{
        if(err){ done(err);}
        else{
            db.query('UPDATE users SET active=true WHERE secretToken= ?', [token], (err, results, fields)=>{
                console.log("user is now active");
            });
        }
    });
    res.redirect('/log-in');
}

//MAKE FUNCTIoN that changes the stadu from false to true of the actvie

module.exports = jUser;


// //SELECT ALL USERS FROM DATABASE
// var stmt = 'SELECT * FROM users';
// db.query(stmt, (err, ajData)=>{ console.log(ajData) });

// //DELETE
// var sName = [7, 'A'];
// var stmt = 'DELETE FROM `users` WHERE iId = ? AND sName = ?';
// // db.query(stmt, sName, (err, jData) => { console.log("jData ", jData); })

// //UPDATE
// var sName = ['KATRIN', 9];
// var stmt = 'UPDATE `users` SET sName = ? WHERE iId = ?';
// // db.query(stmt, sName, (err, jData) => { console.log("jData ", jData); })
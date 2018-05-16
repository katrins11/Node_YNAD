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
    secret: 'dsfk30fdj3lfnq',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

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
    var firstname= req.body.firstname;
    var lastname= req.body.lastname;
    var profession= req.body.profession;
    var description= req.body.description;
    var email= req.body.email;
    var password= req.body.password;
    var phone_number= req.body.phone_number;
    var instagram_url= req.body.instagram_url;
    var facebook_url= req.body.facebook_url;
    var twitter_url= req.body.twitter_url;
    var profile_image= req.body.profile_image;
    var roles_idroles= '2';
    var location_idlocation= req.body.location;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        //need to put the query in here but then we need to do something like
        // "INSERT INTO users (firstname, ..., hash)..."
        // db.query('INSERT INTO users (firstname, lastname, profession, description, email, password, phone_number, instagram_url, facebook_url, twitter_url, profile_image, roles_idroles, location_idlocation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [firstname, lastname, profession, description, email, hash, phone_number, instagram_url, facebook_url, twitter_url, profile_image, roles_idroles, location_idlocation], (error, jData, fields) => {
        db.query('INSERT INTO users (firstname, lastname, profession, description, email, password, phone_number, instagram_url, facebook_url, twitter_url, profile_image, roles_idroles, location_idlocation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [firstname, lastname, profession, description, email, password, phone_number, instagram_url, facebook_url, twitter_url, profile_image, roles_idroles, location_idlocation], (error, jData, fields) => {      
            if(error) {
                throw error;
            }
            if(jData.affectedRows == 1){
                console.log('great, JSON user inserted');
                var selectStmt = 'SELECT LAST_INSERT_ID() as user_id';
                db.query(selectStmt, (error, results, fields) => {
                    if(error) throw error;
                    const user_id = results[0];
                    console.log(user_id);
                    req.login(user_id, (err)=>{
                        res.redirect('/admin-add-piece');
                    });
                });
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
        db.query('SELECT idusers, password FROM users WHERE email = ?', [username], (err, results, fields)=>{
            if(err){ done(err); }

            if(results.length === 0){
                done(null, false);
            }
            else{
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
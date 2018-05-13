var mysql = require('mysql');

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

jUser = {};

/* *** *** SELECT ALL USERS *** *** */
// getUsers = function(req,res) {
//     var stmt = 'SELECT * FROM users';

//     db.query(stmt, (err, ajData)=>{
//         if(err){
//             return res.send('We had some problem getting all the users');
//         }
//         console.log(ajData)
//     });
// } 

/* *** *** INSERT USER *** *** */
jUser.saveUser = function(req, res) {
	var jUserData = {
        'firstname': req.body.user.firstname,
        'lastname': req.body.user.lastname,
        'profession': req.body.user.profession,
        'description': req.body.user.description,
        'email': req.body.user.email,
        'password': req.body.user.password,
        'phone_number': req.body.user.phone_number,
        'instagram_url': req.body.user.instagram_url,
        'facebook_url': req.body.user.facebook_url,
        'twitter_url': req.body.user.twitter_url,
        'profile_image': 'https://www.facebook.com/photo.php?fbid=10156189333629698&set=a.10150098855654698.298997.616564697&type=3&theater',
        'roles_idroles': '2',
        'location_idlocation': '1',
    }
    // console.log(req.body.user.firstname);    
    //console.log(jUserData);

    var stmt = 'INSERT INTO users SET ?';
    db.query(stmt, jUserData, (err, jData) => {
        if(err) {
            return res.send('error');
        }
        if(jData.affectedRows == 1){
            console.log('great, JSON user inserted');
            res.json({success: 'ok'});
        }
    });
}

module.exports = jUser;

// //SELECT ALL USERS FROM DATABASE
// var stmt = 'SELECT * FROM users';
// db.query(stmt, (err, ajData)=>{
//     console.log(ajData)
// });

// //DELETE
// var sName = [7, 'A'];
// var stmt = 'DELETE FROM `users` WHERE iId = ? AND sName = ?';
// // db.query(stmt, sName, (err, jData) => {
// //     console.log("jData ", jData);
// // })

// //UPDATE
// var sName = ['KATRIN', 9];
// var stmt = 'UPDATE `users` SET sName = ? WHERE iId = ?';
// // db.query(stmt, sName, (err, jData) => {
// //     console.log("jData ", jData);
// // })
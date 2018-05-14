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
        console.log(ajData);
        res.json(ajData);
    });
}

/* *** *** INSERT USER *** *** */
jUser.saveUser = function(req, res) {
	var jUserData = {
        'firstname': req.body.firstname,
        'lastname': req.body.lastname,
        'profession': req.body.profession,
        'description': req.body.description,
        'email': req.body.email,
        'password': req.body.password,
        'phone_number': req.body.phone_number,
        'instagram_url': req.body.instagram_url,
        'facebook_url': req.body.facebook_url,
        'twitter_url': req.body.twitter_url,
        'profile_image': 'https://www.facebook.com/photo.php?fbid=10156189333629698&set=a.10150098855654698.298997.616564697&type=3&theater',
        'roles_idroles': '2',
        'location_idlocation': req.body.location,
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
var mysql = require('mysql');

//OUR DATABASE
var db = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    database: "dbynad",
    port: 8889
});

//CONNET TO OUR DATABASE
db.connect(err => {
    if(err){console.log(err), process.exit()}
    console.log('connected');
});


//SELECT ALL USERS FROM DATABASE
var stmt = 'SELECT * FROM users';
db.query(stmt, (err, ajData)=>{
    console.log(ajData)
});

//INSERT USER
var jUserData = {
    'firstname': 'Anne Mai',
    'lastname': 'Særker-Sørensen',
    'profession': 'Web Developer',
    'description': 'Im a web Designer',
    'email': 'annemai@gmail.com',
    'password': '123',
    'profile_image': 'https://www.facebook.com/photo.php?fbid=10156189333629698&set=a.10150098855654698.298997.616564697&type=3&theater',
    'phone_number': '50505050',
    'instagram_url': 'https://www.instagram.com/annesaerker/',
    'facebook_url': 'https://www.facebook.com/annesaerker',
    'roles_idroles': '2',
    'location_idlocation': '1',
}
var stmt = 'INSERT INTO users SET ?';
// db.query(stmt, jUserData, (err, jData) => {
//     if(jData.affectedRows == 1){
//         console.log('great, JSON user inserted');
//     }
// });

//DELETE
var sName = [7, 'A'];
var stmt = 'DELETE FROM `users` WHERE iId = ? AND sName = ?';
// db.query(stmt, sName, (err, jData) => {
//     console.log("jData ", jData);
// })

//UPDATE
var sName = ['KATRIN', 9];
var stmt = 'UPDATE `users` SET sName = ? WHERE iId = ?';
// db.query(stmt, sName, (err, jData) => {
//     console.log("jData ", jData);
// })
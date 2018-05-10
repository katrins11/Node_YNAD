var mysql = require('mysql');
var express = require('express');
var app = express();
var formidable = require('express-formidable');
var bodyParser = require('body-parser');
// var fs = require('fs');
global.gFs = require('fs');
app.use(express.static(__dirname + '/public'));


app.use(formidable());

const sHeaderHTML = gFs.readFileSync( __dirname + '/html/header.html', 'utf8');
const sFooterHTML = gFs.readFileSync( __dirname + '/html/footer.html', 'utf8');
const chatFile = require(__dirname + '/chat.js');
chatFile.getChat();


app.get('/', (req, res) => {
    var sHomeHTML = gFs.readFileSync( __dirname + '/html/home.html', 'utf8');
    
    res.send(sHeaderHTML + sHomeHTML + sFooterHTML);
});


app.get('/chat', (req, res) => {
    var sChatHTML = gFs.readFileSync( __dirname + '/html/chat.html', 'utf8');
    res.send(sHeaderHTML + sChatHTML + sFooterHTML);
});

//LISTENING TO PORT
var port = 1983;
app.listen(port, err => {
    if(err) {
        console.log("error");
        return;
    }
    console.log("server is running on port 1983");
})
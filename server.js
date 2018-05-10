var mysql = require('mysql');
var express = require('express');
var app = express();
var formidable = require('express-formidable');
var bodyParser = require('body-parser');
var io = require('socket.io')(5000);
global.gFs = require('fs');
app.use(express.static(__dirname + '/public'));

app.use(formidable());

app.get('/', (req, res) => {
    var sHeaderHTML = gFs.readFileSync( __dirname + '/html/header.html', 'utf8');
    var sIndexHTML = gFs.readFileSync( __dirname + '/html/home.html', 'utf8');
    var sFooterHTML = gFs.readFileSync( __dirname + '/html/footer.html', 'utf8');

    res.send(sHeaderHTML + sIndexHTML + sFooterHTML);
});
app.get('/chat', (req, res) => {
    var sHeaderHTML = gFs.readFileSync( __dirname + '/html/header.html', 'utf8');
    var sIndexHTML = gFs.readFileSync( __dirname + '/html/chat.html', 'utf8');
    var sFooterHTML = gFs.readFileSync( __dirname + '/html/footer.html', 'utf8');

    res.send(sHeaderHTML + sIndexHTML + sFooterHTML);
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
jPieces = {};

jPieces.getPieceMedia = function(req,res){
    var stmt = 'SELECT * FROM media';
    
    db.query(stmt, (err, ajData)=>{
        if(err){
            return res.send('We had some problem getting media');
        }
        //console.log(ajData);
        res.json(ajData);
    });
}
jPieces.getPieceDate = function(req,res){
    var stmt = 'SELECT * FROM year';
    
    db.query(stmt, (err, ajData)=>{
        if(err){
            return res.send('We had some problem getting date for pieces');
        }
        //console.log(ajData);
        res.json(ajData);
    });
}

jPieces.savePiece = function(req, res) {
    //console.log("insert Piece: ", req.body);
    var title = req.body.title;
    var material = req.body.material;
    var description = req.body.description;
    var size = req.body.size;
    var price = req.body.price;
    var status_idstatus = '1';
    var year_idyear = req.body.dateCreated;
    var piece_image = req.body.price;
    var users_idusers = '1';
    var media_idmedia = req.body.pieceMedia;

    db.query('INSERT INTO pieces (title, material, description, size, price, status_idstatus, year_idyear, piece_image, users_idusers, media_idmedia) VALUES (?,?,?,?,?,?,?,?,?,?)', [title, material, description, size, price, status_idstatus, year_idyear, piece_image, users_idusers, media_idmedia], (error, jData, fields) => {              
        if(error) {
            return res.send('We had some problem with adding a piece');
        }
        if(jData.affectedRows == 1){
            console.log('great, JSON piece inserted');
            //res.json({success: 'ok'});
            res.redirect('/admin-my-pieces');
        }
    });
}

module.exports = jPieces;
jPieces = {};

/* *** *** GET MEDIA TYPES *** *** */
jPieces.getPieceMedia = function(req,res){
    var stmt = 'SELECT * FROM media';
    try{
        db.query(stmt, (err, ajData)=>{
            if(err){
                return res.send('ERROR - IN getPieceMedia() - pieces.js -> getting media: ', error);
            }
            //console.log(ajData);
            res.json(ajData);
        });
    }catch(error){
        return res.send('ERROR - IN verificationUser() -> pieces.js: ', error);
    }
}

/* *** *** GET YEAR LIST *** *** */
jPieces.getPieceDate = function(req,res){
    var stmt = 'SELECT * FROM year';
    try{
        db.query(stmt, (err, ajData)=>{
            if(err){
                return res.send('ERROR - IN getPieceDate() - pieces.js -> getting date for pieces: ', error);
            }
            //console.log(ajData);
            res.json(ajData);
        });
    }catch(error){
        return res.send('ERROR - IN getPieceDate() -> pieces.js: ', error);
    }
    
}

/* *** *** SAVE PIECE *** *** */
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

    try{
        db.query('INSERT INTO pieces (title, material, description, size, price, status_idstatus, year_idyear, piece_image, users_idusers, media_idmedia) VALUES (?,?,?,?,?,?,?,?,?,?)', [title, material, description, size, price, status_idstatus, year_idyear, piece_image, users_idusers, media_idmedia], (error, jData, fields) => { 
            if(error) {
                return res.send('ERROR - IN savePiece() -> adding piece: ', error);
            }
            if(jData.affectedRows == 1){
                console.log('great, Your piece has now been added!');
                //res.json({success: 'ok'});
                res.redirect('/admin-my-pieces');
            }
        });
    }catch(error){
        return res.send('ERROR - IN savePiece() - pieces.js: ', error);
    }    
}

jPieces.deletePiece = function(req, res){
    var piedeID = req.params.pieceID;
    console.log(piedeID);
    var stmt = 'DELETE FROM pieces WHERE idpieces = ?';
    try{
        db.query(stmt, [piedeID], (err, ajData)=>{
            if(err){
                return res.send('Error - deleting piece: ', err);
            }
        });
    }catch(error){
        return res.send('Error in /admin-edit-profile:', error);
    } 
}

module.exports = jPieces;
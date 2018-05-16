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
    console.log(req.body);
	var jPieceData = {
        'title': req.body.title,
        'material': req.body.material,
        'description': req.body.description,
        'size': req.body.size,
        'price': req.body.price,
        'status_idstatus': '1',
        'year_idyear': req.body.dateCreated,
        'piece_image': req.body.price,
        'users_idusers': '1',
        'media_idmedia': req.body.pieceMedia,
    }
    // console.log(req.body.user.firstname);    
    //console.log('info: ',jPieceData);

    var stmt = 'INSERT INTO pieces SET ?';
    db.query(stmt, jPieceData, (err, jData) => {
        if(err) {
            return res.send('error');
        }
        if(jData.affectedRows == 1){
            console.log('great, JSON user inserted');
            res.json({success: 'ok'});
        }
    });
}

module.exports = jPieces;
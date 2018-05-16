var request = require('request');

var smsData = {};

smsData.sendSmsData = function(req, res) {
    
    var sMobile = req.body.mobile
    var sMessage = req.body.message
    var apiToken = '$2y$10$H.KvGdTTPrMYwuThvdkSP.v3rAcGU5sCuBui1eHaCdLIZV2Cmi.Sm';
    // console.log(sMobile)

    request.post({url:'http://smses.io/api-send-sms', 
        form: { 
            apiToken: apiToken, 
            mobile: sMobile, 
            message: sMessage 
        }
    }); 
    res.redirect('/sms');
    // function(err, httpResponse, body){ 
    //     console.log(body);   
    // });
}

module.exports = smsData;
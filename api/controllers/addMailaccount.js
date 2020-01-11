/* This file can be reached by calling swagger API endpoint. Pass mail password and local part */

    var URL = "https://kasapi.kasserver.com/soap/wsdl/KasAuth.wsdl";
    var secrets = require('../../secrets');
    var soap = require('soap');
   
    module.exports = {
        addMailaccount: addMailaccount
    };
   
    function addMailaccount(req, res) {
        var params = {
            KasUser: secrets.kasUserName,
            KasAuthType: "sha1",
            KasPassword: secrets.kasPassword,
            mail_password: req.mailPassword,
            local_part: req.localPart,
            domain_part: "cct-ev.de",
            responder: "N",
        };

    soap.createClient(URL, function(err, client) {
      client.KasApi(params, function(err, result) {
          console.log(result);
        });
    });
}
   












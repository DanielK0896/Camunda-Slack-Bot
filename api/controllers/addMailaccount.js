/* This file can be reached by calling swagger API endpoint. Pass mail password and local part */

    var URL = "https://kasapi.kasserver.com/soap/wsdl/KasApi.wsdl";
    var secrets = require('../../secrets');
    var soap = require('soap');
   
    module.exports = {
        addMailaccount: addMailaccount
    };
   
    function addMailaccount(req, res) {
        var params = {
            kas_login: secrets.kasUserName,
            kas_auth_type: "session",
            kas_auth_data: "1262ce9cf164df754f3d0a5a6f35be6b",
            kas_action: "add_mailaccount",
            mail_password: "Test1",
            local_part: "test.testQMWORKEND",
            domain_part: "cct-ev.de",
            responder: "N"
        };

    soap.createClient(URL, function(err, client) {
      client.KasApi(params, function(err, result) {
          console.log(result);
        });
    });
}
   












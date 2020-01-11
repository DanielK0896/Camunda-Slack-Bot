/* This file can be reached by calling swagger API endpoint. Pass mail password and local part */

var URL = "https://kasapi.kasserver.com/soap/wsdl/KasApi.wsdl";
var secrets = require('../../secrets');
var soap = require('soap');

module.exports = {
    mailAuth: mailAuth
};

function mailAuth(req, res) {
    var params = {
        kas_login: secrets.kasUserName,
        kas_auth_type: "sha1",
        kas_auth_data: secrets.kasPassword,
        kas_action: "add_session",
        session_lifetime: "500",
        session_update_lifetime: "Y"
    };

soap.createClient(URL, function(err, client) {
  client.KasApi(params, function(err, result) {
      console.log(result);
    });
});
}













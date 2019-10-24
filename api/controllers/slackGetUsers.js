/* This file can be reached by calling swagger API endpoint. 
 * slackGetChannels: Get all Users */

var request = require('request');
var URL = "https://slack.com/api/users.list";
var secrets = require('../../secrets');

module.exports = {
    slackGetUsers: slackGetUsers
};

function slackGetUsers(req, res) {
    var options = {
       method: 'GET',
       url: URL,
       headers:
       {
           'cache-control': 'no-cache',
           Authorization: secrets.Authorization,
           'Content-Type': 'application/x-www-form-urlencoded'
       },
       form: { undefined: undefined }
   };

   request(options, function (error, response, body) {
       if (error) throw new Error(error);
       res.send(body);
   });

}
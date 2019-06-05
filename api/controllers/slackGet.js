/* This file can be reached by calling swagger API endpoint. 
 * slackGetChannels: Get all Channels */

var request = require('request');
var URL = "https://slack.com/api/conversations.list";
var secrets = require('../../secrets');

module.exports = {
    slackGetConversations: slackGetConversations
};

function slackGetConversations(req, res) {
    var options = {
        method: 'GET',
        url: URL,
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded',
             Authorization: secrets.Authorization,
            'cache-control': 'no-cache'          
        }
    };
    console.log(options);
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        res.json(body);
    });
}



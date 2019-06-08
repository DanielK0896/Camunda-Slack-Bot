/* Pass channel and user to invite the user*/


var request = require('request');
var URL = "https://slack.com/api/conversations.invite";
var secrets = require('../../secrets');

module.exports = {
    channelInvite: channelInvite
};

function channelInvite(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "user": msg.user
    };
    var options = {
        method: 'POST',
        url: URL,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: secrets.Authorization,
            'Content-Type': 'application/json'
        },
        body: body,
        json: true
    };

    request(options, function (error, response, body) {
        if (!error) {
            var bodyStringified = JSON.stringify(body);
            res.json(bodyStringified);
            console.log(JSON.parse(bodyStringified))
        } else { console.log("ERROR channelInvite: " + error); }
    });
}



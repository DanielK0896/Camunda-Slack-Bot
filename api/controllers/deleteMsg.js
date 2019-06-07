/* Pass channel and ts and delete specific message in Slack*/


var request = require('request');
var URL = "https://slack.com/api/chat.delete";
var secrets = require('../../secrets');

module.exports = {
    deleteMsg: deleteMsg
};

function deleteMsg(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "ts": msg.ts,
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
        } else { console.log("ERROR deleteMsg: " + error); }
    });
}



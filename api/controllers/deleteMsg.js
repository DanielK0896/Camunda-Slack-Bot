/* Pass channel and ts and delete specific message in Slack*/


var request = require('request');
var URL = "https://slack.com/api/chat.delete";
var secrets = require('../../secrets');
var headers = {'Authorization': secrets.Authorization, 'Content-Type': 'application/json'};

module.exports = {
    deleteMsg: deleteMsg
};

function deleteMsg(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "ts": msg.ts,
    };
    request({
        method: 'POST', url: URL, headers: headers, body: body, json: true, function(error, response, body) {
            if (error) throw new Error(error);
            res.json(body);
        }
    });
}



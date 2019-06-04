/* Pass channel and scheduledMessageId and delete specific scheduled message in Slack*/

var request = require('request');
var URL = "https://slack.com/api/chat.deleteScheduledMessage";
var secrets = require('../../secrets');
var headers = { 'cache-control': 'no-cache', 'Authorization': secrets.Authorization, 'Content-Type': 'application/json'};

module.exports = {
    deleteMsgScheduled: deleteMsgScheduled
};

function deleteMsgScheduled(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "scheduledMessageId": msg.scheduledMessageId,
    };
    request({
        method: 'POST', url: URL, headers: headers, body: body, json: true, function(error, response, body) {
            if (error) throw new Error(error);
            res.json(body);
        }
    });
}



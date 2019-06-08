/* Pass channel and scheduledMessageId and delete specific scheduled message in Slack*/

var request = require('request');
var URL = "https://slack.com/api/chat.deleteScheduledMessage";
var secrets = require('../../secrets');

module.exports = {
    chatScheduledDelete: chatScheduledDelete
};

function chatScheduledDelete(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "scheduledMessageId": msg.scheduledMessageId,
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
        } else { console.log("ERROR deleteMsgScheduled: " + error); }
    });
}



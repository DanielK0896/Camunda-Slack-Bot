var util = require('util');
var request = require('request');
var URL = "https://slack.com/api/chat.deleteScheduledMessage";
var secrets = require('../../secrets');
var headers = {'Authorization': secrets.Authorization, 'Content-Type': 'application/json'};



module.exports = {
    deleteMsgScheduled: deleteMsgScheduled
};


function deleteMsgScheduled(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "scheduledMessageId": msg.scheduledMessageId,
    };
    request.post({headers: headers, url:URL, body: body, json:true});
    res.status(200).type('application/json').end();
}



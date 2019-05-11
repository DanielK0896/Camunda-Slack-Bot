var util = require('util');
var request = require('request');
var URL = "https://slack.com/api/chat.getPermalink";
var secrets = require('../../secrets');
var headers = {'Authorization': secrets.Authorization, 'Content-Type': 'application/json'};



module.exports = {
  getPermalink: getPermalink
};


function getPermalink(req, res) {
    var msg = req.swagger.params.body.value;

    var channel = msg.channel;
    var messageTs = msg.messageTs;
    var body = {
        "channel": channel,
        "messageTs": messageTs,
    };

    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}



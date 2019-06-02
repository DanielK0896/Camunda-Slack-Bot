/* Pass channel and messageTs and get a permalink for a specific message in Slack*/

var request = require('request');
var URL = "https://slack.com/api/chat.getPermalink";
var secrets = require('../../secrets');
var headers = {'Authorization': secrets.Authorization, 'Content-Type': 'application/json'};

module.exports = {
  getPermalink: getPermalink
};

function getPermalink(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": channmsg.channelel,
        "messageTs": msg.messageTs,
    };

    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}



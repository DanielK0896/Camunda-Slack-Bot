/* Pass channel and messageTs and get a permalink for a specific message in Slack*/

var request = require('request');
var URL = "https://slack.com/api/chat.getPermalink";
var secrets = require('../../secrets');

module.exports = {
  getPermalink: getPermalink
};

function getPermalink(req, res) {
    var msg = req.swagger.params.body.value;
    var options = {
        method: 'GET',
        url: URL,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: secrets.Authorization,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            "channel": msg.channel,
            "messageTs": msg.ts
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.json(body);
    });
}


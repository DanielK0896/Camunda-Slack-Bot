/* Updates existing message with overflow menus*/

var request = require('request');
var URL = "https://slack.com/api/chat.update";
var secrets = require('../../secrets');

module.exports = {
    chatUpdateBlock: chatUpdateBlock
};

function chatUpdateBlock(req, res) {

    var msg = req.swagger.params.body.value;
    var blocks = JSON.parse(msg.blocks);
    var body = {
        "channel": msg.channel,
        "ts": msg.ts,
        "blocks": blocks
        
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
        } else { console.log("ERROR updateOverflow: " + error); }
    });
}


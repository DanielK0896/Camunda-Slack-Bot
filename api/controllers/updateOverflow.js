/* Updates existing message with overflow menus*/

var request = require('request');
var URL = "https://slack.com/api/chat.update";
var secrets = require('../../secrets');
var headers = { 'cache-control': 'no-cache', 'Authorization': secrets.Authorization, 'Content-Type': 'application/json' };

module.exports = {
    updateOverflow: updateOverflow
};

function updateOverflow(req, res) {

    var msg = req.swagger.params.body.value;
    var blocks = JSON.parse(msg.blocks);
    var body = {
        "channel": msg.channel,
        "ts": msg.ts,
        "blocks": blocks
        
    };
    console.log(JSON.stringify(body));
    request({
        method: 'POST', url: URL, headers: headers, body: body, json: true, function(error, response, body) {
            if (error) throw new Error(error);
            res.json(body);
        }
    });
}


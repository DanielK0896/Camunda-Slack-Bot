/* Updates existing message with overflow menus*/

var request = require('request');
var URL = "https://slack.com/api/chat.update";
var secrets = require('../../secrets');
var headers = { 'Authorization': secrets.Authorization, 'Content-Type': 'application/json' };

module.exports = {
    updateOverflow: updateOverflow
};

function updateOverflow(req, res) {

    var msg = req.swagger.params.body.value;
    console.log(msg);
    console.log(msg.blocks);
    var body = {
        "channel": msg.channel,
        "ts": msg.ts,
        "blocks": JSON.parse(msg.blocks)
    };
    console.log(JSON.stringify(body));
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}


var request = require('request');
var URL = "https://slack.com/api/chat.update";
var secrets = require('../../secrets');
var headers = { 'Authorization': secrets.Authorization, 'Content-Type': 'application/json' };
var numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixten", "seventeen", "eighteen", "nineteen", "twenty"];


module.exports = {
    updateOverflow: updateOverflow
};

function updateOverflow(req, res) {

    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "ts": msg.ts,
        "blocks": ""
    };
    body.blocks = JSON.parse(msg.blocks);
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}


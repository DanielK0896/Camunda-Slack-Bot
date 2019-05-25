
var request = require('request');
var URL = "https://slack.com/api/chat.postMessage";
var secrets = require('../../secrets');
var headers = { 'Authorization': secrets.Authorization, 'Content-Type': 'application/json' };

module.exports = {
    sendOverflowStatic: sendOverflowStatic
};

function sendOverflowStatic(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": msg.boldHeadline
                }
            }
        ]
    };
    var i;
    for (i = 0; i < msg.headlineLeftField.length; i++) {
        body.blocks.push({
            "type": "divider"
            },
            {
                "type": "section",
                "block_id": msg.headlineLeftField[i],
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField[i]
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField[i]
                    }],
                "accessory": {
                    "type": "overflow",
                    "options": [
                    ]
                }
            });
    }

    for (var t = 2; t <= i*2; t = t + 2) { 
        for (var s = 0; s < msg.textOptions.length; s++) {
            body.block[t].accessory.options.push({
                "text": {
                    "type": "plain_text",
                    "text": msg.textOption[i],
                    "emoji": true
                },
                "value": "value-0"
            };
        }
    }
}

body.blocks.push({
    "type": "actions",
    "elements": [
        {
            "type": "button",
            "text": {
                "type": "plain_text",
                "emoji": true,
                "text": msg.buttonName
            },
            "value": msg.buttonValue
        }
    ]
});


    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}


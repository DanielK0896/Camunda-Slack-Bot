
var request = require('request');
var URL = "https://slack.com/api/chat.postMessage";
var secrets = require('../../secrets');
var headers = { 'Authorization': secrets.Authorization, 'Content-Type': 'application/json' };

module.exports = {
    sendOverflowStatic: sendOverflowStatic,
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
                "block_id": msg.message + " " + msg.changes,
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
                    "action_id": msg.listOfUsers[i],
                    "options": [
                    ]
                }
            });
    }

    for (var t = 2; t <= i*2; t = t + 2) { 
        for (var s = 0; s < msg.textOptions.length; s++) {
            body.blocks[t].accessory.options.push({
                "text": {
                    "type": "plain_text",
                    "text": msg.textOptions[s],
                    "emoji": true
                },
                "value": s
            });
        }
    }

    body.blocks.push({
        "type": "divider"
    },
    {
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
    console.log(body);
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}


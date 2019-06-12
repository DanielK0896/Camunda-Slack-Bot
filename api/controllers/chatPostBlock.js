/* This file can be reached by calling swagger API endpoint. Pass as many Overflow Menus as you want to (with a left and right field next to it)
 * be added to the message*/

var request = require('request');
var URL = "https://slack.com/api/chat.postMessage";
var secrets = require('../../secrets');
const CAMUNDA_CONFIG = require('./camundaConfig');

module.exports = {
    chatPostBlock: chatPostBlock
};

function chatPostBlock(req, res) {
    var msg = req.swagger.params.body.value;
    console.log("Message arrived");
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
        var objectToPush = {
            "type": "divider"
        };
        var objectToPush2 = {
            "type": "section",
            "block_id": msg.message + CAMUNDA_CONFIG.taskIdSplit + i,
            "accessory": {
                "type": msg.type[i],
                "action_id": msg.actionId[i] + CAMUNDA_CONFIG.actionIdSplit + msg.changes
            }
        };   
        if (msg.type[i] == "overflow") {
            objectToPush2.accessory.options = [];
            objectToPush2.fields = [
                {
                    "type": "mrkdwn",
                    "text": msg.headlineLeftField[i]
                }, {
                    "type": "mrkdwn",
                    "text": msg.headlineRightField[i]
                }];
            for (var t = 2; t <= i * 2; t = t + 2) {
                for (var s = 0; s < msg.textOptions.length; s++) {
                    body.blocks[t].accessory.options.push({
                        "text": {
                            "type": "plain_text",
                            "text": msg.textOptions[s],
                            "emoji": true
                        },
                        "value": s.toString()
                    });
                }
            }
        } else {
            objectToPush2.text = {
                "type": "mrkdwn",
                "text": msg.headlineLeftField[i]
            };
            if (msg.type[i] == "button") {
                objectToPush2.accessory.text = {
                    "type": "plain_text",
                    "text": "Klick",
                    "emoji": true
                };
                objectToPush2.accessory.value = "0";
            } 
        }   
        body.blocks.push(objectToPush);
        body.blocks.push(objectToPush2);
    }
    body.blocks.push({
        "type": "divider"
    },
    {
        "type": "actions",
        "block_id": msg.buttonMessage,
        "elements": [
            {
                "type": "button",          
                "action_id": msg.buttonActionId,
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": msg.buttonName
                },
                "value": msg.buttonValue
            }
        ]
        }); 
    console.log(JSON.stringify(body));
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
            console.log(JSON.parse(bodyStringified));
        } else {
            console.log("responseBody chatPostBlock: " + body);
        }
    });
}


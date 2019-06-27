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
    for (i = 0; i < msg.leftField.length; i++) {
        var objectToPush = {
            "type": "divider"
        };
        var objectToPush2 = {
            "type": "section",
            "block_id": msg.message[i] + CAMUNDA_CONFIG.taskIdSplit + i,
            "accessory": {
                "type": msg.type[i],
                "action_id": msg.actionId[i] + CAMUNDA_CONFIG.actionIdOuterSplit + msg.changes
            }
        };
        if (msg.type[i] == "overflow" || msg.type[i] == "static_select") {
            objectToPush2.accessory.options = [];
                var textOptionsArray = msg.textOptions[i].split(CAMUNDA_CONFIG.textOptionsInnerSplit)
            for (var s = 0; s < textOptionsArray.length; s++) {
                objectToPush2.accessory.options.push({
                    "text": {
                        "type": "plain_text",
                        "text": textOptionsArray[s],
                        "emoji": true
                    },
                    "value": s.toString()
                });
            }
        } else if (msg.type[i] == "button") {
            objectToPush2.accessory.text = {
                "type": "plain_text",
                "text": "Klick",
                "emoji": true
            };
            objectToPush2.accessory.value = "0";
        }
        if (msg.confirm[i] == "true") {
            objectToPush2.accessory.confirm = {
                "title": {
                    "type": "plain_text",
                    "text": "Bestaetigung"
                },
                "text": {
                    "type": "mrkdwn",
                    "text": "Bist du dir sicher?"
                },
                "confirm": {
                    "type": "plain_text",
                    "text": "Ja"
                },
                "deny": {
                    "type": "plain_text",
                    "text": "Nein"
                }
            };
        }
        if (msg.rightField[i] == "") {
            objectToPush2.text = {
                "type": "mrkdwn",
                "text": msg.leftField[i]
            };
        } else {
            objectToPush2.fields = [
                {
                    "type": "mrkdwn",
                    "text": msg.leftField[i]
                }, {
                    "type": "mrkdwn",
                    "text": msg.rightField[i]
                }];
        }
        body.blocks.push(objectToPush);
        body.blocks.push(objectToPush2);
    }
    body.blocks.push({
        "type": "divider"
    });
    objectToPush3 = {
        "type": "actions",
        "block_id": msg.buttonMessage,
        "elements": []
    };
    for (var i = 0; i < msg.buttonName.length; i++) {
        if (i == msg.buttonName.length - 1) {
            objectToPush3.elements.push({
                "type": "button",
                "action_id": msg.buttonActionId + CAMUNDA_CONFIG.actionIdOuterSplit + "-1" + CAMUNDA_CONFIG.changesOuterSplit,
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": msg.buttonName[i]
                },
                "value": msg.buttonValue
            });
        } else {
            objectToPush3.elements.push({
                "type": "button",
                "action_id": msg.buttonName[i] + CAMUNDA_CONFIG.actionIdOuterSplit + "-1" + CAMUNDA_CONFIG.changesOuterSplit,
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": msg.buttonName[i]
                },
                "value": i.toString()
            });
        }
    }
    body.blocks.push(objectToPush3);

    console.log(JSON.stringify(body));
    var options = {
        method: 'POST',
        url: URL,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: secrets.Authorization,
            'Content-Type': 'application/json; charset=utf-8'
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


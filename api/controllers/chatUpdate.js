/* This file can be reached by calling swagger API endpoint. Pass as many textButtons and textConfirmations as you want to
 * be added to the message*/

var request = require('request');
var URL = "https://slack.com/api/chat.update";
var secrets = require('../../secrets');

module.exports = {
    chatUpdate: chatUpdate
};

function chatUpdate(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "text": msg.text,
        "ts": msg.ts
    };
    if (typeof msg.callbackId != "undefined") {
        body.attachments = [
            {
                "fallback": "Two Buttons with Confirmation",
                "callback_id": msg.callbackId,
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                ]
            }
        ];
        for (var i = 0; i < msg.textButtons.length; i++) {
            var action = "Action" + i
            body.attachments[0].actions.push({
                "name": action,
                "text": msg.textButtons[i],
                "style": msg.style[i],
                "type": "button",
                "value": i.toString()
            });
        }
    } else {
        body.attachments = [];
    }
    if (typeof msg.textConfirmation != "undefined") {
        for (var i = 0; i < msg.textConfirmation.length; i++) {
            if (msg.textConfirmation[i] != "") {
                body.attachments[0].actions[i].confirm = {
                    "title": "Bestätigen",
                    "text": msg.textConfirmation[i],
                    "dismiss_text": "Abbrechen",
                    "ok_text": "Ja"
                };
            }
        }
    }
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
            console.log(JSON.parse(bodyStringified))
        } else { console.log("ERROR getPermalink: " + error) }
    });
}


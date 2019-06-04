/* This file can be reached by calling swagger API endpoint. Pass as many textButtons and textConfirmations as you want to
 * be added to the message*/

var request = require('request');
var URL = "https://slack.com/api/chat.update";
var secrets = require('../../secrets');
var headers = { 'Authorization': secrets.Authorization, 'Content-Type': 'application/json' };

module.exports = {
    updateMsg: updateMsg,
    updateMsgButton: updateMsgButton,
};

function updateMsg(req, res) {

    var body = {
        "channel": msg.channel,
        "text": msg.text,
        "ts": msg.ts,
        "attachments": []
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}

function updateMsgButton(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "text": msg.text,
        "ts": msg.ts,
        "attachments": [
            {
                "fallback": "Two Buttons with Confirmation",
                "callback_id": msg.callbackId,
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                ]
            }
        ]
    };
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

    console.log(body.attachments[0].actions);
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}


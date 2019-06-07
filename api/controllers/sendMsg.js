var request = require('request');
var URL = 'https://slack.com/api/chat.postMessage';
var secrets = require('../../secrets');
var headers = { 'cache-control': 'no-cache', 'Authorization': secrets.Authorization, 'Content-Type': 'application/json' };

module.exports = {
    sendMsg: sendMsg,
    sendMsgButton: sendMsgButton
};

function sendMsg(req, res) {
  
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "text": msg.text
    };
    request.post({headers: headers, url:URL, body: body, json:true});
    res.status(200).type('application/json').end();
}
 
function sendMsgButton(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "text": msg.text,
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
        if (error) throw new Error(error);
        var bodyStringified = JSON.stringify(body);
        res.json(bodyStringified);
        console.log(JSON.parse(bodyStringified))
    });
    console.log(request);

}


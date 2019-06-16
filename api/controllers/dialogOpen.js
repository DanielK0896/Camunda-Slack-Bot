/* This file can be reached by calling swagger API endpoint.Pass as many textElements and selectMenus as you want to
    * be added to the message */

var request = require('request');
var URL = "https://slack.com/api/dialog.open";
var secrets = require('../../secrets');

module.exports = {
    dialogOpen: dialogOpen
};

function dialogOpen(req, res) {
    var msg = req.swagger.params.body.value;
    console.log("Dialog" + JSON.stringify(msg));
    var body = {
        "trigger_id": msg.triggerId,
        "dialog": {
            "callback_id": msg.callbackId,
            "title": msg.title,
            "submit_label": "Absenden",
            "notify_on_cancel": true,
            "state": "default",
            "elements": []
        }
    };
    for (var i = 0; i < msg.label.length; i++) {
        objectToPush = {
            "label": msg.label[i],
            "name": i,
            "type": msg.type[i],
            "placeholder": msg.placeholder[i]
        };
        if (msg.data_source[i] != "undefined") {
            objectToPush += { "data_source": msg.data_source[i] };
        } else {
            objectToPush += { "max_length": msg.maxLength[i], "min_length": msg.minLength[i] };
        }
        
        if (msg.options[i] != "undefined") {
            for (var s = 0; s < msg.options; s++) {
                objectToPush += { "options": msg.options[i] };
            }
        } 
        body.dialog.elements.push(objectToPush);
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
    console.log(JSON.stringify(body));
    request(options, function (error, response, body) {
        if (!error) {
            var bodyStringified = JSON.stringify(body);
            res.json(bodyStringified);
            console.log(JSON.parse(bodyStringified))
        } else { console.log("ERROR startDialog: " + error); }
    });
}

var request = require('request');
var URL = "https://slack.com/api/dialog.open";
var secrets = require('../../secrets');
var headers = {'Authorization': secrets.Authorization, 'Content-Type': 'application/json'};

module.exports = {
    startDialogOneTextElement: startDialogOneTextElement,
    startDialogTwoTextElements: startDialogTwoTextElements,
    startDialogSelectMenus: startDialogSelectMenus
};

function startDialogOneTextElement(req, res) {

    var msg = req.swagger.params.body.value;
    var body = {
        "trigger_id": msg.triggerId,
        "dialog": {
            "callback_id": msg.callbackId,
            "title": msg.title,
            "submit_label": "Absenden",
            "notify_on_cancel": true,
            "state": "default",
            "elements": [
                {
                    "label": msg.label1,
                    "name": msg.name1,
                    "type": "text",
                    "placeholder": msg.placeholder1
                }
            ]
        }
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}

function startDialogTwoTextElements(req, res) {

    var msg = req.swagger.params.body.value;
    var body = {
        "trigger_id": msg.triggerId,
        "dialog": {
            "callback_id": msg.callbackId,
            "title": msg.title,
            "submit_label": "Absenden",
            "notify_on_cancel": true,
            "state": "default",
            "elements": [
                {
                    "label": msg.label1,
                    "name": msg.name1,
                    "type": "text",
                    "placeholder": msg.placeholder1
                },
                {
                    "label": msg.label2,
                    "name": msg.name2,
                    "type": "text",
                    "placeholder": msg.placeholder2
                }
            ]
        }
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}

function startDialogSelectMenus(req, res) {

    var msg = req.swagger.params.body.value;
    var body = {
        "trigger_id": msg.triggerId,
        "dialog": {
            "callback_id": msg.callbackId,
            "title": msg.title,
            "submit_label": "Absenden",
            "notify_on_cancel": true,
            "state": "default",
            "elements": [
                {
                    "label": msg.label1,
                    "name": msg.name1,
                    "type": "select",
                    "data_source": "users"
                }
            ]
        }
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}



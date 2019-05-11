var util = require('util');
var request = require('request');
var URL = "https://slack.com/api/chat.postMessage";
var secrets = require('../../secrets');
var headers = {'Authorization': secrets.Authorization, 'Content-Type': 'application/json'};



module.exports = {
    sendMsg: sendMsg,
    sendMsgOneButton: sendMsgOneButton,
    sendMsgOneButtonConfirm: sendMsgOneButtonConfirm,
    sendMsgTwoButtons: sendMsgTwoButtons,
    sendMsgTwoButtonsConfirm: sendMsgTwoButtonsConfirm
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
 
function sendMsgOneButton(req, res) {
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
                    {
                        "name": "Action1",
                        "text": msg.textButton1,
                        "style": "#75FD2C",
                        "type": "button",
                        "value": "one"
                    }
                ]
            }
        ]
    };
    request.post({headers: headers, url:URL, body: body, json:true});
    res.status(200).type('application/json').end();
}

function sendMsgOneButtonConfirm(req, res) {
  
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
                    {
                        "name": "Action1",
                        "text": msg.textButton1,
                        "style": "#75FD2C",
                        "type": "button",
                        "value": "one",
                        "confirm": {
                            "title": "Bestätigen",
                            "text": msg.textConfirmation1,
                            "dismiss_text": "Abbrechen",
                            "ok_text": "Ja"
                        }
                    }
                ]
            }
        ]
    };
    request.post({headers: headers, url:URL, body: body, json:true});
    res.status(200).type('application/json').end();
}

function sendMsgTwoButtons(req, res) {
  
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
                    {
                        "name": "Action1",
                        "text": msg.textButton1,
                        "style": "#75FD2C",
                        "type": "button",
                        "value": "one"
                    },
                    {
                        "name": "Action2",
                        "text": msg.textButton2,
                        "style": "danger",
                        "type": "button",
                        "value": "two"
                    }
                ]
            }
        ]
    };
    request.post({headers: headers, url:URL, body: body, json:true});
    res.status(200).type('application/json').end();
}

function sendMsgTwoButtonsConfirm(req, res) {
  
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
                    {
                        "name": "Action1",
                        "text": msg.textButton1,
                        "style": "#75FD2C",
                        "type": "button",
                        "value": "one",
                        "confirm": {
                            "title": "Bestätigen",
                            "text": msg.textConfirmation1,
                            "dismiss_text": "Abbrechen",
                            "ok_text": "Ja"
                        }
                    },
                    {
                        "name": "Action2",
                        "text": msg.textButton2,
                        "style": "danger",
                        "type": "button",
                        "value": "two",
                        "confirm": {
                            "title": "Bestätigen",
                            "text": msg.textConfirmation2,
                            "dismiss_text": "Abbrechen",
                            "ok_text": "Ja"
                        }
                    }
                ]
            }
        ]
    };
    request.post({headers: headers, url:URL, body: body, json:true});
    res.status(200).type('application/json').end();
}
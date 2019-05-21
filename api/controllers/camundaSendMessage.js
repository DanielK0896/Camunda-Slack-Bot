
var util = require('util');
var request = require('request');
var URL = "http://localhost:8080/engine-rest/message";
var headers = { 'Content-Type': 'application/json' };



module.exports = {
    camundaSendMessageOneVariables: camundaSendMessageOneVariables,
    camundaSendMessageTwoVariables: camundaSendMessageTwoVariables
};


function camundaSendMessageOneVariables(req, res) {

    var msg = req.swagger.params.body.value;
    var correlationKeys = msg.correlationKey.split(',');
    var body = {
        "messageName": msg.message,
        "correlationKeys": {
            [correlationKeys[0]]: { "value": correlationKeys[2], "type": "String" },
            [correlationKeys[1]]: { "value": correlationKeys[3], "type": "String" }
        },
        "processVariables": {
            [msg.nameVariable1]: { "value": msg.variable1, "type": "String"  }
        }
    };
    console.log(body);
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}

function camundaSendMessageTwoVariables(req, res) {

    var msg = req.swagger.params.body.value;
    var correlationKeys = msg.correlationKey.split(',');
    var body = {
        "messageName": msg.message,
        "correlationKeys": {
            [correlationKeys[0]]: { "value": correlationKeys[2], "type": "String" },
            [correlationKeys[1]]: { "value": correlationKeys[3], "type": "String" }
        },
        "processVariables": {
            [msg.nameVariable1]: { "value": msg.variable1, "type": "String" },
            [msg.nameVariable2]: { "value": msg.variable2, "type": "String" }
        }
    };
    console.log(body);
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}
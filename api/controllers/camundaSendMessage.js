
var util = require('util');
var request = require('request');
var URL = "http://localhost:8080/engine-rest/message";
var headers = { 'Content-Type': 'application/json' };



module.exports = {
    camundaSendMessageOneVariable: camundaSendMessageOneVariable
};


function camundaSendMessageOneVariable(req, res) {

    var msg = req.swagger.params.body.value;
    var correlationKeys = msg.correlationKey.split(',');
    var body = {
        "messageName": msg.message,
        "correlationKeys": {
            [correlationKeys[0]]: { "value": correlationKeys[2], "type": correlationKeys[4] },
            [correlationKeys[1]]: { "value": correlationKeys[3], "type": correlationKeys[5] }
        },
        "processVariables": {
            [nameVariable1]: { "value": msg.variable1, "type": "String"  }
        }
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}
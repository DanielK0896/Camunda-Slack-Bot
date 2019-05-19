
var util = require('util');
var request = require('request');
var URL = "http://localhost:8080/engine-rest/message";
var headers = { 'Content-Type': 'application/json' };



module.exports = {
    camundaSendMessage: camundaSendMessage
};


function camundaSendMessage(req, res) {

    http://www.danielkoester96.de:8080/engine-rest/process-instance?variables=name_eq_QM+Schulung,date_eq_2019-05-29T15:00:00.000%2B0100

    var msg = req.swagger.params.body.value;
    var correlationKeys = msg.correlationKey.split(',');
    var body = {
        "messageName": msg.message,
        "correlationKeys": {
            [correlationKeys[0]]: { "value": correlationKeys[2], "type": "String" },
            [correlationKeys[1]]: { "value": correlationKeys[3], "type": "String" }
        },
        "processVariables": {
            "aVariable": { "value": "aNewValue", "type": msg.userId },
            "anotherVariable": { "value": true, "type": "String" }
        }
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}
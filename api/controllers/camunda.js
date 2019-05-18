var util = require('util');
var request = require('request');
var URL = "https://slack.com/api/chat.postMessage";
var secrets = require('../../secrets');
var headers = { 'Authorization': secrets.Authorization, 'Content-Type': 'application/json' };



module.exports = {
    camundaStartProcess: camundaStartProcess
};


function camundaStartProcess(req, res) {

    var msg = req.swagger.params.body.value;
    var body = {
        "variables": {
            variable1: {
                "value": msg.variable1,
                "type": "String"
            },
            variable2: {
                "value": msg.variable2,
                "type": "String"
            },
            variable3: {
                "value": msg.variable3,
                "type": "String"
            },
            variable4: {
                "value": msg.variable4,
                "type": "date"
            }
        },
        "businessKey": msg.businessKey
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}
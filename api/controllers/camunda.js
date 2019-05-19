var util = require('util');
var request = require('request');
var URL = "http://localhost:8080/engine-rest/process-definition/key/hr_schulung/start";



module.exports = {
    camundaStartProcess: camundaStartProcess
};


function camundaStartProcess(req, res) {

    var msg = req.swagger.params.body.value;
    console.log(msg);
    var body = {
        "variables": {
            [msg.variable1]: {
                "value": msg.variable1,
                "type": "String"
            },
            [msg.variable2]: {
                "value": msg.variable2,
                "type": "String"
            }
        },
        "businessKey": msg.businessKey
    };
    console.log(body);
    request.post({ url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}
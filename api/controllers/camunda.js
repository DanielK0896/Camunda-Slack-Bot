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
            variable1: {
                "value": msg[0],
                "type": "String"
            },
            variable2: {
                "value": msg[1],
                "type": "String"
            },
            variable3: {
                "value": msg[2],
                "type": "String"
            },
            variable4: {
                "value": msg[3],
                "type": "date"
            }
        },
        "businessKey": msg.businessKey
    };
    console.log(body);
    request.post({ url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}
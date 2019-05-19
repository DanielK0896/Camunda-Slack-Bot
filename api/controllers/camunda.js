var util = require('util');
var request = require('request');
var URL = "http://localhost:8080/engine-rest/process-definition/key/hr_schulung/start";



module.exports = {
    camundaStartProcess: camundaStartProcess
};


function camundaStartProcess(req, res) {

    var msg = req.swagger.params.body.value;
    console.log(msg);
    msg2 = Object.values(msg);

    var body = {
        "variables": {
            variable1: {
                "value": msg2[0],
                "type": "String"
            },
            variable2: {
                "value": msg2[1],
                "type": "String"
            },
            variable3: {
                "value": msg2[2],
                "type": "String"
            },
            variable4: {
                "value": msg2[3],
                "type": "date"
            }
        },
        "businessKey": msg.businessKey
    };
    console.log(body);
    request.post({ url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}
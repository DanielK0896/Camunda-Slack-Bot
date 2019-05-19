var util = require('util');
var request = require('request');
var URL = "http://localhost:8080/engine-rest/process-definition/key/hr_schulung/start";



module.exports = {
    camundaStartProcessSchulungOrganisieren: camundaStartProcessSchulungOrganisieren
};


function camundaStartProcessSchulungOrganisieren(req, res) {

    var msg = req.swagger.params.body.value;
    var body = {
        "variables": {
            "name": {
                "value": msg.name,
                "type": "String"
            },
            "trainer": {
                "value": msg.trainer,
                "type": "String" 
            },
            "date": {
                "value": msg.date,
                "type": "date"
            },
            "room": {
                "value": msg.room,
                "type": "String"
            },
            "process": {
                "value": "schulungOrganisieren",
                "type": "String"
            }
        },
        "businessKey": msg.businessKey
    };
    console.log(body);
    request.post({ url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}
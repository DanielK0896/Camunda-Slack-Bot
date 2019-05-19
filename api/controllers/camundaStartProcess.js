var util = require('util');
var request = require('request');
var URL = "http://localhost:8080/engine-rest/process-definition/hr_schulung:1:11fd002b-79b7-11e9-b08d-b827eb154505/start";



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
                "type": "Date"
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
var request = require('request');
var URL = "http://localhost:8080/engine-rest/process-definition/key/hr_schulung/start";
var headers = { 'Content-Type': 'application/json' };

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
            },
            "correlationKey": {
                "value": "name,date",
                "type": "String"
            },
            "listOfUserIds": {
                "value": "SlackIds",
                "type": "String"
            }
        },
        "businessKey": msg.businessKey
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}
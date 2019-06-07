/* Example for starting a Camunda process via API passing required variables*/



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
    var options = {
        method: 'POST',
        url: URL,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: secrets.Authorization,
            'Content-Type': 'application/json'
        },
        body: body,
        json: true
    };

    request(options, function (error, response, body) {
        if (!error) {
            var bodyStringified = JSON.stringify(body);
            res.json(bodyStringified);
            console.log(JSON.parse(bodyStringified))
        } else { console.log("ERROR camundaStartProcess: " + error) }
    });
}
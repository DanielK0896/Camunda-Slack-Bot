/* Example for starting a Camunda process via API passing required variables*/

var request = require('request');

var processJSON = require('./processes');

module.exports = {
    camundaStartProcess: camundaStartProcess
};

async function camundaStartProcess(req, res) {

    var process = req.swagger.params.process.value;
    var URL = "http://localhost:8080/engine-rest/process-definition/key/" + process + "/start"
    body = {};
    for (var processIndex = 0; processIndex < Object.keys(processJSON).length; processIndex++) {
        if (typeof processJSON[processIndex][process] != "undefined") {
            body.variables = processJSON[processIndex][process];
            break;
        }
    }
    for (var x in body.variables) {
        if (body.variables[x].value == "") {
            body.variables[x].value = req.swagger.params.text.value;
            break;
        }
    }
    body.variables.startingUser = {
        "value": req.swagger.params.user_id.value,
        "type": "String"
    };
    console.log(body);
    var options = { 
        method: 'POST',
        url: URL,
        headers:
        {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json'
        },
        body: body,
        json: true
    };
    request(options, function (error, response, body) {
        if (!error) {
            var statusCode = JSON.stringify(response.statusCode);
            if (statusCode == 200) {
                res.json({ "text": "Prozess \"" + process + "\" wird gestartet!" });
            } else {
                res.json({ "text": "Prozess \"" + process + "\" konnte nicht gestartet werden, versuche es in ein paar Minuten erneut!" });
            }
            console.log("Response Status: " + JSON.stringify(response));
        } else { console.log("ERROR camundaStartProcess: " + error) }
    });
}


/* Example for starting a Camunda process via API passing required variables*/

var request = require('request');
var URL = "http://localhost:8080/engine-rest/process-definition/key/";
var processJSON = require('./processes');

module.exports = {
    camundaStartProcess: camundaStartProcess
};

async function camundaStartProcess(req, res) {

    var process = req.swagger.params.process.value;
    var text = req.swagger.params.text.value;
    URL += process + "/start"
    body = {};
    var x;
    var processIndex;
    for (processIndex = 0; processIndex < Object.keys(processJSON).length; processIndex++) {
        console.log(processIndex);
        console.log(processJSON[processIndex]);
        console.log(processJSON[processIndex][process]);
        if (typeof processJSON[processIndex][process] != "undefined") {
            body.variables = processJSON[processIndex][process];
            console.log(body);
            break;
        }
        return processIndex;
    }
    console.log(processIndex);
    for (x in processJSON[process]) {
        if (processJSON[processIndex][process][x][value] == "") {
            processJSON[processIndex][process][x][value] = text;
        }
    }
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
            var bodyStringified = JSON.stringify(body);
            res.json({ "text": "Prozess \"" + process + "\" wird gestartet!" });
            console.log(JSON.parse(bodyStringified))
        } else { console.log("ERROR camundaStartProcess: " + error) }
    });
}
/*

const mod = require('./modules');

var name = "QM Schulung";
var trainer = "Daniel";
var room = "";
var date = "2019-05-29T16:00:00.000+0200";
var businessKey = name + date;
var path = "/camunda/startProcess/schulungOrganisieren";

var payload = JSON.stringify({ name: name, trainer: trainer, date: date, room: room, businessKey: businessKey });
mod.postToSwaggerAPI(payload, path);

*/
/* Example for starting a Camunda process via API passing required variables*/

var request = require('request');
var URL = "http://localhost:8080/engine-rest/process-definition/key/";
var processes = require('./processes');

module.exports = {
    camundaStartProcess: camundaStartProcess
};

async function camundaStartProcess(req, res) {

    var process = req.swagger.params.process.value;
    console.log(process);
    var msg = req.swagger.params.token.value;
    console.log(msg);
    var msg1 = req.swagger.params.channel_id.value;
    console.log(msg1);
    var msg2 = req.swagger.params.user_id.value;
    console.log(msg2);
    URL += process + "/start"
    var processIndex;
    body = {};
    for (processIndex in processes) {
        console.log(processIndex);
        console.log(processes);
        if (typeof processes[processIndex][process] != "undefined") {
            body.variables = processes[processIndex][process];
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
            res.json({ "text": "Prozess" + prozess + "gestartet!" });
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
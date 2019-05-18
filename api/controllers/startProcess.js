const mod = require('./modules');

var name = "QM Schulung";
var trainer = "Daniel";
var room = "";
var date = "2019-05-29T16:00:00";
var businessKey = name + date;
var path = "/engine-rest/process-definition/key/hr_schulung/start";

var payload = JSON.stringify({ variable1: name, variable2: trainer, variable3: room, variable4: date, businessKey: businessKey });
mod.postJsonToLocalhost(payload, 8080, path);
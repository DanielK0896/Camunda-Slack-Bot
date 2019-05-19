const mod = require('./modules');

var name = "QM Schulung";
var trainer = "Daniel";
var room = "";
var date = "2019-05-29T16:00:00+0200";
var businessKey = name + date;
var path = "/camunda/startProcess/schulungOrganisieren";

var payload = JSON.stringify({ name: name, trainer: trainer, date: date, room: room, businessKey: businessKey });
mod.postToSwaggerAPI(payload, path);
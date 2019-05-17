const mod = require('./modules');

var name = "QM Schulung";
var trainer = "Daniel";
var room = "";
var date = "";
var businessKey = name + date;
var path = "/engine-rest/process-definition/key/hr_schulung/start";
var msg = {
    "variables": {
        "name": {
            "value": name,
            "type": "String"
        },
        "trainer": {
            "value": trainer,
            "type": "String"
        },
        "room": {
            "value": room,
            "type": "String"
        },
        "date": {
            "value": date,
            "type": "date"
        }
    },
    "businessKey": businessKey
};

mod.postJsonToLocalhost(msg, 10010, path);
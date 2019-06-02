/* This file can be reached by calling swagger API endpoint. 
 * camundaInstanceGetId: Pass correlationKeys (process variables in your Camunda process (name, value and type))
                         and get the Instance Id. 
 camundaInstanceDeleteVariable: With the instance id you can delete process variables via API*/

var request = require('request');
var URL = "http://localhost:8080/engine-rest/process-instance";

module.exports = {
    camundaInstanceGetId: camundaInstanceGetId,
    camundaInstanceDeleteVariable: camundaInstanceDeleteVariable
};

function camundaInstanceGetId(req, res) {
    var msg = req.swagger.params.body.value;
    var correlationKeys = msg.correlationKey.split(',');
    for (var i = 2; i < 4; i++) {
        correlationKeys[i] = changeFormat(correlationKeys[i]);
    }
    URL += "?variables=" + correlationKeys[0]+ "_eq_" + correlationKeys[2] + "," + correlationKeys[1] + "_eq_" + correlationKeys[3];

    request.get({url: URL});
    res.status(200).type('application/json').end();
}

function camundaInstanceDeleteVariable(req, res) {

    var msg = req.swagger.params.body.value;
    var instanceId = msg.instanceId;
    var variable = msg.variable;
    URL += "/" + instanceId + "/variables/" + variable;

    request.del({url: URL});
    res.status(200).type('application/json').end();
}

function changeFormat(variable) {
    var variableUpdated;
    for (var j = 0; j < 2; j++) {
        var variableSplitted;
        if (j = 0) {
            variableSplitted = variable.split('+');
        } else {
            variableSplitted = variable.split(' ');
        }
        for (var i = 1; i < 100; i++) {
            var index = i - 1;
            if (i == 1) {
                variableUpdated = variableSplitted[index]
            } else {
                if (j = 0) {
                    variableUpdated += "%2B" + variableSplitted[index];
                } else {
                    variableUpdated += "+" + variableSplitted[index];
                }
                if (typeof (variableSplitted[i]) === "undefined") {
                    break;
                }
            }
        }
    }
    return variableUpdated;
}

    


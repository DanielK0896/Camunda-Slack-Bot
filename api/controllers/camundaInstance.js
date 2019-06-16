/* This file can be reached by calling swagger API endpoint. 
 * camundaInstanceGetId: Pass correlationKeys (process variables in your Camunda process (name, value and type))
                         and get the Instance Id. 
 camundaInstanceDeleteVariable: With the instance id you can delete process variables via API*/

var request = require('request');
const CAMUNDA_CONFIG = require('./camundaConfig');

module.exports = {
    camundaInstanceGetId: camundaInstanceGetId,
    camundaInstanceVariableDelete: camundaInstanceVariableDelete,
    camundaInstanceVariableGet: camundaInstanceVariableGet

};

function camundaInstanceGetId(req, res) {
    var msg = req.swagger.params.body.value;
    console.log(msg);
    var correlationKeys = msg.correlationKey.split(CAMUNDA_CONFIG.correlationKeySplit);
    //for (var i = 2; i < 4; i++) {
    //    correlationKeys[i] = changeFormat(correlationKeys[i]);
    //}
    var URL = "http://localhost:8080/engine-rest/process-instance" + "?variables=" + correlationKeys[0]+ "_eq_" + correlationKeys[2] + "," + correlationKeys[1] + "_eq_" + correlationKeys[3];
    var options = {
        method: 'GET',
        url: URL
    };
    console.log(URL);
    request(options, function (error, response, body) {
        if (!error) {
            console.log("Response:" + response);
            var responseStringified = JSON.stringify(response);
            console.log("ResponseString:" + responseStringified);
            res.json(responseStringified);
        } else { console.log("ERROR camundaInstanceGetVariable: " + error); }
    });
}

function camundaInstanceVariableGet(req, res) {
    var msg = req.swagger.params.body.value;
    var URL = "http://localhost:8080/engine-rest/process-instance" + msg.id + "/variables/" + msg.variableName;
    var options = {
        method: 'GET',
        url: URL
    };
       request(options, function (error, response, body) {
        if (!error) {
            var responseStringified = JSON.stringify(response);
            res.json(responseStringified);
        } else { console.log("ERROR camundaInstanceGetVariable: " + error); }
    });
}

function camundaInstanceVariableDelete(req, res) {

    var msg = req.swagger.params.body.value;
    var instanceId = msg.instanceId;
    var variable = msg.variable;
    var URL = "http://localhost:8080/engine-rest/process-instance/" + instanceId + "/variables/" + variable;

    var options = {
        method: 'GET',
        url: URL
    };
    request(options, function (error, response, body) {
        if (!error) {
            var responseStringified = JSON.stringify(response);
            res.json(responseStringified);
        } else { console.log("ERROR camundaInstanceGetVariable: " + error); }
    });
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

    


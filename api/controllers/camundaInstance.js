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
    var URL = "http://localhost:8080/engine-rest/process-instance" + "?variables=" + correlationKeys[0]+ "_eq_" + correlationKeys[2] + "," + correlationKeys[1] + "_eq_" + correlationKeys[3];
    var options = {
        method: 'GET',
        url: URL
    };
    console.log(URL);
    request(options, function (error, response, body) {
        if (!error) {
            console.log(body);
            console.log(typeof body);
            res.json(body);
        } else { console.log("ERROR camundaInstanceGetVariable: " + error); }
    });
}

function camundaInstanceVariableGet(req, res) {
    var msg = req.swagger.params.body.value;
    console.log(msg);
    var URL = "http://localhost:8080/engine-rest/process-instance" + msg.id + "/variables/" + msg.variableName;
    var options = {
        method: 'GET',
        url: URL
    };
       request(options, function (error, response, body) {
        if (!error) {
            var responseStringified = JSON.stringify(response);
            res.json(responseStringified);
            console.log(responseStringified);
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



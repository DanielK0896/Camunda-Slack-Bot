
var util = require('util');
var request = require('request');
var URL = "http://www.danielkoester96.de:8080/engine-rest/process-instance?variables=";
var headers = { 'Content-Type': 'application/json' };



module.exports = {
    camundaGetInstanceId: camundaGetInstanceId
};


function camundaGetInstanceId(req, res) {
    var msg = req.swagger.params.body.value;
    var correlationKeys = msg.correlationKey.split(',');
    for (var i = 2; i < 4; i++) {
        correlationKeys[i] = changeFormat(correlationKeys[i]);
    }
    URL += correlationKeys[0]+ "_eq_" + correlationKeys[2] + "," + correlationKeys[1] + "_eq_" + correlationKeys[3];

    const options = {
        url: URL,
        method: 'GET',
        headers: headers
    };
    request(options, function (err, res, body) {
            let json = JSON.parse(body);
            console.log(json);
        });
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

    


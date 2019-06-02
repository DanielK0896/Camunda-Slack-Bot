/* This file can be reached by calling swagger API endpoint. Pass as many variables as you want to add to Camunda as a process variable.
 * For this you pass the variable name (nameVariable1) and the value (variable1). Furtermore you have to pass the message name and two 
 * variables, including name and value, trough one string named correlationKey. E.g.: name1,name2,value1,value2.*/
var request = require('request');
var URL = "http://localhost:8080/engine-rest/message";
var headers = { 'Content-Type': 'application/json' };



module.exports = {
    camundaSendMessage: camundaSendMessage,
};


function camundaSendMessage(req, res) {

    var msg = req.swagger.params.body.value;
    var correlationKeys = msg.correlationKey.split(',');
    var body = {
        "messageName": msg.message,
        "correlationKeys": {
            [correlationKeys[0]]: { "value": correlationKeys[2], "type": "String" },
            [correlationKeys[1]]: { "value": correlationKeys[3], "type": "String" }
        },
        "processVariables": {}
    };
    for (var i = 0; i < msg.nameVariable.length; i++) {
        body.processVariables[msg.nameVariable[i]] = { "value": msg.variable[i], "type": "String" }; 
    }    
    request.post({ headers: headers, url: URL, body: body, json: true });
    console.log(body);
    res.status(200).type('application/json').end();
}
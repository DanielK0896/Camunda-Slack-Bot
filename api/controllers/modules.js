module.exports = {
    postToSlack: postToSlack,
    getVariables: getVariables
};

function postToSlack(msg, path){             //function to call Swagger API
    var http = require('http');
    var request = http.request({
    host:'localhost',
    port: 10010,
    method: 'POST',
    path: path,
    headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    }
    }, function (error, res, body) {
	console.log(body);
    });
    request.write(msg);
    request.end();

}

function getVariables(task, variablesToGet) {    //function to get Variables from Camunda
    var arrayOfVariables = [];
    for(var i = 0; i < variablesToGet.length; i++) {
        var variable = task.variables.get(variablesToGet[i])
        arrayOfVariables.push(variable);
        if(variablesToGet[i] == 'date') {
            arrayOfVariables.push(`${variable.getDate()}.${variable.getMonth()}.${variable.getFullYear()}`);
            arrayOfVariables.push(`${variable.getHours()}:${variable.getMinutes()}`);
        }
    }
    return arrayOfVariables;
} 
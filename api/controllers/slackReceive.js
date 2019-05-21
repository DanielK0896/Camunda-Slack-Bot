module.exports = {
    slackReceive: slackReceive
};

function slackReceive(req, res) {                  //receive Slack POSTs after invoked action                                

    var msg = JSON.parse(req.swagger.params.payload.value); //get POST-Body and define Variables
    var taskid = msg.callback_id.split(' ');
    var callFunction = require('./schulungOrganisieren');

    if (taskid[0] == "message") {                        //call function depending on callback_id
        var arrayOfVariables = [];
        var variableInformation = msg.taskid[3].split(' ');
        var path = "/camunda/SendMessage/" + variableInformation[0] + "Variables"
        for (var i = 1; i < variableInformation.length; i++) {
            var numberNameVariable = "nameVariable" + i;
            var numberVariable = "variable" + i;
            arrayOfVariables[numberNameVariable] = variableInformation[i];
            var variablesToPost = variableInformation[i].split('.');
            if (variablesToPost.length == 2) {
                arrayOfVariables[numberVariable] = msg[variablesToPost[0]][variablesToPost[1]];
            } else {
                arrayOfVariables[numberVariable] = msg[variablesToPost[0]];
            }
            
        }
        arrayOfVariables["correlationKey"] = taskid[1];
        arrayOfVariables["message"] = taskid[2];
        var payload = JSON.stringifiy(arrayOfVariables);
        postToSwaggerAPI(payload, path);
    }

    else if (topic == "startDialogToGetRoomNumber") { callFunction.startDialogToGetRoomNumber(msg, taskid, res); }    
}
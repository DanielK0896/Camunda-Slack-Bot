var mod = require('./modules');

module.exports = {
    slackReceive: slackReceive
};

function slackReceive(req, res) {                  //receive Slack POSTs after invoked action                                
    
    var msg = JSON.parse(req.swagger.params.payload.value); //get POST-Body and define Variables
    var pushedButton = msg.actions[0].value;
    var taskid = msg.callback_id.split(' ');
    console.log(taskid);

    if (taskid[0] == "message") {                        //call function depending on callback_id
        var arrayOfVariables = {};
        var variableInformation = taskid[3].split(',');
        var path = "/camunda/SendMessage/" + variableInformation[0] + "Variables"
        for (var i = 1; i < variableInformation.length; i++) {
            var numberNameVariable = "nameVariable" + i;
            var numberVariable = "variable" + i;
            arrayOfVariables[numberNameVariable] = variableInformation[i];
            var variablesToPost = variableInformation[i].split('.');
            if (variablesToPost.length == 2) {
                arrayOfVariables[numberVariable] = pushedButton + "," + msg[variablesToPost[0]][variablesToPost[1]];
            } else {
                arrayOfVariables[numberVariable] = pushedButton + "," + msg[variablesToPost[0]];
            }
            
        }
        console.log("path: " + path);
        arrayOfVariables["correlationKey"] = taskid[1];
        arrayOfVariables["message"] = taskid[2];
        console.log(arrayOfVariables);
        var payload = JSON.stringify(arrayOfVariables);
        mod.postToSwaggerAPI(payload, path);
        res.json({
            "response_type": "ephemeral", "replace_original": false,
            "text": "Deine Nachricht ist angekommen!"
        });
    } 
}
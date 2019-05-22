var mod = require('./modules');
var numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixten", "seventeen", "eighteen", "nineteen", "twenty"];
var basicResponse = {
    "response_type": "ephemeral", "replace_original": false,
    "text": "Deine Nachricht ist angekommen!"
};
module.exports = {
    slackReceive: slackReceive
};

function slackReceive(req, res) {                  //receive Slack POSTs after invoked action                                

    var msg = JSON.parse(req.swagger.params.payload.value); //get POST-Body and define Variables
    try {
        var pushedButton = msg.actions[0].value;
    } catch (e) { }
    var taskid = msg.callback_id.split(' ');
    var arrayOfVariables = {};
    //call function depending on callback_id
    if (taskid[0] == "message" && msg.type != "dialog_cancellation") {            //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...    
        var variableInformation = taskid[3].split(','); // callbackId[3] = "variable1,variable2,..." e.g. "three,user,user.name"
        var i;
        for (i = 1; i <= variableInformation.length; i++) {
            var numberNameVariable = "nameVariable" + i;
            var numberVariable = "variable" + i;
            arrayOfVariables[numberNameVariable] = variableInformation[i-1];
            var variablesToPost = variableInformation[i-1].split('.');
            if (variablesToPost.length == 2) {
                arrayOfVariables[numberVariable] = pushedButton + "," + msg[variablesToPost[0]][variablesToPost[1]];
            } else {
                arrayOfVariables[numberVariable] = pushedButton + "," + msg[variablesToPost[0]];
            }

        }
        var path = "/camunda/SendMessage/" + numbers[i - 1] + "Variables"
        arrayOfVariables["correlationKey"] = taskid[1];  //callbackId[1] = correlationKeys, look at camundaSendMessage for further Informations
        arrayOfVariables["message"] = taskid[2];        //callbackId[2] = the message name in the camunda process
        var payload = JSON.stringify(arrayOfVariables);
        mod.postToSwaggerAPI(payload, path);
        res.json(basicResponse);



    } else if (taskid[0] == "dialog" && pushedButton == taskid[1]) {   //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...
        //callbackId[1] = open Dialog when pushed Button = xy e.g. "one"
        var variablesForDialog = taskid[2].split(',');                  //callbackId[2] = first dialog element e.g. "textelement"
        arrayOfVariables["triggerId"] = msg.trigger_id;
        arrayOfVariables["callbackId"] = taskid[3].split(',').join(' ');                     //callbackId[3] = new Callback ID
        arrayOfVariables["title"] = variablesForDialog[1];              //then necessary variables
        var path;
        var i;
        if (variablesForDialog[0] == "textelement") {
            for (i = 1; i <= ((variablesForDialog.length - 2) / 3); i++) {
                var numberLabel = "label" + i;
                var numberName = "name" + i;
                var numberPlaceholder = "placeholder" + i;
                arrayOfVariables[numberLabel] = variablesForDialog[i * 3 - 1];
                arrayOfVariables[numberName] = variablesForDialog[i * 3];
                arrayOfVariables[numberPlaceholder] = variablesForDialog[i * 3 + 1];
            }
            path = "/startDialog/" + numbers[i - 1] + "TextElement";
        } else if (variablesForDialog[0] == "textarea") {
            for (i = 1; i <= ((variablesForDialog.length - 2) / 4); i++) {
                var numberLabel = "label" + i;
                var numberName = "name" + i;
                var numberPlaceholder = "placeholder" + i;
                arrayOfVariables[numberLabel] = variablesForDialog[i * 3 - 1];
                arrayOfVariables[numberName] = variablesForDialog[i * 3];
                arrayOfVariables[numberPlaceholder] = variablesForDialog[i * 3 + 1];
            }
            path = "/startDialog/" + numbers[i - 1] + "Textarea";
        } else if (variablesForDialog[0] == "selectelement") {
            for (i = 1; i <= ((variablesForDialog.length - 2) / 3); i++) {
                var numberLabel = "label" + i;
                var numberName = "name" + i;
                var numberData_source = "data_source" + i;
                var numberPlaceholder = "placeholder" + i;
                arrayOfVariables[numberLabel] = variablesForDialog[i * 4 - 2];
                arrayOfVariables[numberName] = variablesForDialog[i * 4 - 1];
                arrayOfVariables[numberData_source] = variablesForDialog[i * 4];
                arrayOfVariables[numberPlaceholder] = variablesForDialog[i * 4 + 1];
            }
            path = "/startDialog/" + numbers[i - 1] + "SelectElement";
        } else {
            console.log("ERROR Dialog Type");
        }
        if (i > 2) {
            path += "s";
        }
        var payload = JSON.stringify(arrayOfVariables);
        mod.postToSwaggerAPI(payload, path);
        res.json(basicResponse);
    }  else {
        console.log("ERROR SlackReceive.js");
    }

    //if (msg.type == "dialog_submission") {
    //    mod.preparePostMessage(task, "variablesToGet2");
     //   res.status(200).type('application/json').end();
    //}
}
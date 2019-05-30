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
    console.log(msg);
    var taskid;
    var pushedButton; 
    if (msg.type == "interactive_message") {
        taskid = msg.callback_id.split(' ');
        try {
            pushedButton = msg.actions[0].value;
        } catch (e) { }
    }
    if (msg.type == "block_actions") {
        console.log(msg.message.blocks[0]);
        console.log(msg.message.blocks[1]);
        console.log(msg.message.blocks[2]);
        console.log(msg.message.blocks[3]);
        console.log(msg.message.blocks[4]);
        taskid = msg.message.blocks.block_id.split(' ');
    }

    console.log(taskid);

    var arrayOfVariables = {};
    //call function depending on callback_id
    if (taskid[0] == "message" && msg.type != "dialog_cancellation") {            //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...    
        var variableInformation = taskid[3].split(','); // callbackId[3] = "variable1,variable2,..." e.g. "three,user,user.name"
        var i;
        for (i = 1; i <= variableInformation.length; i++) {
            var numberNameVariable = "nameVariable" + i;
            var numberVariable = "variable" + i;
            arrayOfVariables[numberNameVariable] = variableInformation[i - 1];
            var variablesToPost = variableInformation[i - 1].split('.');
            if (variablesToPost.length == 2) {
                arrayOfVariables[numberVariable] = msg[variablesToPost[0]][variablesToPost[1]];
            } else if (variablesToPost.length == 3) {
                arrayOfVariables[numberVariable] = msg[variablesToPost[0]][variablesToPost[1]][variablesToPost[2]];
            } else if (variablesToPost.length == 4) {
                arrayOfVariables[numberVariable] = msg[variablesToPost[0]][variablesToPost[1]][variablesToPost[2]][variablesToPost[3]];
            } else {
                arrayOfVariables[numberVariable] = msg[variablesToPost[0]];
            }
            if (typeof pushedButton != "undefined") {
                arrayOfVariables[numberVariable] = pushedButton + "," + arrayOfVariables[numberVariable];
            }

        }
        var path = "/camunda/sendMessage/" + numbers[i - 1] + "Variables"
        arrayOfVariables["correlationKey"] = taskid[1];  //callbackId[1] = correlationKeys, look at camundaSendMessage for further Informations
        arrayOfVariables["message"] = taskid[2];        //callbackId[2] = the message name in the camunda process
        console.log(arrayOfVariables);
        console.log(path);
        var payload = JSON.stringify(arrayOfVariables);
        mod.postToSwaggerAPI(payload, path);
        res.json(basicResponse);



    } else if (taskid[0] == "dialog" && pushedButton == taskid[1]) {   //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...
        //callbackId[1] = open Dialog when pushed Button = xy e.g. "one"
        var variablesForDialog = taskid[2].split(',');                  //callbackId[2] = first dialog element e.g. "textelement"
        arrayOfVariables["triggerId"] = msg.trigger_id;
        var callbackId = taskid[3].split(',');
        if (callbackId[0] == "message") {
            callbackId[1] += "," + callbackId[2] + "," + callbackId[3] + "," + callbackId[4];
            callbackId[2] = callbackId[5];
            callbackId[3] = callbackId[6];
            console.log(callbackId);
            callbackId.splice(4, 3);
        }

        arrayOfVariables["callbackId"] = callbackId.join(' ');                     //callbackId[3] = new Callback ID
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
        res.status(200).type('application/json').end();
    } else {
        console.log("ERROR SlackReceive.js");
    }

    if (msg.actions.type == "overflow") {
        payload["channel"] = msg.container.channel_id;
        payload["ts"] = msg.container.message_ts;
        payload["blocks"] = msg.blocks;
        var actionValue = msg.actions.selected_option.value;
        var changes = taskid[4].split(',');
        payload["blocks"][changes[actionValue]] = [changes[actionValue + changes.length/2]]
        var path = "/updateOverflow";
        mod.postToSwaggerAPI(JSON.stringify(payload), path);
    } 

    //if (msg.type == "dialog_submission") {
    //    mod.preparePostMessage(task, "variablesToGet2");
     //   res.status(200).type('application/json').end();
    //}
}
var mod = require('./modules');
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
        taskid = msg.actions[0].block_id.split(' ');
        try {
            pushedButton = msg.actions[0].selected_option.value;
        } catch (e) {
            pushedButton = msg.actions[0].value.split(" ");
        }
    }

    var arrayOfVariables = {};
    //call function depending on callback_id
    if (taskid[0] == "message" && msg.type != "dialog_cancellation") {            //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...    

        var variableInformation = taskid[3].split(',');
        for (i = 1; i <= variableInformation.length; i++) {
            arrayOfVariables["nameVariable"[i]] = variableInformation[i - 1];
            console.log(arrayOfVariables["nameVariable"[i]]);
            arrayOfVariables = (mod.pushSpecificVariables(arrayOfVariables, "variable", variableInformation[i - 1], msg)); // callbackId[3] = "variable1,variable2,..." e.g. "three,user,user.name"
            if (typeof pushedButton != "undefined") {
                arrayOfVariables["variable"[i]] = pushedButton + "," + arrayOfVariables["variable"[i]];
            }
        }
        var path = "/camunda/sendMessage/"
        arrayOfVariables["correlationKey"] = taskid[1];  //callbackId[1] = correlationKeys, look at camundaSendMessage for further Informations
        arrayOfVariables["message"] = taskid[2];        //callbackId[2] = the message name in the camunda process
        console.log(arrayOfVariables);
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
    if (msg.type == "block_actions") {
        if (msg.actions.type == "overflow") {
            payload["channel"] = msg.container.channel_id;
            payload["ts"] = msg.container.message_ts;
            payload["blocks"] = msg.message.blocks;
            var changes = taskid[4].split(',');
            var actionValue = msg.actions.selected_option.value;
            payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], changes[actionValue], "0", changes[actionValue + changes.length / 2])
            var path = "/updateOverflow";
            mod.postToSwaggerAPI(JSON.stringify(payload), path);
        } else if (msg.actions.type == "button" && actions[0].action_id != "lastMessage") {
            payload["channel"] = msg.container.channel_id;
            payload["ts"] = msg.container.message_ts;
            payload["blocks"] = msg.message.blocks;
            var headlineLeftFieldSplitted = pushedButton[1].splice(0, 4).join().split('_').join(" ").split(',');
            var headlineRightFieldSplitted = pushedButton[2].splice(0, 4).join().split('_').join(" ").split(',');
            var variableName = msg.actions[0].action_id.split(',');
            var listOfUsers = pushedButton[0].split(',');
            var lengthOfMissingOverflows = headlineLeftFieldSplitted.length;
            var lastOverflowNumber = lengthOfMissingOverflows * 2 + 2;
            if (lastOverflowNumber > 10) {
                lastOverflowNumber = 10;
            }
            for (var i = 0; i < lengthOfMissingOverflows; i++) {
                var s = (i + 1) * 2
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], "blocks." + s + ".fields.0.text", "0", headlineLeftFieldSplitted[i]);
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], "blocks." + s + ".fields.1.text", "0", headlineRightFieldSplitted[i]);
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], "blocks." + s + ".accessory.action_id", "0", listOfUsers[i]); 
                if (i = 3) {
                    break;
                }
            }
            listOfUsers.splice(0, 4);
            if (listOfusers.length == 0) {
                var buttonName = pushedButton[3].split(',')
                var blockId = msg.message.blocks[2].block_id.split(' ');
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], "blocks." + s + ".fields.0.text", "0", buttonName[1].toString());
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], "blocks." + s + ".block_id", "0", blockId[0].toString());
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], "blocks." + lastOverflowNumber + ".elements.action_id", "0", "lastMessage");
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], "blocks." + lastOverflowNumber + ".elements.value", "0", "lastMessage");
            } else {
                var buttonValue = listOfUsers + " " + headlineLeftFieldSplitted.splice(0, 4) + " " + headlineRightFieldSplitted.splice(0, 4) + " " + pushedButton[3];
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], "blocks." + s + ".elements.value", "0", buttonValue);
                if (lengthOfMissingOverflows == 3) {
                    payload["blocks"].splice(7, 2);
                } else if (lengthOfMissingOverflows = 2) {
                    payload["blocks"].splice(5, 4);
                } else if (lengthOfMissingOverflows = 1) {
                    payload["blocks"].splice(3, 6);
                }
            }
            var path = "/updateOverflow";
            mod.postToSwaggerAPI(JSON.stringify(payload), path);
        }
    }

    //if (msg.type == "dialog_submission") {
    //    mod.preparePostMessage(task, "variablesToGet2");
     //   res.status(200).type('application/json').end();
    //}
}
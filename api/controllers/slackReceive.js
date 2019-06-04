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
    var taskid = [];
    var pushedButton; 
    if (msg.type == "interactive_message" || msg.type == "dialog_submission") {
        taskid = msg.callback_id.split(' ');
        try {
            pushedButton = msg.actions[0].value;
        } catch (e) { }
    } else if (msg.type == "block_actions") {
        taskid = msg.actions[0].block_id.split(' ');
        try {
            pushedButton = msg.actions[0].selected_option.value;
        } catch (e) {
            try {
                pushedButton = msg.actions[0].value.split(" ");
            } catch (e) {
                try {

                } catch (e) {}
            }
        }
    } else {
        taskid[0] = "noAction";
    }

    
    //call function depending on callback_id
    if (taskid[0] == "message") {            //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...    
        if (msg.type == "dialog_submission") {
            handleMessage(taskid, pushedButton, msg);
            res.status(200).type('application/json').end();
            var updateMsg = {};
            updateMsg["channel"] = msg.channel.id;
            updateMsg["text"] = "Deine Nachricht ist angekommen:";
            for (x in msg.submission) {
                updateMsg["text"] += " " + msg.submission[x];
            }
            updateMsg["ts"] = taskid[taskid.length - 1];
            console.log(updateMsg);
            mod.postToSwaggerAPI(JSON.stringify(updateMsg), "/updateMsg");
        } else {
            handleMessage(taskid, pushedButton, msg);
            res.json(basicResponse);
        }
    } else if (taskid[0] == "dialog") {   //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...
        if (pushedButton == taskid[1]) {  //callbackId[1] = open Dialog when pushed Button = e.g. "0"
            handleDialog(taskid, msg);
            res.status(200).type('application/json').end();
        } else if (pushedButton != taskid[1]) {
            var callbackId = taskid[3].split(',');
            if (callbackId[0] == "message") {
                callbackId[1] += "," + callbackId[2] + "," + callbackId[3] + "," + callbackId[4];
                callbackId[2] = callbackId[5];
                callbackId[3] = callbackId[6];
                var i;
                for (i = 7; i < callbackId.length; i++) {
                    callbackId[3] += "," + callbackId[i];
                }
                callbackId.splice(4, 3 + (i - 7));
            }
            handleMessage(callbackId, pushedButton);
            res.status(200).type('application/json').end();
        } else {
            console.log("ERROR Dialog");
        } 
    } else {
        console.log("Weder Nachricht noch Dialog");
    }
    if (msg.type == "block_actions") {
        var payload = {};
        if (msg.actions[0].type == "overflow") {
            payload["channel"] = msg.container.channel_id;
            payload["ts"] = msg.container.message_ts;
            payload["blocks"] = msg.message.blocks;
            var changes = taskid[4].split(',');
            var actionValue = msg.actions[0].selected_option.value;
            var recentChanges = changes[actionValue].split('.');
            if (recentChanges[0] == "blocks") {
                for (var i = 0; i < 15; i++) {
                    if (msg.message.blocks[i].block_id == msg.actions[0].block_id) {
                        recentChanges[0] = i;
                        changes[actionValue] = recentChanges.join('.');
                        break;
                    }
                }    
            }
            changes[parseInt(actionValue, 10) + changes.length / 2] = changes[parseInt(actionValue, 10) + changes.length / 2].split('%$%').join(" ");
            payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], changes[actionValue], (parseInt(actionValue, 10) + changes.length / 2).toString(), changes)
            payload["blocks"] = JSON.stringify(payload["blocks"]);
            console.log(JSON.stringify(payload));
            mod.postToSwaggerAPI(JSON.stringify(payload), "/updateOverflow");
        } else if (msg.actions[0].type == "button" && msg.actions[0].action_id != "lastMessage") {
            payload["channel"] = msg.container.channel_id;
            payload["ts"] = msg.container.message_ts;
            payload["blocks"] = msg.message.blocks;
            var headlineLeftField = pushedButton[1].split(',');
            var headlineRightField = pushedButton[2].split(',');
            var lengthOfFields = headlineLeftField.length / 2;
            if (lengthOfFields > 4) {
                lengthOfFields = 4;
            }
            var types = [];
            for (var i = 0; i < lengthOfFields; i++) {            
                types.push(headlineLeftField[i]);       
                headlineLeftField.splice(i, 1);
            }
            var actionsLeft = headlineLeftField.length;
            if (actionsLeft > 4) {
                actionsLeft = 4;
            }
            var headlineLeftFieldSplitted = headlineLeftField.splice(0, 4).join().split('_').join(" ").split(',');
            var headlineRightFieldSplitted = headlineRightField.splice(0, 4).join().split('_').join(" ").split(',');
            var variableName = msg.actions[0].action_id.split(',');
            var listOfUsers = pushedButton[0].split(',');
            
            
            console.log(actionsLeft);
            console.log(lastBlock);
            var lastBlock = actionsLeft * 2 + 2;
            if (actionsLeft == 3) {
                payload["blocks"].splice(7, 2);
            } else if (actionsLeft = 2) {
                payload["blocks"].splice(5, 4);
            } else if (actionsLeft = 1) {
                payload["blocks"].splice(3, 6);
            }
            for (var i = 0; i < actionsLeft; i++) {
                var s = (i + 1) * 2;
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".fields.0.text", "0", headlineLeftFieldSplitted[i]);
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".fields.1.text", "0", headlineRightFieldSplitted[i]);
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".accessory.action_id", "0", listOfUsers[i]);
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".accessory.type", "0", types[i]); 
                if (i = 3) {
                    break;
                }
            }
            listOfUsers.splice(0, 4);
            if (listOfUsers.length == 0) {
                var buttonName = pushedButton[3].split(',')
                var blockId = msg.message.blocks[2].block_id.split(' ');
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".fields.0.text", "0", buttonName[1].toString());
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".block_id", "0", blockId[0].toString());
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], lastBlock + ".elements.action_id", "0", ["lastMessage"]);
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], lastBlock + ".elements.value", "0", ["lastMessage"]);
            } else {
                var buttonValue = listOfUsers + " " + headlineLeftFieldSplitted.splice(0, 4) + " " + headlineRightFieldSplitted.splice(0, 4) + " " + pushedButton[3];
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], "blocks." + s + ".elements.value", "0", buttonValue);
            }
            console.log(JSON.stringify(payload));
            mod.postToSwaggerAPI(JSON.stringify(payload), "/updateOverflow");
        }
    }
}

function handleMessage(taskid, pushedButton, msg) {
    var arrayOfVariables = {};
    var variableInformation = taskid[3].split(',');
    arrayOfVariables["nameVariable"] = [];
    arrayOfVariables["variable"] = [];
    if (msg != undefined) {
        for (i = 1; i <= variableInformation.length; i++) {                  
            arrayOfVariables = (mod.pushSpecificVariables(arrayOfVariables, "variable", variableInformation[i - 1], msg, true)); // callbackId[3] = "variable1,variable2,..." e.g. "three,user,user.name"
            arrayOfVariables["nameVariable"].push(variableInformation[i - 1]);
            if (typeof pushedButton != "undefined") {
                arrayOfVariables["variable"].splice(i - 1, 1, pushedButton + "," + arrayOfVariables["variable"]);
            }
        }
    } else {
        arrayOfVariables["variable"].push("NoVariable");
        arrayOfVariables["nameVariable"].push(variableInformation[0]);
    }
    var path = "/camunda/sendMessage/"
    arrayOfVariables["correlationKey"] = taskid[1];  //callbackId[1] = correlationKeys, look at camundaSendMessage for further Informations
    arrayOfVariables["message"] = taskid[2];        //callbackId[2] = the message name in the camunda process
    var payload = JSON.stringify(arrayOfVariables);
    mod.postToSwaggerAPI(payload, path);
}

function handleDialog(taskid, msg) {
    var arrayOfVariables = {};
    var variablesForDialog = taskid[2].split(',');                  //callbackId[2] = first dialog element e.g. "textelement"
    arrayOfVariables["triggerId"] = msg.trigger_id;
    var callbackId = taskid[3].split(',');
    if (callbackId[0] == "message") {
        callbackId[1] += "," + callbackId[2] + "," + callbackId[3] + "," + callbackId[4];
        callbackId[2] = callbackId[5];
        callbackId[3] = callbackId[6];
        var i;
        for (i = 7; i < callbackId.length; i++) {
            callbackId[3] += "," + callbackId[i];
        }
        callbackId.splice(4, 3 + (i - 7));
        callbackId.push(msg.message_ts);
    }
    arrayOfVariables["callbackId"] = callbackId.join(' ');                     //callbackId[3] = new Callback ID
    arrayOfVariables["title"] = variablesForDialog[0];            //then necessary variables
    arrayOfVariables["label"] = [];
    arrayOfVariables["name"] = [];
    arrayOfVariables["type"] = [];
    arrayOfVariables["placeholder"] = [];
    arrayOfVariables["options"] = [];
    arrayOfVariables["data_source"] = [];
    for (var i = 1; i < variablesForDialog.length; i = i + 4) {
        arrayOfVariables["label"].push(variablesForDialog[i]);
        arrayOfVariables["name"].push(variablesForDialog[i + 1]);
        arrayOfVariables["type"].push(variablesForDialog[i + 2]);
        arrayOfVariables["placeholder"].push(variablesForDialog[i + 3]);
        if (variablesForDialog[i + 4] == "options" && variablesForDialog[i + 2] == "select") {
            arrayOfVariables["options"].push(variablesForDialog[i + 5]);
            i = i + 2
        } else {
            arrayOfVariables["options"].push("undefined");
        }
        if (variablesForDialog[i + 4] == "data_source" && variablesForDialog[i + 2] == "select") {
            arrayOfVariables["data_source"].push(variablesForDialog[i + 5]);
            i = i + 2
        } else {
            arrayOfVariables["data_source"].push("undefined");
        } 
    }
    if (arrayOfVariables["options"] == []) {
        
    } else if (arrayOfVariables["data_source"] == []) {
        
    }
    mod.postToSwaggerAPI(JSON.stringify(arrayOfVariables), "/startDialog");
}

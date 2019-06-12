var mod = require('./modules');
const CAMUNDA_CONFIG = require('./camundaConfig');
var callback = function postCallback(body, resolve, reject) {
    try {
        var bodyParsed = JSON.parse(body);
        resolve(bodyParsed);
    } catch (e) {
        console.log("ERROR callback: " + e);
        console.log("Body: " + body);
        console.log(JSON.stringify(body));
    }
};

module.exports = {
    slackReceive: slackReceive
};

function slackReceive(req, res) {                  //receive Slack POSTs after invoked action                                

    var msg = JSON.parse(req.swagger.params.payload.value); //get POST-Body and define Variables
    console.log(msg);
    var taskId = [];
    var pushedButton; 
    var actionValue = 0;                          //amount of given select options
    var dialogNumber;
    
    if (msg.type == "interactive_message") {
        taskId = msg.callback_id.split(CAMUNDA_CONFIG.taskIdSplit);
        pushedButton = msg.actions[0].value;
    } else if (msg.type == "dialog_submission") {
        taskId = msg.callback_id.split(CAMUNDA_CONFIG.taskIdSplit);
        for (dialogNumber = 0; dialogNumber < 5; dialogNumber++) {
            if (typeof msg.submission[dialogNumber] != "undefined") {
                pushedButton = msg.submission[dialogNumber]; 
                break;
            }      
        }
    } else if (msg.type == "block_actions") {                    //block element action
        taskId = msg.actions[0].block_id.split(CAMUNDA_CONFIG.taskIdSplit);          
        var actionId = msg.actions[0].action_id.split(CAMUNDA_CONFIG.actionIdSplit);  
        msg.actions[0].action_id = actionId.splice(0, 1).toString();
        if (msg.actions[0].type == "static_select" || msg.actions[0].type == "overflow") {           //overflow menu or static select menu
            pushedButton = msg.actions[0].selected_option.value;
            actionValue = parseInt(pushedButton, 10);
        } else if (msg.actions[0].type == "button") {                                     // button
            pushedButton = msg.actions[0].value.split(CAMUNDA_CONFIG.actionIdSplit);
        } else if (msg.actions[0].type == "users_select") {                              //select menu: user
            pushedButton = msg.actions[0].selected_user;
        } else if (msg.actions[0].type == "channels_select") {                           //select menu: channel
            pushedButton = msg.actions[0].selected_channel;
        } else if (msg.actions[0].type == "conversations_select") {                      //select menu: conversations
            pushedButton = msg.actions[0].selected_conversation;
        } else if (msg.actions[0].type == "datepicker") {                                //date picker
            pushedButton = msg.actions[0].selected_date;
        } else {throw ERROR}   
    } else {
        taskId[0] = "noAction";
    }

    
    //call function depending on callback_id
    if (taskId[0] == "message") {            //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...    
        if (msg.type == "dialog_submission") {
            handleMessage(taskId, pushedButton, msg, dialogNumber);
            res.status(200).type('application/json').end();
            if (taskId[4] == "delete") {
                var updateMsg = {};
                updateMsg["channel"] = msg.channel.id;
                updateMsg["text"] = "Deine Nachricht ist angekommen:";
                for (x in msg.submission) {
                    updateMsg["text"] += " " + msg.submission[x];
                }
                updateMsg["ts"] = taskId[taskId.length - 1];
                console.log(updateMsg);
                mod.postToSwaggerAPI(updateMsg, "/chat/update", callback);
            }
        } else {
            handleMessage(taskId, pushedButton, msg);
            res.json(CAMUNDA_CONFIG.basicResponse);
        }
    } else if (taskId[0] == "dialog") {   //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...
        if (pushedButton == taskId[1]) {  //callbackId[1] = open Dialog when pushed Button = e.g. "0"
            handleDialog(taskId, msg);
            res.status(200).type('application/json').end();
        } else if (pushedButton != taskId[1]) {
            var callbackId = [];
            for (var i = 0; i < 5; i++) {
                if (taskId[3 + i] != "undefined") {
                    callbackId.push(taskId[3 + i]);
                }         
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
        if (taskId[0] == "dialog") {
            //empty
        } else if (msg.actions[0].type != "button" && actionId[1] != "") {                           //If action type != button && actionId (=changes) != empty
            payload["channel"] = msg.container.channel_id;
            payload["ts"] = msg.container.message_ts;
            payload["blocks"] = msg.message.blocks;                     //set necessary variables, old message body placed in payload["blocks"]

            var changes = actionId;
            var recentChanges = changes[actionValue].split(CAMUNDA_CONFIG.propertiesSplit);    //changes depending on selected_options for activated block
            if (recentChanges[0] == "") {
                recentChanges[0] = taskId[taskId.length - 1]
            } else {
                recentChanges.unshift(taskId[taskId.length - 1]);
            }
            recentChanges[0] = parseInt(recentChanges[0], 10) * 2 + 2;
            changes[actionValue] = recentChanges.join(CAMUNDA_CONFIG.propertiesSplit);
            changes[(actionValue + changes.length / 2)]
            try {
                changes[(actionValue + changes.length / 2)] = JSON.parse(changes[(actionValue + changes.length / 2)]);    //parses changes if possible
            } catch (e) { console.log(e); }
            console.log(changes[(actionValue + changes.length / 2)]);
            payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], changes[actionValue], (actionValue + changes.length / 2).toString(), changes);  //push changes in old message body
            console.log(payload["blocks"]);
            payload["blocks"] = JSON.stringify(payload["blocks"]);
            mod.postToSwaggerAPI(payload, "/chat/update/block", callback);
        } else if (pushedButton[0] == "lastMessage") {
            payload = {
                "channel": msg.channel.id,
                "ts": msg.container.message_ts
            };
            console.log(payload);
            mod.postToSwaggerAPI(payload, "/chat/delete", callback);
        } else if (msg.actions[0].type == "button") {
            payload["channel"] = msg.container.channel_id;
            payload["ts"] = msg.container.message_ts;
            payload["blocks"] = msg.message.blocks;
            var leftField = pushedButton[1].split(CAMUNDA_CONFIG.leftFieldSplit);
            var rightField = pushedButton[2].split(CAMUNDA_CONFIG.rightFieldSplit);
            var textOptionsArray = pushedButton[3].split(CAMUNDA_CONFIG.textOptionsOuterSplit);
            var message = pushedButton[4] + CAMUNDA_CONFIG.taskIdSplit + pushedButton[5] + CAMUNDA_CONFIG.message + pushedButton[6] + CAMUNDA_CONFIG.message + pushedButton[7];
            var lengthOfFields = leftField.length / 2;
            if (lengthOfFields > 4) {
                lengthOfFields = 4;
            }
            var lengthOfRightFields = rightField.length / 2;
            if (lengthOfRightFields > 4) {
                lengthOfRightFields = 4;
            }
            var types = [];
            for (var i = 0; i < lengthOfFields; i++) {
                types.push(leftField[i]);
                leftField.splice(i, 1);
            }
            var ifDialog = [];
            for (var i = 0; i < lengthOfRightFields; i += 2) {
                var dialog = rightField[i].split(CAMUNDA_CONFIG.dialogInTaskIdSplit).join(CAMUNDA_CONFIG.taskIdSplit);
                ifDialog.push(dialog);
                rightField.splice(i, 1);
            }

            var actionsLeft = leftField.length;
            if (actionsLeft > 4) {
                actionsLeft = 4;
            }
            var leftFieldArray = leftField.splice(0, 4);
            var rightFieldArray = rightField.splice(0, 4);
            var stringForActionIdArray = pushedButton[0].split(CAMUNDA_CONFIG.actionIdSplit);
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
                if (types[i] == "overflow") {
                    textOptionsArray[0] = parseInt(textOptionsArray[0], 10)
                    if (textOptionsArray[0] > 0) {
                        payload["blocks"][s].accessory.options = textOptionsArray[1];
                        textOptionsArray[0] -= 1;
                        if (textOptionsArray[0] == 0) {
                            textOptionsArray.splice(0, 2);
                        }
                    } else if (textOptionsArray[0] == -1) {
                        payload["blocks"][s].accessory.options = textOptionsArray[1];
                    }
                    textOptionsArray[0] = textOptionsArray[0].toString();
                    try {
                        payload["blocks"][s].fields[0].text = leftFieldArray[i];
                        payload["blocks"][s].fields[1].text = rightFieldArray[i];
                    } catch (e) {
                        payload["blocks"][s].fields = [
                            {
                                "type": "mrkdwn",
                                "text": leftFieldArray[i]
                            }, {
                                "type": "mrkdwn",
                                "text": rightFieldArray[i]
                            }];
                    }
                } else {
                    try {
                        msg["textOptions"].push("undefined");
                        delete payload["blocks"][s].accessory.options;
                        delete payload["blocks"][s].fields;
                    } catch (e) { console.log(e); }
                    payload["blocks"][s].text = { "type": "mrkdwn", "text": leftFieldArray[i] };
                    payload["blocks"][s].accessory.confirm = {
                        "title": {
                            "type": "plain_text",
                            "text": "Bestaetigung"
                        },
                        "text": {
                            "type": "mrkdwn",
                            "text": "Bist du dir sicher?"
                        },
                        "confirm": {
                            "type": "plain_text",
                            "text": "Ja"
                        },
                        "deny": {
                            "type": "plain_text",
                            "text": "Nein"
                        }
                    };
                    payload["blocks"][s].text.text = leftFieldArray[i];
                }
                if (ifDialog[i] != "false") {
                    payload["blocks"][s][block_id] = ifDialog[i] + CAMUNDA_CONFIG.taskIdSplit + message + CAMUNDA_CONFIG.taskIdSplit + taskId[taskId.length - 1];
                } else {
                    payload["blocks"][s][block_id] = message + CAMUNDA_CONFIG.taskIdSplit + taskId[taskId.length - 1];
                }
                payload["blocks"][s].accessory.action_id = stringForActionIdArray[i];
                payload["blocks"][s].accessory.type = types[i]; 
                if (i == 3) {
                    break;
                }
            }
            stringForActionIdArray.splice(0, 4);
            if (leftFieldArray.length == 0) {
                payload["blocks"][lastBlock].elements[0].text.text = "Abschicken";
                payload["blocks"][lastBlock].elements[0].action_id = "lastMessage";
                payload["blocks"][lastBlock].elements[0].value = "lastMessage";
            } else {
                var buttonValue = stringForActionIdArray + CAMUNDA_CONFIG.taskIdSplit + leftFieldArray.join(CAMUNDA_CONFIG.leftFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + rightFieldArray.join(CAMUNDA_CONFIG.rightFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + textOptionsArray.join(CAMUNDA_CONFIG.textOptionsOuterSplit) + CAMUNDA_CONFIG.taskIdSplit + message;
                payload["blocks"][s].elements.value = buttonValue[0];
            }
            payload["blocks"] = JSON.stringify(payload["blocks"]);
            console.log(JSON.stringify(payload));
            mod.postToSwaggerAPI(payload, "/chat/update/block", callback);
        }
    }
}

function handleMessage(taskid, pushedButton, msg, dialogNumber) {
    var arrayOfVariables = {};
    var variableInformation = taskid[3].split(CAMUNDA_CONFIG.camundaMessageVariablesSplit);
    arrayOfVariables["nameVariable"] = [];
    arrayOfVariables["variable"] = [];
    if (msg != undefined) {
        for (i = 1; i <= variableInformation.length; i++) {                  
            try {
                arrayOfVariables = (mod.pushSpecificVariables(arrayOfVariables, "variable", variableInformation[i - 1], msg, true)); // callbackId[3] = "variable1,variable2,..." e.g. "three,user,user.name"
                arrayOfVariables["nameVariable"].push(variableInformation[i - 1]);
                if (typeof pushedButton != "undefined") {
                    arrayOfVariables["variable"].splice(i - 1, 1, pushedButton + CAMUNDA_CONFIG.camundaMessageVariableSplit + arrayOfVariables["variable"]);
                }
            } catch (e) {
                arrayOfVariables["variable"].push(pushedButton + CAMUNDA_CONFIG.camundaMessageVariableSplit + dialogNumber);
                arrayOfVariables["nameVariable"].push(variableInformation[i - 1]);
            }
        }
    } else {
        arrayOfVariables["variable"].push("NoVariable");
        arrayOfVariables["nameVariable"].push(variableInformation[0]);
    }
    var path = "/camunda/sendMessage/"
    arrayOfVariables["correlationKey"] = taskid[1];  //callbackId[1] = correlationKeys, look at camundaSendMessage for further Informations
    arrayOfVariables["message"] = taskid[2];        //callbackId[2] = the message name in the camunda process
    console.log(arrayOfVariables);
    mod.postToSwaggerAPI(arrayOfVariables, path, callback);
}

function handleDialog(taskid, msg) {
    var arrayOfVariables = {};
    var variablesForDialog = taskid[2].split(CAMUNDA_CONFIG.dialogVariablesSplit);                  //callbackId[2] = first dialog element e.g. "text"
    arrayOfVariables["triggerId"] = msg.trigger_id;
    var callbackId = [];
    for (var i = 0; i < 4; i++) {
        callbackId.push(taskid[3 + i]);
    }
    callbackId.push(msg.message_ts);
    arrayOfVariables["callbackId"] = callbackId.join(CAMUNDA_CONFIG.taskIdSplit);                     //callbackId[3] = new Callback ID
    arrayOfVariables["title"] = variablesForDialog[0];            //then necessary variables
    arrayOfVariables["label"] = [];
    arrayOfVariables["type"] = [];
    arrayOfVariables["placeholder"] = [];
    arrayOfVariables["options"] = [];
    arrayOfVariables["data_source"] = [];
    for (var i = 1; i < variablesForDialog.length; i = i + 4) {
        arrayOfVariables["label"].push(variablesForDialog[i]);
        arrayOfVariables["type"].push(variablesForDialog[i + 1]);
        arrayOfVariables["placeholder"].push(variablesForDialog[i + 2]);
        if (variablesForDialog[i + 3] == "options" && variablesForDialog[i + 1] == "select") {
            arrayOfVariables["options"].push(variablesForDialog[i + 4]);
            i = i + 2
        } else {
            arrayOfVariables["options"].push("undefined");
        }
        if (variablesForDialog[i + 3] == "data_source" && variablesForDialog[i + 1] == "select") {
            arrayOfVariables["data_source"].push(variablesForDialog[i + 4]);
            i = i + 2
        } else {
            arrayOfVariables["data_source"].push("undefined");
        } 
    }
    if (arrayOfVariables["options"] == []) {
                                                                                                                         //sth. missing!!!
    } else if (arrayOfVariables["data_source"] == []) {
        
    }
    mod.postToSwaggerAPI(arrayOfVariables, "/dialog/open", callback);
}

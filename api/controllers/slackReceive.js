var mod = require('./modules');
const CAMUNDA_CONFIG = require('./camundaConfig');
var basicCallback = function postCallback(body, resolve, reject) {
    try {
        var bodyParsed = JSON.parse(body);
        resolve(bodyParsed);
    } catch (e) {
        console.log("ERROR callback: " + e);
        console.log("Body: " + body);
        console.log(JSON.stringify(body));
    }
};
var statusCodeCallback = function postCallback(body, resolve, reject) {
    try {
        var bodyParsed = JSON.parse(body);
        resolve(bodyParsed.statusCode);
    } catch (e) {
        console.log("ERROR callback: " + e);
        console.log("Body: " + body);
        console.log(JSON.stringify(body));
    }
};

module.exports = {
    slackReceive: slackReceive
};

async function slackReceive(req, res) {                  //receive Slack POSTs after invoked action                                

    var msg = JSON.parse(req.swagger.params.payload.value); //get POST-Body and define Variables
    console.log(msg);
    var taskId = [];
    var pushedButton;
    var actionValue = 0;                          //amount of given select options

    if (msg.type == "interactive_message") {
        callbackIdParsed = msg.callback_id.split('amp;').join('');
        taskId = callbackIdParsed.split(CAMUNDA_CONFIG.taskIdSplit);
        pushedButton = msg.actions[0].value;
    } else if (msg.type == "dialog_submission") {
        taskId = msg.callback_id.split(CAMUNDA_CONFIG.taskIdSplit);
        var pushedButton = [];
        var dialogNumberArray = [];
        for (var dialogNumber = 0; dialogNumber < 5; dialogNumber++) {
            if (typeof msg.submission[dialogNumber] != "undefined") {
                pushedButton.push(msg.submission[dialogNumber]);
                dialogNumberArray.push(dialogNumber.toString());
            }
        }
    } else if (msg.type == "block_actions") {                    //block element action
        taskId = msg.actions[0].block_id.split(CAMUNDA_CONFIG.taskIdSplit);
        var actionId = msg.actions[0].action_id.split(CAMUNDA_CONFIG.actionIdOuterSplit);
        var variableCheck = actionId[0].split(CAMUNDA_CONFIG.actionIdInnerSplit);
        if (typeof variableCheck[1] == "undefined") {
            msg.actions[0].action_id = variableCheck[0];
        } else {
            msg.actions[0].action_id = variableCheck[1];
        }
        actionId.splice(0, 1).toString();
        if (msg.actions[0].type == "static_select" || msg.actions[0].type == "overflow") {           //overflow menu or static select menu
            pushedButton = msg.actions[0].selected_option.text.text;
            actionValue = parseInt(msg.actions[0].selected_option.value, 10);
        } else if (msg.actions[0].type == "button") {                                     // button
            pushedButton = msg.actions[0].value.split(CAMUNDA_CONFIG.taskIdSplit);
        } else if (msg.actions[0].type == "users_select") {                              //select menu: user
            pushedButton = msg.actions[0].selected_user;
        } else if (msg.actions[0].type == "channels_select") {                           //select menu: channel
            pushedButton = msg.actions[0].selected_channel;
        } else if (msg.actions[0].type == "conversations_select") {                      //select menu: conversations
            pushedButton = msg.actions[0].selected_conversation;
        } else if (msg.actions[0].type == "datepicker") {                                //date picker
            pushedButton = msg.actions[0].selected_date;
        } else { throw ERROR }
    } else {
        taskId[0] = "noAction";
    }
    //call function depending on callback_id
    
    if (taskId[0] == "message") {            //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...    
        if (msg.type == "dialog_submission") {
            handleMessage(taskId, pushedButton, msg, dialogNumberArray);
            res.status(200).type('application/json').end();
            if (taskId[4] == "delete") {                   //update message with confirmation text
                var updateMsg = { "channel": msg.channel.id, "text": "Deine Nachricht ist angekommen:", "ts": taskId[taskId.length - 1]};
                for (x in msg.submission) {
                    updateMsg["text"] += " " + msg.submission[x];
                }
                mod.postToSwaggerAPI(updateMsg, "/chat/update", basicCallback);
            }
        } else {
            if (msg.actions[0].action_id == "lastMessage") {
                await testIfVariablesSent(taskId[1], msg, function (taskId, pushedButton, msg) {
                    handleMessage(taskId, pushedButton, msg);
                    pushedButton[0] == "undefined";
                });
            } else if (msg.actions[0].action_id == "nextPage") {
            } else {
                handleMessage(taskId, pushedButton, msg);
            }   
            res.json(CAMUNDA_CONFIG.basicResponse);
        }
    } else if (taskId[0] == "dialog") {   //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...
        if (pushedButton == taskId[1]) {  //callbackId[1] = open Dialog when pushed Button = e.g. "0"
            handleDialog(taskId, msg, msg.actions[0].action_id);
            res.status(200).type('application/json').end();
        } else if (pushedButton != taskId[1]) {
            var callbackId = [];
            for (var i = 0; i < 5; i++) {
                if (typeof taskId[3 + i] != "undefined") {
                    callbackId.push(taskId[3 + i]);
                }         
            }
            handleMessage(callbackId, pushedButton, msg);
            res.status(200).type('application/json').end();
        } else {console.log("ERROR Dialog");} 
    } else { console.log("Weder Nachricht noch Dialog"); }

    if (msg.type == "block_actions") {
        var payload = { "channel": msg.container.channel_id, "ts": msg.container.message_ts, "blocks": msg.message.blocks }             //set variables; old message body placed in "blocks"
        if (msg.actions[0].type != "button" && actionId[0] != "") {                           //If action type != button && actionId (=changes) != empty -> handle changes
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
            } catch (e) { }
            payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], changes[actionValue], (actionValue + changes.length / 2).toString(), changes);  //push changes in old message body
            console.log(payload["blocks"]);
            payload["blocks"] = JSON.stringify(payload["blocks"]);
            mod.postToSwaggerAPI(payload, "/chat/update/block", basicCallback);
        } else if (msg.actions[0].action_id == "lastMessage") {                 //when user pushed Button "Abschicken"
            var payload = { "channel": msg.channel.id, "ts": msg.container.message_ts };
            mod.postToSwaggerAPI(payload, "/chat/delete", basicCallback);
        } else if (msg.actions[0].action_id == "nextPage") {    //load nextPage
            await testIfVariablesSent(taskId[1], msg, nextPage(payload, pushedButton, 4));
        }
    }
}

function handleMessage(taskid, pushedButton, msg, dialogNumberArray) {
    var arrayOfVariables = {};
    var variableInformation = taskid[3].split(CAMUNDA_CONFIG.camundaMessageVariablesSplit);
    arrayOfVariables["nameVariable"] = [];
    arrayOfVariables["variable"] = [];
    console.log(msg);
    if (msg != undefined) {
        for (i = 1; i <= variableInformation.length; i++) {
            try {
                arrayOfVariables = (mod.pushSpecificVariables(arrayOfVariables, "variable", variableInformation[i - 1], msg, true)); // callbackId[3] = "variable1,variable2,..." e.g. "three,user,user.name"
                arrayOfVariables["nameVariable"].push(variableInformation[i - 1]);
                if (typeof pushedButton != "undefined") {
                    arrayOfVariables["variable"].splice(i - 1, 1, pushedButton + CAMUNDA_CONFIG.camundaMessageVariableSplit + arrayOfVariables["variable"]);
                }
            } catch (e) {
                if (typeof dialogNumberArray != "undefined") {
                    arrayOfVariables["variable"].push(taskid[taskid.length - 1] + CAMUNDA_CONFIG.camundaMessageVariableSplit + dialogNumberArray.join(CAMUNDA_CONFIG.camundaMessageVariableSplit));
                    arrayOfVariables["nameVariable"].push(variableInformation[i - 1]);
                    for (var i = 0; i < pushedButton.length; i++) {
                        arrayOfVariables["variable"].push(pushedButton[i]);
                        arrayOfVariables["nameVariable"].push(dialogNumberArray[i]);
                    }
                } else {
                    arrayOfVariables["variable"].push(pushedButton + CAMUNDA_CONFIG.camundaMessageVariableSplit);
                    arrayOfVariables["nameVariable"].push(variableInformation[i - 1]);
                }        
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
    mod.postToSwaggerAPI(arrayOfVariables, path, basicCallback);
}

function handleDialog(taskid, msg, actionId) {
    var arrayOfVariables = {};
    var variablesForDialog = taskid[2].split(CAMUNDA_CONFIG.dialogVariablesSplit);                  //callbackId[2] = first dialog element e.g. "text"
    
    var callbackId = [];
    for (var i = 0; i < 4; i++) {
        callbackId.push(taskid[3 + i]);
    }
    try {
        callbackId.push(msg.container.message_ts);
    } catch (e) {
        callbackId.push(msg.message_ts);
    }
    if (typeof actionId != "undefined") {
        callbackId.push(actionId);
    }
    //callbackId[3] = new Callback ID
    arrayOfVariables = {
        "callbackId": callbackId.join(CAMUNDA_CONFIG.taskIdSplit), "triggerId": msg.trigger_id, "minLength": [],
        "maxLength": [], "title": variablesForDialog[0], "label": [], "type": [], "placeholder": [], "options": [], "data_source": []
    };
    for (var i = 1; i < variablesForDialog.length; i = i + 5) {
        arrayOfVariables["label"].push(variablesForDialog[i]);
        arrayOfVariables["type"].push(variablesForDialog[i + 1]);
        arrayOfVariables["placeholder"].push(variablesForDialog[i + 2]);
        arrayOfVariables["minLength"].push(variablesForDialog[i + 3]);
        arrayOfVariables["maxLength"].push(variablesForDialog[i + 4]);
        if (variablesForDialog[i + 5] == "options" && variablesForDialog[i + 1] == "select") {
            arrayOfVariables["options"].push(variablesForDialog[i + 6]);
            i = i + 2
        } else {
            arrayOfVariables["options"].push("undefined");
        }
        if (variablesForDialog[i + 5] == "data_source" && variablesForDialog[i + 1] == "select") {
            arrayOfVariables["data_source"].push(variablesForDialog[i + 6]);
            i = i + 2
        } else {
            arrayOfVariables["data_source"].push("undefined");
        } 
    }
    mod.postToSwaggerAPI(arrayOfVariables, "/dialog/open", basicCallback);
}

async function testIfVariablesSent(correlationKeys, msg, callback) {
    var payload = {};
    payload["channel"] = msg.container.channel_id;
    payload["ts"] = msg.container.message_ts;
    payload["blocks"] = msg.message.blocks;                     //set necessary variables, old message body placed in payload["blocks"]
    var responseObject = await mod.postToSwaggerAPI({ "correlationKey": correlationKeys }, "/camunda/instance/getId", basicCallback);  //get camundaInstanceId
    for (var i = 2; i < msg.message.blocks.length - 1; i += 2) {
        var blockActionId = msg.message.blocks[i].accessory.action_id.split(CAMUNDA_CONFIG.actionIdOuterSplit);
        var blockActionIdArray = blockActionId[0].split(CAMUNDA_CONFIG.actionIdInnerSplit);
        if (blockActionIdArray[0] == "true") {
            if (await mod.postToSwaggerAPI({ "instanceId": responseObject[0].id, "variableName": blockActionIdArray[1] }, "/camunda/instance/variable/get", statusCodeCallback) == "200") {
                payload.blocks.splice(i, 2);;
            }
        }
    }
    console.log(msg.message.blocks.length);
    if (msg.message.blocks.length > 3) {
        nextPage(payload, msg.actions[0].value.split(CAMUNDA_CONFIG.taskIdSplit), 4 - (payload.blocks.length - 3) / 2 );
    } else {
        callback();
    }
}

function nextPage(payload, pushedButton, numberOfChanges) {
    console.log(numberOfChanges);
    var leftField = pushedButton[1].split(CAMUNDA_CONFIG.leftFieldSplit);
    var rightField = pushedButton[2].split(CAMUNDA_CONFIG.rightFieldSplit);
    var textOptionsArray = pushedButton[3].split(CAMUNDA_CONFIG.textOptionsOuterSplit);
    var message = pushedButton[5] + CAMUNDA_CONFIG.taskIdSplit + pushedButton[6] + CAMUNDA_CONFIG.message + pushedButton[7] + CAMUNDA_CONFIG.message + pushedButton[8];
    var actionsLeft = leftField.length / 2;
    if (actionsLeft > numberOfChanges) {
        actionsLeft = numberOfChanges;
    }
    var typeArray = [];
    var confirm = [];
    for (var i = 0; i < actionsLeft; i++) {
        var type = leftField[i].split(CAMUNDA_CONFIG.confirmSplit);
        typeArray.push(type[0]);
        confirm.push(type[1]); 
        leftField.splice(i, 1);
    }
    var ifDialog = [];
    for (var i = 0; i < actionsLeft; i += 2) {
        var dialog = rightField[i].split(CAMUNDA_CONFIG.dialogInTaskIdSplit).join(CAMUNDA_CONFIG.taskIdSplit);
        ifDialog.push(dialog);
        rightField.splice(i, 1);
    }

    
    var leftFieldArray = leftField.splice(0, numberOfChanges);
    var rightFieldArray = rightField.splice(0, numberOfChanges);
    var actionIdArray = pushedButton[0].split(CAMUNDA_CONFIG.actionIdOuterSplit);
    var lastBlock = actionsLeft * 2 + 2;
    if (actionsLeft == 3) {
        payload["blocks"].splice(7, 2);
    } else if (actionsLeft == 2) {
        payload["blocks"].splice(5, 4);
    } else if (actionsLeft == 1) {
        payload["blocks"].splice(3, 6);
    }
    for (var i = 0; i < actionsLeft; i++) {
        var s = (i + 5 - numberOfChanges) * 2;
        if (typeArray[i] == "overflow" || typeArray[i] == "static_select") {
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
        }
        if (rightField[i] != "") {
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
                delete payload["blocks"][s].accessory.options;
                delete payload["blocks"][s].fields;
            } catch (e) { console.log(e); }
            payload["blocks"][s].text = { "type": "mrkdwn", "text": leftFieldArray[i] };
            if (confirm[i] == "true") {
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
            }          
            payload["blocks"][s].text.text = leftFieldArray[i];
        }
        console.log(ifDialog);
        console.log(s);
        console.log(JSON.stringify(payload["blocks"]));
        if (ifDialog[i] != "false") {
            payload["blocks"][s][block_id] = ifDialog[i] + CAMUNDA_CONFIG.taskIdSplit + message + CAMUNDA_CONFIG.taskIdSplit + taskId[taskId.length - 1];
        } else {
            payload["blocks"][s][block_id] = message + CAMUNDA_CONFIG.taskIdSplit + taskId[taskId.length - 1];
        }
        payload["blocks"][s].accessory.action_id = actionIdArray[i];
        payload["blocks"][s].accessory.type = typeArray[i];
    }
    actionIdArray.splice(0, 4);
    var buttonNameArray = pushedButton[4].split(CAMUNDA_CONFIG.buttonNameSplit);
    var lastElement = buttonNameArray.length - 1;
    if (leftFieldArray.length == 0) {
        payload["blocks"][lastBlock].elements[lastElement].text.text = "Abschicken";
        payload["blocks"][lastBlock].elements[lastElement].action_id = "lastMessage";
        payload["blocks"][lastBlock].elements[lastElement].value = "lastMessage";
    } else {
        var textOptions;
        try {
            textOptions = textOptionsArray.join(textOptionsOuterSplit);
        } catch (e) {
            textOptions = "empty";
        }
        var buttonValue = actionIdArray + CAMUNDA_CONFIG.taskIdSplit + leftFieldArray.join(CAMUNDA_CONFIG.leftFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + rightFieldArray.join(CAMUNDA_CONFIG.rightFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + textOptions + CAMUNDA_CONFIG.taskIdSplit + message;
        payload["blocks"][s].elements[lastElement].value = buttonValue[0];
    }
    payload["blocks"] = JSON.stringify(payload["blocks"]);
    console.log(JSON.stringify(payload));
    mod.postToSwaggerAPI(payload, "/chat/update/block", basicCallback);
}
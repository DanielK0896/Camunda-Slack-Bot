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
        console.log("Status: " + bodyParsed.statusCode);
        resolve(bodyParsed.statusCode);
    } catch (e) {
        console.log("ERROR callback: " + e);
        console.log("Body: " + body);
        console.log("Body String: " + JSON.stringify(body));
        reject();
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
        pushedButton = [];
        for (var dialogNumber = 0; dialogNumber < 5; dialogNumber++) {
            if (typeof msg.submission[dialogNumber] != "undefined") {
                pushedButton.push(msg.submission[dialogNumber]);
            }
        }
    } else if (msg.type == "block_actions") {                    //block element action
        taskId = msg.actions[0].block_id.split(CAMUNDA_CONFIG.taskIdSplit);
        var changesInActionId = msg.actions[0].action_id.split(CAMUNDA_CONFIG.actionIdOuterSplit);
        console.log(changesInActionId);
        var actionId = changesInActionId[0].split(CAMUNDA_CONFIG.actionIdInnerSplit);
        console.log(actionId);
        if (actionId[1] == "") {
            msg.actions[0].action_id = actionId[0];
        } else {
            console.log(actionId[1]);
            msg.actions[0].action_id = actionId[1];
            for (var i = 2; i < actionId.length; i++) {
                msg.actions[0].action_id += CAMUNDA_CONFIG.camundaMessageVariablesSplit + actionId[i];
            }
        }
        changesInActionId.splice(0, 1);
        console.log(changesInActionId);
        console.log(actionId);
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
            if(await handleMessage(taskId, pushedButton, msg) == "204") {
                res.status(200).type('application/json').end();
                if (taskId[4] == "delete") {                   //update message with confirmation text
                    var updateMsg = { "channel": msg.channel.id, "text": "Deine Nachricht ist angekommen:", "ts": taskId[taskId.length - 1]};
                    console.log(updateMsg);
                    for (x in msg.submission) {
                        updateMsg["text"] += " " + msg.submission[x];
                    }
                    console.log(updateMsg);
                    mod.postToSwaggerAPI(updateMsg, "/chat/update", basicCallback);
                }
            }
        } else {
            var responseCode;
            if(taskId[3] == "") {
                taskId[3] = msg.actions[0].action_id;
            }
            if (msg.actions[0].action_id == "lastMessage") {
                responseCode = await testIfVariablesSent(taskId, taskId[1], msg, async function (taskId, pushedButton, msg) {
                    var responseCode = await handleMessage(taskId, pushedButton, msg);
                    pushedButton[0] == "undefined";
                    var payload = { "channel": msg.channel.id, "ts": msg.container.message_ts };
                    mod.postToSwaggerAPI(payload, "/chat/delete", basicCallback);
                    return responseCode;
                }, pushedButton);
            } else if (msg.actions[0].action_id == "nextPage") {
            } else {
                responseCode = await handleMessage(taskId, pushedButton, msg);
            }   
            if(responseCode == "204") {
                res.json(CAMUNDA_CONFIG.basicResponse);
            } else {
                res.json(CAMUNDA_CONFIG.errorResponse);
            }
        }
    } else if (taskId[0] == "dialog") {   //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...
        if (pushedButton == taskId[1]) {  //callbackId[1] = open Dialog when pushed Button = e.g. "0"
            handleDialog(taskId, msg);
            res.status(200).type('application/json').end();
        } else if (pushedButton != taskId[1]) {
            var callbackId = [];
            for (var i = 0; i < 5; i++) {
                if (typeof taskId[3 + i] != "undefined") {
                    callbackId.push(taskId[3 + i]);
                }  
            }    
            if(callbackId[3] == "") {
                callbackId[3] = msg.actions[0].action_id;
            }
            handleMessage(callbackId, pushedButton, msg);
            res.status(200).type('application/json').end();
        } else {console.log("ERROR Dialog");} 
    } else { console.log("Weder Nachricht noch Dialog"); }
    if (msg.type == "block_actions" && msg.actions[0].action_id != "lastMessage") {
        var payload = { "channel": msg.container.channel_id, "ts": msg.container.message_ts, "blocks": msg.message.blocks }
        if (msg.actions[0].action_id == "nextPage") {
            testIfVariablesSent(taskId, taskId[1], msg, function() { nextPage(payload, pushedButton, 4, taskId); });       
        } else if (changesInActionId[1] != "") {                           //If action type != button && actionId (=changes) != empty -> handle changes
            console.log("changesInActionId: " + changesInActionId);
            console.log(actionValue);
            var changes = changesInActionId;
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
            payload.blocks = mod.pushSpecificVariables(payload.blocks, changes[actionValue], (actionValue + changes.length / 2).toString(), changes);  //push changes in old message body
            payload.blocks = JSON.stringify(payload.blocks);
            mod.postToSwaggerAPI(payload, "/chat/update/block", basicCallback);
        }
    }
}

async function handleMessage(taskId, pushedButton, msg) {
    console.log("TASKID: " + taskId)
    console.log(pushedButton);
    var arrayOfVariables = {nameVariable: [], variable: []};
    arrayOfVariables["correlationKey"] = taskId[1];  //callbackId[1] = correlationKeys, look at camundaSendMessage for further Informations
    arrayOfVariables["message"] = taskId[2];        //callbackId[2] = the message name in the camunda process
    var variableInformation = taskId[3].split(CAMUNDA_CONFIG.camundaMessageVariablesSplit); // callbackId[3] = "variable1,variable2,..." e.g. "three,user,user.name"
    console.log("variableInformation: " + variableInformation);
    try {
        for (i = 0; i < variableInformation.length; i++) {
            if(variableInformation[i].split(CAMUNDA_CONFIG.propertiesSplit).length > 1) {
                arrayOfVariables = (mod.pushSpecificVariables(arrayOfVariables, "variable", variableInformation[i], msg, true)); 
                arrayOfVariables.variable[i] += CAMUNDA_CONFIG.camundaMessageVariableSplit + pushedButton;
            } else {
                if(typeof pushedButton == "string") {
                    arrayOfVariables.variable.push(pushedButton);
                } else {
                    arrayOfVariables.variable.push(pushedButton[i]);
                }
                 
            }
            arrayOfVariables.nameVariable.push(variableInformation[i]);
        }
    } catch(e) {
        console.log(e);
        arrayOfVariables.variable.push("NoVariable");
        arrayOfVariables.nameVariable.push(variableInformation[0]);
    }
    console.log(arrayOfVariables);
    return await mod.postToSwaggerAPI(arrayOfVariables, "/camunda/sendMessage/", statusCodeCallback);
}

function handleDialog(taskId, msg) {
    var arrayOfVariables = {};
    var variablesForDialog = taskId[2].split(CAMUNDA_CONFIG.dialogVariablesSplit);                  //callbackId[2] = first dialog element e.g. "text"
    
    var callbackId = [];
    for (var i = 0; i < 4; i++) {
        callbackId.push(taskId[taskId.indexOf("message", 3) + i]);
    }
    console.log(callbackId);
    if(callbackId[3] == "") {
        callbackId[3] = msg.actions[0].action_id;
    }
    if(taskId[taskId.length - 1] == "delete") {
        callbackId.push("delete");
    }
    try {
        callbackId.push(msg.container.message_ts);
    } catch (e) {
        callbackId.push(msg.message_ts);
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

async function testIfVariablesSent(taskId, correlationKeys, msg, callback, variable) {
    var payload = {};
    payload["channel"] = msg.container.channel_id;
    payload["ts"] = msg.container.message_ts;
    payload.blocks = msg.message.blocks;                     //set necessary variables, old message body placed in payload.blocks
    var responseObject = await mod.postToSwaggerAPI({ "correlationKey": correlationKeys }, "/camunda/instance/getId", basicCallback);  //get camundaInstanceId
    var blockActionId = [];
    var blockActionIdArray = [];
    var blocksLength = msg.message.blocks.length;
    for (var i = 2; i < blocksLength - 1; i += 2) {
        blockActionId.push(msg.message.blocks[i].accessory.action_id.split(CAMUNDA_CONFIG.actionIdOuterSplit));
        blockActionIdArray.push(blockActionId[i / 2 - 1][0].split(CAMUNDA_CONFIG.actionIdInnerSplit));
    }
    var pushedButton = msg.actions[0].value.split(CAMUNDA_CONFIG.taskIdSplit);
    try {
        var leftFields = pushedButton[1].split(CAMUNDA_CONFIG.leftFieldSplit);
        var lengthOfLeftFields = leftFields.length / 2;
    } catch(e) {}
    var numberOfChanges = 0;
    var lastBlock = payload.blocks.pop();
    var divider = payload.blocks.pop();
    var maximalLength = 3;
    for (var i = blocksLength - 3; i >= 2; i -= 2) {
        if (blockActionIdArray[i / 2 - 1][0] == "true") {
            if (await mod.postToSwaggerAPI({ "instanceId": responseObject[0].id, "variableName": blockActionIdArray[i / 2 - 1][1] }, "/camunda/instance/variable/get", statusCodeCallback) == "200") {
                if (lengthOfLeftFields > 0) {
                    lengthOfLeftFields -= 1;
                    numberOfChanges += 1;
                    payload.blocks.push(payload.blocks[i + 1]);
                    payload.blocks.push(payload.blocks[i]);
                }
                payload.blocks.splice(i, 2);   
            }
        } else {
            maximalLength += 2;
        }
    }
    payload.blocks.push(divider);
    payload.blocks.push(lastBlock);
    if (msg.message.blocks.length > maximalLength) {
        nextPage(payload, pushedButton, numberOfChanges, taskId);
    } else {
        callback(taskId, variable, msg);
    }
}

function nextPage(payload, pushedButton, numberOfChanges, taskId) {
    console.log(pushedButton);
    if(numberOfChanges > 0) {
        var leftField = pushedButton[1].split(CAMUNDA_CONFIG.leftFieldSplit);
        var rightField = pushedButton[2].split(CAMUNDA_CONFIG.rightFieldSplit);
        
        var textOptionsArray = pushedButton[6].split(CAMUNDA_CONFIG.vspSplit);
        var message = pushedButton[9] + CAMUNDA_CONFIG.taskIdSplit + pushedButton[10] + CAMUNDA_CONFIG.taskIdSplit + pushedButton[11] + CAMUNDA_CONFIG.taskIdSplit + pushedButton[12];
        var actionsLeft = leftField.length;
        if (actionsLeft > numberOfChanges) {
            actionsLeft = numberOfChanges;
        }
        var confirm = [];
        var ifDialog = [];
        var dialog = pushedButton[5].split(CAMUNDA_CONFIG.dialogSplit);
        
        for (var i = 0; i < actionsLeft; i += 2) {
            ifDialog.push(dialog[i].split(CAMUNDA_CONFIG.dialogInTaskIdSplit).join(CAMUNDA_CONFIG.taskIdSplit));
        }
        var leftFieldArray = leftField.splice(0, numberOfChanges);
        var rightFieldArray = rightField.splice(0, numberOfChanges);
        dialog.splice(0, numberOfChanges);
        var actionIdArray = pushedButton[0].split(CAMUNDA_CONFIG.actionIdOuterSplit);
        
        var typeShortened = mod.variableShorteningPrinciple(actionsLeft, pushedButton[4])
        var confirmShortened = mod.variableShorteningPrinciple(actionsLeft, pushedButton[3])

        for (var i = 0; i < actionsLeft; i++) {
            if (numberOfChanges == 4) {
                var s = (i + 1) * 2;
                if (actionsLeft == 3) {
                    payload.blocks.splice(7, 2);
                } else if (actionsLeft == 2) {
                    payload.blocks.splice(5, 4);
                } else if (actionsLeft == 1) {
                    payload.blocks.splice(3, 6);
                }
            } else {
                var s = (payload.blocks.length - 3) - (i * 2);
            }
            if (textOptionsArray[0] != "") {
                if (typeShortened[1][i] == "overflow" || typeShortened[1][i] == "static_select") {
                    var textOptionsShortened = mod.variableShorteningPrinciple(1, textOptionsArray)
                    textOptionsArray = textOptionsShortened[0];            
                    payload.blocks[s].accessory.options = textOptionsShortened[1];
                    var textOptions = textOptionsArray.join(CAMUNDA_CONFIG.vspSplit);
                }
            } else {
                textOptions = "empty";
            }                
            if (rightFieldArray[i] != "") {
                try {
                    payload.blocks[s].fields[0].text = leftFieldArray[i];
                    payload.blocks[s].fields[1].text = rightFieldArray[i];
                } catch (e) {
                    payload.blocks[s].fields = [
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
                    delete payload.blocks[s].accessory.options;
                    delete payload.blocks[s].fields;
                } catch (e) {}
                payload.blocks[s].text = { "type": "mrkdwn", "text": leftFieldArray[i] };
                if (confirmShortened[1][i] == "t") {
                    payload.blocks[s].accessory.confirm = {
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
                payload.blocks[s].text.text = leftFieldArray[i];
            }    
        if (ifDialog[i] != "f") {
            payload.blocks[s].block_id = ifDialog[i] + CAMUNDA_CONFIG.taskIdSplit + message + CAMUNDA_CONFIG.taskIdSplit + i;
        } else {
            payload.blocks[s].block_id = message + CAMUNDA_CONFIG.taskIdSplit + taskId[taskId.length - 1];
        }
        payload.blocks[s].accessory.type = typeShortened[1][i];
        if (pushedButton[7] != "") {
            var changesShortened = mod.variableShorteningPrinciple(1, pushedButton[7])
            payload.blocks[s].accessory.action_id = actionIdArray[0] + CAMUNDA_CONFIG.actionIdOuterSplit + changesShortened[0]
        } else {
            payload.blocks[s].accessory.action_id = actionIdArray[0] + CAMUNDA_CONFIG.actionIdOuterSplit + ""
        }
        if(typeShortened[1][i] == "button") {
            payload.blocks[s].accessory.text = {
                "type":"plain_text", "text":"Klick", "emoji":true
            };
            payload.blocks[s].accessory.value = "0";
        }
    }
    actionIdArray.splice(0, 4);
    var buttonNameArray = pushedButton[8].split(CAMUNDA_CONFIG.buttonNameSplit);
    var lastElement = buttonNameArray.length -1;
    var lastBlock = payload.blocks.length - 1;
    if (leftField.length == 0) {
        console.log(JSON.stringify(payload));
        payload.blocks[lastBlock].elements[lastElement].text.text = "Abschicken";
        payload.blocks[lastBlock].elements[lastElement].action_id = "lastMessage";
        payload.blocks[lastBlock].elements[lastElement].value = "lastMessage";
    } else {
        var buttonValue = actionIdArray.join(CAMUNDA_CONFIG.actionIdOuterSplit) + CAMUNDA_CONFIG.taskIdSplit + leftFieldArray.join(CAMUNDA_CONFIG.leftFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + rightFieldArray.join(CAMUNDA_CONFIG.rightFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + confirmShortened[0] + CAMUNDA_CONFIG.taskIdSplit + typeShortened[0] + CAMUNDA_CONFIG.taskIdSplit + dialog.join(CAMUNDA_CONFIG.dialogSplit) + CAMUNDA_CONFIG.taskIdSplit + textOptions + CAMUNDA_CONFIG.taskIdSplit + changesArray.join(CAMUNDA_CONFIG.changesOuterSplit) + CAMUNDA_CONFIG.taskIdSplit + message;
        payload.blocks[lastBlock].elements[lastElement].value = buttonValue;
    }
}
    for (var i = 2; i < lastBlock;i+=2) {
        var blockIdArray = payload.blocks[i].block_id.split(CAMUNDA_CONFIG.taskIdSplit);
        blockIdArray.pop();
        payload.blocks[i].block_id = blockIdArray.join(CAMUNDA_CONFIG.taskIdSplit) + CAMUNDA_CONFIG.taskIdSplit + (i / 2 - 1).toString();
    }
    console.log(JSON.stringify(payload.blocks));
    payload.blocks = JSON.stringify(payload.blocks);
    console.log(JSON.stringify(payload));
    mod.postToSwaggerAPI(payload, "/chat/update/block", basicCallback);
}

var mod = require('./modules');
var callback = function postCallback(body, resolve, reject) {
    try {
        var bodyParsed = JSON.parse(body);
        resolve(bodyParsed);
    } catch (e) {
        console.log("ERROR callback: " + e);
        console.log("Body: " + body);
    }
};

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
    var actionValue = 0;                          //amount of given select options
    
    if (msg.type == "interactive_message") {
        taskid = msg.callback_id.split('&%');
        pushedButton = msg.actions[0].value;
    } else if (msg.type == "dialog_submission") {
        taskid = msg.callback_id.split('&%');
        for (var i = 0; i < 5; i++) {
            try {
                pushedButton = msg.submission[0];
            } catch {}
        }
    } else if (msg.type == "block_actions") {                    //block element action
        taskid = msg.actions[0].block_id.split('&%');          
        var actionId = msg.actions[0].action_id.split('&%');  
        msg.actions[0].action_id = actionId.splice(0, 1).toString();
        if (msg.actions[0].type == "static_select" || msg.actions[0].type == "overflow") {           //overflow menu or static select menu
            pushedButton = msg.actions[0].selected_option.value;
            actionValue = parseInt(pushedButton, 10);
        } else if (msg.actions[0].type == "button") {                                     // button
            pushedButton = msg.actions[0].value.split("&%");
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
        taskid[0] = "noAction";
    }

    
    //call function depending on callback_id
    if (taskid[0] == "message") {            //callbackId[0] = identifier (What to do after invoked action?) e.g. message, dialog,...    
        if (msg.type == "dialog_submission") {
            handleMessage(taskid, pushedButton, msg);
            res.status(200).type('application/json').end();
            if (taskid[4] == "delete") {             
                var updateMsg = {};
                updateMsg["channel"] = msg.channel.id;
                updateMsg["text"] = "Deine Nachricht ist angekommen:";
                for (x in msg.submission) {
                    updateMsg["text"] += "&%" + msg.submission[x];
                }
                updateMsg["ts"] = taskid[taskid.length - 1];
                console.log(updateMsg);
                mod.postToSwaggerAPI(updateMsg, "/chat/update", callback);
            } else {
                res.json(basicResponse);
            }
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
        console.log(taskid[0]);
        if (taskid[0] == "dialog") {
            console.log(taskid[0]);


        } else if (msg.actions[0].type != "button") {                           //If action type != button
            payload["channel"] = msg.container.channel_id;
            payload["ts"] = msg.container.message_ts;
            payload["blocks"] = msg.message.blocks;                     //set necessary variables, old message body placed in payload["blocks"]
            
            var changes = actionId;
            var recentChanges = changes[actionValue].split('.');    //changes depending on selected_options for activated block
            if (recentChanges[0] == "") {
                recentChanges[0] = taskid[taskid.length - 1]
            } else {
                recentChanges.unshift(taskid[taskid.length - 1]);
            }
            recentChanges[0] = parseInt(recentChanges[0], 10) * 2 + 2;
            changes[actionValue] = recentChanges.join('.');
            changes[(actionValue + changes.length / 2)]
            try {
                changes[(actionValue + changes.length / 2)] = JSON.parse(changes[(actionValue + changes.length / 2)]);    //parses changes if possible
            } catch (e) { console.log(e); }
            console.log(changes[(actionValue + changes.length / 2)]);
            payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], changes[actionValue], (actionValue + changes.length / 2).toString(), changes);  //push changes in old message body
            console.log(payload["blocks"]);
            payload["blocks"] = JSON.stringify(payload["blocks"]);
            mod.postToSwaggerAPI(payload, "/chat/update/block", callback);
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
            var lengthOfRightFields = headlineRightField.length / 2;
            if (lengthOfRightFields > 4) {
                lengthOfRightFields = 4; dialog_index
            }
            var types = [];
            for (var i = 0; i < lengthOfFields; i++) {            
                types.push(headlineLeftField[i]);       
                headlineLeftField.splice(i, 1);
            }
            var ifDialog = [];
            for (var i = 0; i < lengthOfRightFields; i++) {
                if (headlineRightField[i] == "true") {
                    ifDialog.push(headlineRightField[i]);
                }
                headlineRightField.splice(i, 1);
            }

            var actionsLeft = headlineLeftField.length;
            if (actionsLeft > 4) {
                actionsLeft = 4;
            }
            var headlineLeftFieldSplitted = headlineLeftField.splice(0, 4);
            var headlineRightFieldSplitted = headlineRightField.splice(0, 4);
            var stringForActionIdSplitted = pushedButton[0].split(',');
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
                    try {
                        payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".fields.0.text", i.toString(), headlineLeftFieldSplitted);
                        payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".fields.1.text", i.toString(), headlineRightFieldSplitted);
                    } catch (e) {
                        payload["blocks"][s].fields = [
                            {
                                "type": "mrkdwn",
                                "text": headlineLeftFieldSplitted[i]
                            }, {
                                "type": "mrkdwn",
                                "text": headlineRightFieldSplitted[i]
                            }];
                    }
                } else {
                    try {
                        delete payload["blocks"][s].accessory.options;
                        delete payload["blocks"][s].fields;
                    } catch (e) { console.log(e);}                
                    payload["blocks"][s].text = { "type": "mrkdwn", "text": headlineLeftFieldSplitted[i] };
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
                    payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".text.text", i.toString(), headlineLeftFieldSplitted);
                }
                if (ifDialog == "true") {
                    payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".block_id", i.toString(), headlineLeftFieldSplitted);
                } else {
                    payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".block_id", i.toString(), headlineLeftFieldSplitted);
                }
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".accessory.action_id", i.toString(), stringForActionIdSplitted);
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], s + ".accessory.type", i.toString(), types); 
                if (i == 3) {
                    break;
                }
            }
            stringForActionIdSplitted.splice(0, 4);
            if (headlineLeftFieldSplitted.length == 0) {
                var buttonName = pushedButton[4].split(',');
                var blockId = msg.message.blocks[2].block_id.split(' ');
                blockId = [blockId[0] + "&%" + blockId[1] + "&%" + blockId[2] + "&%" + blockId[3]];
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], lastBlock + ".elements.0.text.text", "1", buttonName);
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], lastBlock + ".block_id", "0", blockId);
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], lastBlock + ".elements.0.action_id", "0", ["lastMessage"]);
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], lastBlock + ".elements.0.value", "0", ["lastMessage"]);
            } else {
                var buttonValue = stringForActionIdSplitted + "&%" + headlineLeftFieldSplitted.toString() + "&%" + headlineRightFieldSplitted.toString() + "&%" + pushedButton[3] + "&%" + pushedButton[4] + "&%" + pushedButton[5] + "&%" + pushedButton[6] + "&%" + pushedButton[7] + "&%" + pushedButton[8];
                if (pushedButton[9] != "undefined") {
                    buttonValue += pushedButton[9] + "&%" + pushedButton[10] + "&%" + pushedButton[11];
                }
                payload["blocks"] = mod.pushSpecificVariables(payload["blocks"], "blocks." + s + ".elements.value", "0", buttonValue);
            }
            payload["blocks"] = JSON.stringify(payload["blocks"]);
            console.log(JSON.stringify(payload));
            mod.postToSwaggerAPI(payload, "/chat/update/block", callback);
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
    mod.postToSwaggerAPI(arrayOfVariables, path, callback);
}

function handleDialog(taskid, msg) {
    var arrayOfVariables = {};
    var variablesForDialog = taskid[2].split(',');                  //callbackId[2] = first dialog element e.g. "text"
    arrayOfVariables["triggerId"] = msg.trigger_id;
    var callbackId = [];
    for (var i = 0; i < 4; i++) {
        callbackId.push(taskid[3 + i]);
    }
    callbackId.push(msg.message_ts);
    arrayOfVariables["callbackId"] = callbackId.join('&%');                     //callbackId[3] = new Callback ID
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

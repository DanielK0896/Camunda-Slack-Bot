var request = require("request");
const CAMUNDA_CONFIG = require('./camundaConfig');
var listOfAllLDAPUsers = {};
var listOfAllChannels = {};

module.exports = {
    postToSwaggerAPI: postToSwaggerAPI,
    getFromSwaggerAPI: getFromSwaggerAPI,
    preparePostMessage: preparePostMessage,
    createPDF: createPDF,
    pushSpecificVariables: pushSpecificVariables,
    getChannels: getChannels,
    getUsers: getUsers,
    variableShorteningPrinciple: variableShorteningPrinciple
};
function postToSwaggerAPI(msg, path, callback) {             //function to call Swagger API
    return new Promise((resolve, reject) => {
        var headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'cache-control': 'no-cache'
        };
        request({ method: 'POST', headers: headers, url: 'http://localhost:10010' + path, body: msg, json: true }, function (error, response, body) {
            if (!error) {
                callback(body, resolve, reject);
            }
        });
    });
}
function getFromSwaggerAPI(path, callback) {             //function to call Swagger API
    request({ method: 'GET', url: 'http://localhost:10010' + path }, function (error, response, body) {
        if (error) throw new Error(error);  
        callback(body);
    });
    
}

function createPDF(template, fileName, variables) {
    var pdfMake = require('pdfmake/build/pdfmake.js');
    var pdfFonts = require('pdfmake/build/vfs_fonts.js');
    var fs = require('fs');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    var user = variables[1].toString();
    console.log(user);
    
    

    var PdfPrinter = require('../../node_modules/pdfmake/src/printer');
    var pdfOptions = require('../../PDFs/templates/' + template + '.js');
    var printer = new PdfPrinter(fonts);
    var pdfDoc = printer.createPdfKitDocument(pdfOptions.docDefinition(variables));
    pdfDoc.pipe(fs.createWriteStream('PDFs/' + fileName));
    pdfDoc.end();
}
async function preparePostMessage(task) {
    let variablesToGet = task.variables.get("variablesToGet").split(CAMUNDA_CONFIG.variablesToGetSplit);
    let variables = [];
    for (let i = 0; i < variablesToGet.length; i++) {
            arrayOfVariables.push(task.variables.get(variablesToGet[i]));
    }
        var msg = {};
        var path;
        var callback = function postCallback(body, resolve, reject) {
            try {
                var bodyParsed = JSON.parse(body);
                resolve(bodyParsed);
            } catch (e) {
                try {
                    resolve(body);
                } catch (e) {
                    console.log("ERROR callback: " + e);
                    console.log("Body: " + body);
                }
            }
        };

        if (variablesToGet.indexOf("channel") >= 0) {
            msg["channel"] = "";
            if (variablesToGet.indexOf("ts") >= 0) {
                msg["ts"] = variables[variablesToGet.indexOf("ts")];
                path = '/chat/delete';
            }
            if (variablesToGet.indexOf("text") >= 0) {
                msg["text"] = variables[variablesToGet.indexOf("text")];
                path = '/chat/post';
                if (variablesToGet.indexOf("ts") >= 0) {
                    msg["ts"] = variables[variablesToGet.indexOf("ts")];
                    path = '/chat/update';
                }
                if (variablesToGet.indexOf("user") >= 0) {
                    msg["user"] = variables[variablesToGet.indexOf("user")];
                    path += '/ephemeral';
                }
            } else if (variablesToGet.indexOf("kickUser") >= 0) {
                msg["user"] = variables[variablesToGet.indexOf("kickUser")];
                path += '/channel/kick';
            } else if (variablesToGet.indexOf("inviteUser") >= 0) {
                msg["user"] = variables[variablesToGet.indexOf("inviteUser")];
                path += '/channel/invite';
            } else if (variablesToGet.indexOf("userProfile") >= 0) {
                msg["user"] = variables[variablesToGet.indexOf("userProfile")];
                path += '/slackGet/userProfile';
            } else if (variablesToGet.indexOf("file") >= 0) {
                msg["file"] = variables[variablesToGet.indexOf("file")];
                path = '/file/delete';
            }
            if (variablesToGet.indexOf("postAt") >= 0) {
                msg["postAt"] = variables[variablesToGet.indexOf("postAt")];
                path += '/schedule';
            }
            if (variablesToGet.indexOf("scheduledMessageId") >= 0) {
                msg["scheduledMessageId"] = variables[variablesToGet.indexOf("scheduledMessageId")];
                path = '/chat/scheduled/delete';
            }
            if (variablesToGet.indexOf("messageTs") >= 0) {
                msg["messageTs"] = variables[variablesToGet.indexOf("messageTs")];
                path = '/slackGet/permalink';
            }
            if (variablesToGet.indexOf("callbackId") >= 0) {
                msg["callbackId"] = variables[variablesToGet.indexOf("callbackId")];
                if (variablesToGet.indexOf("textButtons") >= 0) {
                    msg["textButtons"] = variables[variablesToGet.indexOf("textButtons")].split(CAMUNDA_CONFIG.textButtonSplit);
                    if (variablesToGet.indexOf("textConfirmation") >= 0) {
                        msg["textConfirmation"] = variables[variablesToGet.indexOf("textConfirmation")].split(CAMUNDA_CONFIG.textConfirmationSplit);
                    }
                    if (variablesToGet.indexOf("style") >= 0) {
                        msg["style"] = variables[variablesToGet.indexOf("style")].split(CAMUNDA_CONFIG.styleSplit);
                    }
                }
            }
            if (variablesToGet.indexOf("boldHeadline") >= 0) {
                msg = { 
                    channel: "", textOptions: [], boldHeadline: variables[variablesToGet.indexOf("boldHeadline")],
                    type: [], confirm: [], message: [], changes: []
                };
                path = "/chat/post/block";
                var actionIdArray = variables[variablesToGet.indexOf("actionId")].split(CAMUNDA_CONFIG.actionIdOuterSplit);
                var leftFieldArray = variables[variablesToGet.indexOf("leftField")].split(CAMUNDA_CONFIG.leftFieldSplit);
                var rightFieldArray = variables[variablesToGet.indexOf("rightField")].split(CAMUNDA_CONFIG.rightFieldSplit);
                var dialogArray = variables[variablesToGet.indexOf("message")].split(CAMUNDA_CONFIG.dialogSplit);
                try {
                    var buttonNameArray = variables[variablesToGet.indexOf("buttonName")].split(CAMUNDA_CONFIG.buttonNameSplit);
                } catch(e) {
                    var buttonNameArray = [];
                }
                var lengthOfLeftFields = leftFieldArray.length;
                if (lengthOfLeftFields > 4) {
                    lengthOfLeftFields = 4;
                }
                var lengthOfRightFields = rightFieldArray.length;
                if (lengthOfRightFields > 4) {
                    lengthOfRightFields = 4;
                }
                
                var message = variables[variablesToGet.indexOf("message")];
                for (var i = 0; i < lengthOfLeftFields; i++) {
                    if (dialogArray[i] != "f") {
                        msg["message"].push(dialogArray[i].split(CAMUNDA_CONFIG.dialogInTaskIdSplit).join(CAMUNDA_CONFIG.taskIdSplit) + CAMUNDA_CONFIG.taskIdSplit + message);
                    } else {
                        msg["message"].push(message);
                    }
                }
                dialogArray.splice[0, lengthOfLeftFields];
                msg["leftField"] = leftFieldArray.splice(0, 4);
                msg["rightField"] = rightFieldArray.splice(0, 4);
                msg["actionId"] = actionIdArray.splice(0, 4);
                
                if (variablesToGet.indexOf("changes") == -1) {
                    var changes = "";
                    msg["changes"] = "";
                } else {
                    var changesShortened = variableShorteningPrinciple(lengthOfLeftFields, variables[variablesToGet.indexOf("changes")])
                    var changes = changesShortened[0];            
                    msg["changes"] = changesShortened[1];
                }
                          
                var typeShortened = variableShorteningPrinciple(lengthOfLeftFields, variables[variablesToGet.indexOf("type")])
                var type = typeShortened[0];            
                msg["type"] = typeShortened[1];
                
                var confirmShortened = variableShorteningPrinciple(lengthOfLeftFields, variables[variablesToGet.indexOf("confirm")])
                var confirm = confirmShortened[0];            
                msg["confirm"] = confirmShortened[1];

                if (variablesToGet.indexOf("textOptions") >= 0) {
                    if (msg["type"][i] == "overflow" || msg["type"][i] == "static_select") {
                        var textOptionsShortened = variableShorteningPrinciple(lengthOfLeftFields, variables[variablesToGet.indexOf("confirm")])
                        var textOptions = textOptionsShortened[0];            
                        msg["textOptions"] = textOptionsShortened[1];
                    }
                } else {
                    var textOptions = "";
                }
                msg["buttonMessage"] = message;
                if (leftFieldArray.length == 0) {
                    buttonNameArray.push("Abschicken");
                    msg["buttonName"] = buttonNameArray;
                    msg["buttonActionId"] = "lastMessage";
                    msg["buttonValue"] = "lastMessage";
                } else {
                    buttonNameArray.push("Naechste Seite");
                    msg["buttonName"] = buttonNameArray;
                    msg["buttonActionId"] = "nextPage";
                    msg["buttonValue"] = actionIdArray.join(CAMUNDA_CONFIG.actionIdOuterSplit) + CAMUNDA_CONFIG.taskIdSplit + leftFieldArray.join(CAMUNDA_CONFIG.leftFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + rightFieldArray.join(CAMUNDA_CONFIG.rightFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + confirm + CAMUNDA_CONFIG.taskIdSplit + type + CAMUNDA_CONFIG.taskIdSplit + dialogArray.CAMUNDA_CONFIG.dialogSplit + CAMUNDA_CONFIG.taskIdSplit + textOptions + CAMUNDA_CONFIG.taskIdSplit + changes + CAMUNDA_CONFIG.taskIdSplit + buttonNameArray.join(CAMUNDA_CONFIG.buttonNameSplit) + CAMUNDA_CONFIG.taskIdSplit + message;
                }

            }
        }
    var listOfChannels = variables[variablesToGet.indexOf("channel")].split(CAMUNDA_CONFIG.channelSplit);
    var arrayOfTimeStamps = [];
    console.log(JSON.stringify(msg));
    console.log(path);
    for (var i = 0; i < listOfChannels.length; i++) {
        listOfChannels[i] = listOfAllChannels[listOfChannels[i]];
        msg["channel"] = listOfChannels[i];
        if (path == '/chat/delete') {
            var tsArray = msg["ts"].split(CAMUNDA_CONFIG.tsSplit);
            if (tsArray.length == listOfChannels.length) {
                msg["ts"] = tsArray[i];
            }
            postToSwaggerAPI(msg, path, callback);
        } else {
            arrayOfTimeStamps[i] = await postToSwaggerAPI(msg, path, callback);
            arrayOfTimeStamps[i] = arrayOfTimeStamps[i]["ts"];
        }

    };

        return arrayOfTimeStamps.join(CAMUNDA_CONFIG.tsSplit);
}

function variableShorteningPrinciple(length, sourceVariable) {
    var storeVariable = [];
    var sourceArray = sourceVariable.split(CAMUNDA_CONFIG.vspSplit);
    for (var i = 0; i < length; i++) {
        sourceArray[0] = parseInt(sourceArray[0], 10)
        if (sourceArray[0] > 0) {
            storeVariable.push(sourceArray[1]);
            sourceArray[0] -= 1;
            if (sourceArray[0] == 0) {
                sourceArray.splice(0, 2);
            } else if (sourceArray[0] == -1) {
                storeVariable.push(sourceArray[1]);
            } else {
                storeVariable.push("undefined");
            }
        }
    }
    return [sourceArray.join(CAMUNDA_CONFIG.vspSplit), storeVariable];
}



var teilnehmerliste = {
    header: [{
        text: 'Teilnehmerliste Schulung',
        color: [79, 129, 189],
        fontSize: 8
    }, {
        text: '| Company Consulting Team e. V.'
    }],
    footer: {
        columns: [
            'Left part',
            { text: 'Right part', alignment: 'right' }
        ]
    },
    content: [
        'First paragraph',
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
    ]

};

var fonts = {
        Roboto: {
            normal: 'fonts/Roboto-Regular.ttf',
            bold: 'fonts/Roboto-Medium.ttf',
            italics: 'fonts/Roboto-Italic.ttf',
            bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
};

function pushSpecificVariables(arrayOfVariables, variableName, variableValue, msg, array) { //push given variables in given array with given property. Property length can be up to 4
    var variableNameArray = variableName.split('.');
    var variableValueArray = variableValue.split('.');
    if(array != true) {
        if (variableNameArray.length == 2) {
            if (variableValueArray.length == 2) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]] = msg[variableValueArray[0]][variableValueArray[1]];
            } else if (variableValueArray.length == 3) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]];
            } else if (variableValueArray.length == 4) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]];
            } else if (variableValueArray.length == 5) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]][variableValueArray[4]];
            } else {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]] = msg[variableValueArray[0]];
            }
        } else if (variableNameArray.length == 3) {
            if (variableValueArray.length == 2) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]] = msg[variableValueArray[0]][variableValueArray[1]];
            } else if (variableValueArray.length == 3) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]];
            } else if (variableValueArray.length == 4) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]];
            } else if (variableValueArray.length == 5) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]][variableValueArray[4]];
            } else {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]] = msg[variableValueArray[0]];
            }
        } else if (variableNameArray.length == 4) {
            if (variableValueArray.length == 2) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]] = msg[variableValueArray[0]][variableValueArray[1]];
            } else if (variableValueArray.length == 3) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]];
            } else if (variableValueArray.length == 4) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]];
            } else if (variableValueArray.length == 5) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]][variableValueArray[4]];
            } else {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]] = msg[variableValueArray[0]];
            }
        } else if (variableNameArray.length == 5) {
            if (variableValueArray.length == 2) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]][variableNameArray[4]] = msg[variableValueArray[0]][variableValueArray[1]];
            } else if (variableValueArray.length == 3) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]][variableNameArray[4]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]];
            } else if (variableValueArray.length == 4) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]][variableNameArray[4]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]];
            } else if (variableValueArray.length == 5) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]][variableNameArray[4]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]][variableValueArray[4]];
            } else {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]][variableNameArray[4]] = msg[variableValueArray[0]];
            }
        } else {
            if (variableValueArray.length == 2) {
                arrayOfVariables[variableNameArray[0]] = msg[variableValueArray[0]][variableValueArray[1]];
            } else if (variableValueArray.length == 3) {
                arrayOfVariables[variableNameArray[0]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]];
            } else if (variableValueArray.length == 4) {
                arrayOfVariables[variableNameArray[0]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]];
            } else if (variableValueArray.length == 5) {
                arrayOfVariables[variableNameArray[0]] = msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]][variableValueArray[4]];
            } else {
                arrayOfVariables[variableNameArray[0]] = msg[variableValueArray[0]];
            }
        }
    } else {
        if (variableNameArray.length == 2) {
            if (variableValueArray.length == 2) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]].push(msg[variableValueArray[0]][variableValueArray[1]]);
            } else if (variableValueArray.length == 3) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]]);
            } else if (variableValueArray.length == 4) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]]);
            } else if (variableValueArray.length == 5) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]][variableValueArray[4]]);
            } else {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]].push(msg[variableValueArray[0]]);
            }
        } else if (variableNameArray.length == 3) {
            if (variableValueArray.length == 2) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]].push(msg[variableValueArray[0]][variableValueArray[1]]);
            } else if (variableValueArray.length == 3) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]]);
            } else if (variableValueArray.length == 4) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]]);
            } else if (variableValueArray.length == 5) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]].push([variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]][variableValueArray[4]]);
            } else {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]].push(msg[variableValueArray[0]]);
            }
        } else if (variableNameArray.length == 4) {
            if (variableValueArray.length == 2) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]].push(msg[variableValueArray[0]][variableValueArray[1]]);
            } else if (variableValueArray.length == 3) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]]);
            } else if (variableValueArray.length == 4) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]]);
            } else if (variableValueArray.length == 5) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]].push([variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]][variableValueArray[4]]);
            } else {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]].push(msg[variableValueArray[0]]);
            }
        } else if (variableNameArray.length == 5) {
            if (variableValueArray.length == 2) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]][variableNameArray[4]].push(msg[variableValueArray[0]][variableValueArray[1]]);
            } else if (variableValueArray.length == 3) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]][variableNameArray[4]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]]);
            } else if (variableValueArray.length == 4) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]][variableNameArray[4]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]]);
            } else if (variableValueArray.length == 5) {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]][variableNameArray[4]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]][variableValueArray[4]]);
            } else {
                arrayOfVariables[variableNameArray[0]][variableNameArray[1]][variableNameArray[2]][variableNameArray[3]][variableNameArray[4]].push(msg[variableValueArray[0]]);
            }
        } else {
            if (variableValueArray.length == 2) {
                arrayOfVariables[variableNameArray[0]].push(msg[variableValueArray[0]][variableValueArray[1]]);
            } else if (variableValueArray.length == 3) {
                arrayOfVariables[variableNameArray[0]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]]);
            } else if (variableValueArray.length == 4) {
                arrayOfVariables[variableNameArray[0]].push(msg[variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]]);
            } else if (variableValueArray.length == 5) {
                arrayOfVariables[variableNameArray[0]].push([variableValueArray[0]][variableValueArray[1]][variableValueArray[2]][variableValueArray[3]][variableValueArray[4]]);
            } else {
                arrayOfVariables[variableNameArray[0]].push(msg[variableValueArray[0]]);
            }
        }
    }
    return arrayOfVariables;
}

function getChannels() {
    getFromSwaggerAPI("/slackGet/conversations", function (body) {
        var bodyParsed = JSON.parse(body);
        for (var i = 0; i < bodyParsed.channels.length; i++) {
            listOfAllChannels = pushSpecificVariables(listOfAllChannels, bodyParsed.channels[i].name, "channels." + i + ".id", bodyParsed);            
        }
        return listOfAllChannels;
    });
}

function getUsers() {
    let userArray = JSON.parse(getFromSwaggerAPI("/slackGet/users", function (body) {}));

    for (var i = 0; i < userArray.members.length; i++) {
        let ldapName = JSON.parse(getFromSwaggerAPI("/name_slackid_query?query_value=" + userArray.members[i].id, function (body) {}));
        listOfAllLDAPUsers[userArray.members[i].id] = ldapName;
    }
    return listOfAllLDAPUsers;
}


var request = require("request");
const CAMUNDA_CONFIG = require('./camundaConfig');
var listOfAllLDAPUsers = {};
var listOfAllChannels = {};

module.exports = {
    postToSwaggerAPI: postToSwaggerAPI,
    getFromSwaggerAPI: getFromSwaggerAPI,
    preparePostMessage: preparePostMessage,
    createPDF: createPDF,
    getVariables: getVariables,
    pushSpecificVariables: pushSpecificVariables,
    getChannels: getChannels,
    getUsers: getUsers
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
    var variablesToGet = task.variables.get("variablesToGet").split(CAMUNDA_CONFIG.variablesToGetSplit);
    var variables = getVariables(task, variablesToGet);
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
                console.log(actionIdArray);
                console.log(leftFieldArray);
                console.log(rightFieldArray);
                try {
                    var buttonNameArray = variables[variablesToGet.indexOf("buttonName")].split(CAMUNDA_CONFIG.buttonNameSplit);
                } catch(e) {
                    var buttonNameArray = [];
                }
                var lengthOfLeftFields = leftFieldArray.length / 2;
                if (lengthOfLeftFields > 4) {
                    lengthOfLeftFields = 4;
                }
                var lengthOfRightFields = rightFieldArray.length / 2;
                if (lengthOfRightFields > 4) {
                    lengthOfRightFields = 4;
                }
                for (var i = 0; i < lengthOfLeftFields; i++) {
                    var type = leftFieldArray[i].split(CAMUNDA_CONFIG.confirmSplit);
                    msg["type"].push(type[0]);        
                    msg["confirm"].push(type[1]); 
                    leftFieldArray.splice(i, 1);
                }
                var message = variables[variablesToGet.indexOf("message")];
                console.log(message);
                for (var i = 0; i < lengthOfRightFields; i++) {
                    if (rightFieldArray[i] != "false") {
                        var dialog = rightFieldArray[i].split(CAMUNDA_CONFIG.dialogInTaskIdSplit).join(CAMUNDA_CONFIG.taskIdSplit);
                        msg["message"].push(dialog + CAMUNDA_CONFIG.taskIdSplit + message);
                    } else {
                        msg["message"].push(message);
                        console.log(msg.message);
                    }
                    rightFieldArray.splice(i, 1);
                }
                msg["leftField"] = leftFieldArray.splice(0, 4);
                msg["rightField"] = rightFieldArray.splice(0, 4);
                msg["actionId"] = actionIdArray.splice(0, 4);
                if (variablesToGet.indexOf("changes") == -1) {
                    msg["changes"] = "-1" + CAMUNDA_CONFIG.changesOuterSplit;
                    var changesForButtonValue = msg["changes"];
                    var changesArray = msg["changes"].split(CAMUNDA_CONFIG.changesOuterSplit);
                } else {
                    var changesArray = variables[variablesToGet.indexOf("changes")].split(CAMUNDA_CONFIG.changesOuterSplit);
                }
                
                for (var i = 0; i < leftFieldArray.length; i++) {
                    changesArray[0] = parseInt(changesArray[0], 10)
                    if (changesArray[0] > 0) {
                        msg["changes"].push(changesArray[1]);
                        changesArray[0] -= 1;
                        if (changesArray[0] == 0) {
                            changesArray.splice(0, 2);
                        }
                    } else if (changesArray[0] == -1) {
                        console.log(changesArray);
                        console.log(changesArray[1]);
                        msg["changes"].push(changesArray[1]);
                    }
                }   
                if (variablesToGet.indexOf("changes") != -1) {
                    var changesForButtonValue = changesArray.join(CAMUNDA_CONFIG.changesOuterSplit); 
                }   
                if (variablesToGet.indexOf("textOptions") >= 0) {
                    var textOptionsArray = variables[variablesToGet.indexOf("textOptions")].split(CAMUNDA_CONFIG.textOptionsOuterSplit);
                    for (var i = 0; i < lengthOfLeftFields; i++) {
                        if (msg["type"][i] == "overflow" || msg["type"][i] == "static_select") {
                            textOptionsArray[0] = parseInt(textOptionsArray[0], 10)
                            if (textOptionsArray[0] > 0) {
                                msg["textOptions"].push(textOptionsArray[1]);
                                textOptionsArray[0] -= 1;
                                if (textOptionsArray[0] == 0) {
                                    textOptionsArray.splice(0, 2);
                                }
                            } else if (textOptionsArray[0] == -1) {
                                msg["textOptions"].push(textOptionsArray[1]);
                            }
                        } else {
                            msg["textOptions"].push("undefined");
                        }
                    }             
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
                    var textOptions;
                    try {
                        textOptions = textOptionsArray.join(textOptionsOuterSplit);
                    } catch (e) {
                        textOptions = "empty";
                    }
                    msg["buttonValue"] = actionIdArray + CAMUNDA_CONFIG.taskIdSplit + leftFieldArray.join(CAMUNDA_CONFIG.leftFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + rightFieldArray.join(CAMUNDA_CONFIG.rightFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + textOptions + CAMUNDA_CONFIG.taskIdSplit + changesForButtonValue + CAMUNDA_CONFIG.taskIdSplit + buttonNameArray.join(CAMUNDA_CONFIG.buttonNameSplit) + CAMUNDA_CONFIG.taskIdSplit + message;
                    console.log(msg["buttonName"])
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

function getVariables(task, variablesToGet) {    //function to get Variables from Camunda
    var arrayOfVariables = [];
    for (var i = 0; i < variablesToGet.length; i++) {
            var variable = task.variables.get(variablesToGet[i])
            arrayOfVariables.push(variable);
    }
    return arrayOfVariables;
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
        var bodyParsed = JSON.parse(JSON.parse(body));
        for (var i = 0; i < bodyParsed.channels.length; i++) {
            listOfAllChannels = pushSpecificVariables(listOfAllChannels, bodyParsed.channels[i].name, "channels." + i + ".id", bodyParsed);            
        }
        return listOfAllChannels;
    });
}

function getUsers() {
    getFromSwaggerAPI("/slackGet/conversations", function (body) {
        var bodyParsed = JSON.parse(JSON.parse(body));
        for (var i = 0; i < bodyParsed.channels.length; i++) {
            listOfAllLDAPUsers = pushSpecificVariables(listOfAllLDAPUsers, bodyParsed.channels[i].name, "channels." + i + ".id", bodyParsed);
        }
        return listOfAllLDAPUsers;
    });
}


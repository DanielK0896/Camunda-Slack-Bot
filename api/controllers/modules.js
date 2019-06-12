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
    var channelIndex = variablesToGet.indexOf("channel");
    var textIndex = variablesToGet.indexOf("text");
    var callbackIdIndex = variablesToGet.indexOf("callbackId");
    var userIndex = variablesToGet.indexOf("user");
    var kickUserIndex = variablesToGet.indexOf("kickUser");
    var inviteUserIndex = variablesToGet.indexOf("inviteUser");
    var postAtIndex = variablesToGet.indexOf("postAt");
    var tsIndex = variablesToGet.indexOf("ts");
    var scheduledMessageIdIndex = variablesToGet.indexOf("scheduledMessageId");
    var messageTsIndex = variablesToGet.indexOf("messageTs");
    var textButtonsIndex = variablesToGet.indexOf("textButtons");
    var styleIndex = variablesToGet.indexOf("style");
    var textConfirmationIndex = variablesToGet.indexOf("textConfirmation");
    var boldHeadlineIndex = variablesToGet.indexOf("boldHeadline");
    var userProfileIndex = variablesToGet.indexOf("userProfile");
    var fileIndex = variablesToGet.indexOf("file");
    var changesIndex = variablesToGet.indexOf("changes");
    var leftFieldIndex = variablesToGet.indexOf("leftField");
    var rightFieldIndex = variablesToGet.indexOf("rightField");
    var actionIdIndex = variablesToGet.indexOf("actionId");
    var textOptionsIndex = variablesToGet.indexOf("textOptions");
    var messageIndex = variablesToGet.indexOf("message");
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

        if (channelIndex >= 0) {
            msg["channel"] = "";
            if (tsIndex >= 0) {
                msg["ts"] = variables[tsIndex];
                path = '/chat/delete';
            }
            if (textIndex >= 0) {
                msg["text"] = variables[textIndex];
                path = '/chat/post';
                if (tsIndex >= 0) {
                    msg["ts"] = variables[tsIndex];
                    path = '/chat/update';
                }
                if (userIndex >= 0) {
                    msg["user"] = variables[userIndex];
                    path += '/ephemeral';
                }
            } else if (kickUserIndex >= 0) {
                msg["user"] = variables[kickUserIndex];
                path += '/channel/kick';
            } else if (inviteUserIndex >= 0) {
                msg["user"] = variables[inviteUserIndex];
                path += '/channel/invite';
            } else if (userProfileIndex >= 0) {
                msg["user"] = variables[userProfileIndex];
                path += '/slackGet/userProfile';
            } else if (fileIndex >= 0) {
                msg["file"] = variables[fileIndex];
                path = '/file/delete';
            }
            if (postAtIndex >= 0) {
                msg["postAt"] = variables[postAtIndex];
                path += '/schedule';
            }
            if (scheduledMessageIdIndex >= 0) {
                msg["scheduledMessageId"] = variables[scheduledMessageIdIndex];
                path = '/chat/scheduled/delete';
            }
            if (messageTsIndex >= 0) {
                msg["messageTs"] = variables[messageTsIndex];
                path = '/slackGet/permalink';
            }
            if (callbackIdIndex >= 0) {
                msg["callbackId"] = variables[callbackIdIndex];
                if (textButtonsIndex >= 0) {
                    msg["textButtons"] = variables[textButtonsIndex].split(CAMUNDA_CONFIG.textButtonSplit);
                    if (textConfirmationIndex >= 0) {
                        msg["textConfirmation"] = variables[textConfirmationIndex].split(CAMUNDA_CONFIG.textConfirmationSplit);
                    }
                    if (styleIndex >= 0) {
                        msg["style"] = variables[styleIndex].split(CAMUNDA_CONFIG.styleSplit);
                    }
                }
            }
            if (boldHeadlineIndex >= 0) {
                path = "/chat/post/block";
                console.log(variables);
                var actionIdArray = variables[actionIdIndex].split(CAMUNDA_CONFIG.actionIdSplit);
                var leftFieldArray = variables[leftFieldIndex].split(CAMUNDA_CONFIG.leftFieldSplit);
                var rightFieldArray = variables[rightFieldIndex].split(CAMUNDA_CONFIG.rightFieldSplit);
                msg["boldHeadline"] = variables[boldHeadlineIndex];
                var lengthOfLeftFields = leftFieldArray.length / 2;
                if (lengthOfLeftFields > 4) {
                    lengthOfLeftFields = 4;
                }
                var lengthOfRightFields = rightFieldArray.length / 2;
                if (lengthOfRightFields > 4) {
                    lengthOfRightFields = 4;
                }
                msg["type"] = [];
                for (var i = 0; i < lengthOfLeftFields; i++) {
                    msg["type"].push(leftFieldArray[i]);
                    leftFieldArray.splice(i, 1);
                }
                msg["message"] = []
                var message = variables[messageIndex];
                for (var i = 0; i < lengthOfRightFields; i++) {
                    if (rightFieldArray[i] != "false") {
                        var dialog = rightFieldArray[i].split(CAMUNDA_CONFIG.dialogInTaskIdSplit).join(CAMUNDA_CONFIG.taskIdSplit);
                        msg["message"].push(dialog + CAMUNDA_CONFIG.taskIdSplit + message);
                    } else {
                        msg["message"].push(message);
                    }
                    rightFieldArray.splice(i, 1);
                }
                msg["leftField"] = leftFieldArray.splice(0, 4);
                msg["rightField"] = rightFieldArray.splice(0, 4);
                msg["actionId"] = actionIdArray.splice(0, 4);
                if (changesIndex == -1) {
                    msg["changes"] = ";";
                } else {
                    msg["changes"] = variables[changesIndex];
                }
                if (textOptionsIndex >= 0) {
                    var textOptionsArray = variables[textOptionsIndex].split(CAMUNDA_CONFIG.textOptionsOutterSplit);
                    for (var i = 0; i < leftFieldArray; i++) {
                        if (msg["type"][i] == "overflow") {
                            textOptionsArray[0] = parseInt(textOptionsArray[0], 10)
                            if (textOptionsArray[0] > 0) {
                                msg["textOptions"].push(textOptionsArray[1]);
                                textOptionsArray[0] -= 1;
                                if (textOptionsArray[0] == 0) {
                                    textOptionsArray.splice(0, 2);
                                }
                            } else if (textOptionsArray[0] == -1) {
                                msg["textOptions"].push(textOptionsArray);
                            }
                        } else {
                            msg["textOptions"].push("undefined");
                        }
                    }
                    textOptionsArray[0] = textOptionsArray[0].toString();
                }
                if (leftFieldArray.length == 0) {
                    msg["buttonName"] = "Abschicken"
                    msg["buttonMessage"] = message;
                    msg["buttonActionId"] = "lastMessage";
                    msg["buttonValue"] = "lastMessage";
                } else {
                    msg["buttonName"] = "Nächste Seite"
                    msg["buttonMessage"] = "0" + CAMUNDA_CONFIG.taskIdSplit + "0" + CAMUNDA_CONFIG.taskIdSplit + "0" + CAMUNDA_CONFIG.taskIdSplit + "0";
                    msg["buttonActionId"] = "nextpage";
                    msg["buttonValue"] = actionIdArray + CAMUNDA_CONFIG.taskIdSplit + leftFieldArray.join(CAMUNDA_CONFIG.leftFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + rightFieldArray.join(CAMUNDA_CONFIG.rightFieldSplit) + CAMUNDA_CONFIG.taskIdSplit + textOptionsArray.join(textOptionsOuterSplit) + CAMUNDA_CONFIG.taskIdSplit + message;

                }

            }
        }
    var listOfChannels = variables[channelIndex].split(CAMUNDA_CONFIG.channelSplit);
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
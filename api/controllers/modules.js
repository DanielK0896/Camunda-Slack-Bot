var maxChannels = 100;
var request = require("request");
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
    getUsers: getUsers,
    exportVariables: exportVariables
};

function exportVariables() {
    var array = [listOfAllLDAPUsers, listOfAllChannels];
    return array;
};

function postToSwaggerAPI(msg, path, callback) {             //function to call Swagger API
    return new Promise((resolve, reject) => {
        var headers = {
            'Content-Type': 'application/json',
            'cache-control': 'no-cache'
        };
        request({ method: 'POST', headers: headers, url: 'http://localhost:10010' + path, body: msg, json: true }, function (error, response, body) {
            if (!error) callback(body, resolve, reject);
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
        var variablesToGet = task.variables.get("variablesToGet").split(',');
        var variables = getVariables(task, variablesToGet);

        var channel_index = variablesToGet.indexOf("channel");
        var text_index = variablesToGet.indexOf("text");
        var callbackId_index = variablesToGet.indexOf("callbackId");
        var user_index = variablesToGet.indexOf("user");
        var kickUser_index = variablesToGet.indexOf("kickUser");
        var inviteUser_index = variablesToGet.indexOf("inviteUser");
        var postAt_index = variablesToGet.indexOf("postAt");
        var ts_index = variablesToGet.indexOf("ts");
        var scheduledMessageId_index = variablesToGet.indexOf("scheduledMessageId");
        var messageTs_index = variablesToGet.indexOf("messageTs");
        var textButtons_index = variablesToGet.indexOf("textButtons");
        var style_index = variablesToGet.indexOf("style");
        var textConfirmation_index = variablesToGet.indexOf("textConfirmation");
        var boldHeadline_index = variablesToGet.indexOf("boldHeadline");
        var buttonValue_index = variablesToGet.indexOf("buttonValue");
        var userProfile_index = variablesToGet.indexOf("userProfile");
        var file_index = variablesToGet.indexOf("file");
        var changes_index = variablesToGet.indexOf("changes");
        var msg = {};
        var path;
        var callback = function postCallback(body, resolve, reject) {
        var bodyParsed = JSON.parse(body);
            resolve(bodyParsed);
        };

        if (channel_index >= 0) {
            msg["channel"] = "";
            if (ts_index >= 0) {
                msg["ts"] = variables[ts_index];
                path = '/chat/delete';
            }
            if (text_index >= 0) {
                msg["text"] = variables[text_index];
                path = '/chat/post';
                callback = function postCallback(body, resolve, reject) {
                    var bodyParsed = JSON.parse(body);
                    resolve(bodyParsed.message.ts);
                };
                if (ts_index >= 0) {
                    msg["ts"] = variables[ts_index];
                    path = '/chat/update';
                }
                if (user_index >= 0) {
                    msg["user"] = variables[user_index];
                    path += '/ephemeral';
                }
            } else if (kickUser_index >= 0) {
                msg["user"] = variables[kickUser_index];
                path += '/channel/kick';
            } else if (inviteUser_index >= 0) {
                msg["user"] = variables[inviteUser_index];
                path += '/channel/invite';
            } else if (userProfile_index >= 0) {
                msg["user"] = variables[userProfile_index];
                path += '/slackGet/userProfile';
            } else if (file_index >= 0) {
                msg["file"] = variables[file_index];
                path = '/file/delete';
            }
            if (postAt_index >= 0) {
                msg["postAt"] = variables[postAt_index];
                path += '/schedule';
            }
            if (scheduledMessageId_index >= 0) {
                msg["scheduledMessageId"] = variables[scheduledMessageId_index];
                path = '/chat/scheduled/delete';
            }
            if (messageTs_index >= 0) {
                msg["messageTs"] = variables[messageTs_index];
                path = '/slackGet/permalink';
            }
            if (callbackId_index >= 0) {
                msg["callbackId"] = variables[callbackId_index];
                if (textButtons_index >= 0) {
                    msg["textButtons"] = variables[textButtons_index].split(",");
                    if (textConfirmation_index >= 0) {
                        msg["textConfirmation"] = variables[textConfirmation_index].split(",");
                    }
                    if (style_index >= 0) {
                        msg["style"] = variables[style_index].split(",");
                    }
                }
            }
            if (boldHeadline_index >= 0) {
                path = "/chat/post/block"
                console.log(variables);
                var fieldInformation = variables[buttonValue_index].split("&%");
                var stringForActionId = fieldInformation[0].split(",");
                var headlineLeftFieldSplitted = fieldInformation[1].split(",");
                var headlineRightFieldSplitted = fieldInformation[2].split(",");
                var buttonNameSplitted = fieldInformation[4].split(",");
                msg["boldHeadline"] = variables[boldHeadline_index];
                var lengthOfLeftFields = headlineLeftFieldSplitted.length / 2;
                if (lengthOfLeftFields > 4) {
                    lengthOfLeftFields = 4;
                }
                var lengthOfRightFields = headlineRightFieldSplitted.length / 2;
                if (lengthOfRightFields > 4) {
                    lengthOfRightFields = 4;
                }
                msg["type"] = [];
                for (var i = 0; i < lengthOfLeftFields; i++) {
                    msg["type"].push(headlineLeftFieldSplitted[i]);
                    headlineLeftFieldSplitted.splice(i, 1);
                }
                msg["message"] = []
                for (var i = 0; i < lengthOfRightFields; i++) {
                    if (headlineRightFieldSplitted[i] == "true") {
                        msg["message"].push(fieldInformation[6] + "&%" + fieldInformation[7] + "&%" + fieldInformation[8] + "&%" + fieldInformation[5]);
                    } else {
                        msg["message"].push(fieldInformation[5]);
                    }
                    headlineRightFieldSplitted.splice(i, 1);
                }
                msg["headlineLeftField"] = headlineLeftFieldSplitted.splice(0, 4);
                msg["headlineRightField"] = headlineRightFieldSplitted.splice(0, 4);
                msg["textOptions"] = fieldInformation[3].split(",");
                msg["actionId"] = stringForActionId.splice(0, 4);
                msg["changes"] = variables[changes_index];
                

                if (headlineLeftFieldSplitted.length == 0) {
                    msg["buttonName"] = buttonNameSplitted[1];
                    msg["buttonMessage"] = fieldInformation[5];
                    msg["buttonActionId"] = "lastMessage";
                    msg["buttonValue"] = "lastMessage";
                } else {
                    msg["buttonName"] = buttonNameSplitted[0];
                    msg["buttonMessage"] = "0&%0&%0&%0"
                    msg["buttonActionId"] = "nextpage"
                    msg["buttonValue"] = stringForActionId + "&%" + headlineLeftFieldSplitted.join() + "&%" + headlineRightFieldSplitted.join() + "&%" + fieldInformation[3] + "&%" + buttonNameSplitted.toString() + "&%" + fieldInformation[5];
                    if (fieldInformation[6] != "undefined") {
                        msg["buttonValue"] += fieldInformation[6] + "&%" + fieldInformation[7] + "&%" + fieldInformation[8];
                    }
                }

            }
        }
        var listOfChannels = variables[channel_index].split(',');
        var arrayOfTimeStamps = [];
        var i;
    for (i = 0; i < listOfChannels.length; i++) {
            listOfChannels[i] = listOfAllChannels[listOfChannels[i]];
            msg["channel"] = listOfChannels[i];
            arrayOfTimeStamps[i] = await postToSwaggerAPI(msg, path, callback); 
    };
        return arrayOfTimeStamps.toString();
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
    var variableNameSplitted = variableName.split('.');
    var variableValueSplitted = variableValue.split('.');
    if(array != true) {
        if (variableNameSplitted.length == 2) {
            if (variableValueSplitted.length == 2) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]] = msg[variableValueSplitted[0]][variableValueSplitted[1]];
            } else if (variableValueSplitted.length == 3) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]];
            } else if (variableValueSplitted.length == 4) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]];
            } else if (variableValueSplitted.length == 5) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]][variableValueSplitted[4]];
            } else {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]] = msg[variableValueSplitted[0]];
            }
        } else if (variableNameSplitted.length == 3) {
            if (variableValueSplitted.length == 2) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]] = msg[variableValueSplitted[0]][variableValueSplitted[1]];
            } else if (variableValueSplitted.length == 3) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]];
            } else if (variableValueSplitted.length == 4) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]];
            } else if (variableValueSplitted.length == 5) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]][variableValueSplitted[4]];
            } else {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]] = msg[variableValueSplitted[0]];
            }
        } else if (variableNameSplitted.length == 4) {
            if (variableValueSplitted.length == 2) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]] = msg[variableValueSplitted[0]][variableValueSplitted[1]];
            } else if (variableValueSplitted.length == 3) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]];
            } else if (variableValueSplitted.length == 4) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]];
            } else if (variableValueSplitted.length == 5) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]][variableValueSplitted[4]];
            } else {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]] = msg[variableValueSplitted[0]];
            }
        } else if (variableNameSplitted.length == 5) {
            if (variableValueSplitted.length == 2) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]][variableNameSplitted[4]] = msg[variableValueSplitted[0]][variableValueSplitted[1]];
            } else if (variableValueSplitted.length == 3) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]][variableNameSplitted[4]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]];
            } else if (variableValueSplitted.length == 4) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]][variableNameSplitted[4]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]];
            } else if (variableValueSplitted.length == 5) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]][variableNameSplitted[4]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]][variableValueSplitted[4]];
            } else {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]][variableNameSplitted[4]] = msg[variableValueSplitted[0]];
            }
        } else {
            if (variableValueSplitted.length == 2) {
                arrayOfVariables[variableNameSplitted[0]] = msg[variableValueSplitted[0]][variableValueSplitted[1]];
            } else if (variableValueSplitted.length == 3) {
                arrayOfVariables[variableNameSplitted[0]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]];
            } else if (variableValueSplitted.length == 4) {
                arrayOfVariables[variableNameSplitted[0]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]];
            } else if (variableValueSplitted.length == 5) {
                arrayOfVariables[variableNameSplitted[0]] = msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]][variableValueSplitted[4]];
            } else {
                arrayOfVariables[variableNameSplitted[0]] = msg[variableValueSplitted[0]];
            }
        }
    } else {
        if (variableNameSplitted.length == 2) {
            if (variableValueSplitted.length == 2) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]]);
            } else if (variableValueSplitted.length == 3) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]]);
            } else if (variableValueSplitted.length == 4) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]]);
            } else if (variableValueSplitted.length == 5) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]][variableValueSplitted[4]]);
            } else {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]].push(msg[variableValueSplitted[0]]);
            }
        } else if (variableNameSplitted.length == 3) {
            if (variableValueSplitted.length == 2) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]]);
            } else if (variableValueSplitted.length == 3) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]]);
            } else if (variableValueSplitted.length == 4) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]]);
            } else if (variableValueSplitted.length == 5) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]].push([variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]][variableValueSplitted[4]]);
            } else {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]].push(msg[variableValueSplitted[0]]);
            }
        } else if (variableNameSplitted.length == 4) {
            if (variableValueSplitted.length == 2) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]]);
            } else if (variableValueSplitted.length == 3) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]]);
            } else if (variableValueSplitted.length == 4) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]]);
            } else if (variableValueSplitted.length == 5) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]].push([variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]][variableValueSplitted[4]]);
            } else {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]].push(msg[variableValueSplitted[0]]);
            }
        } else if (variableNameSplitted.length == 5) {
            if (variableValueSplitted.length == 2) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]][variableNameSplitted[4]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]]);
            } else if (variableValueSplitted.length == 3) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]][variableNameSplitted[4]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]]);
            } else if (variableValueSplitted.length == 4) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]][variableNameSplitted[4]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]]);
            } else if (variableValueSplitted.length == 5) {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]][variableNameSplitted[4]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]][variableValueSplitted[4]]);
            } else {
                arrayOfVariables[variableNameSplitted[0]][variableNameSplitted[1]][variableNameSplitted[2]][variableNameSplitted[3]][variableNameSplitted[4]].push(msg[variableValueSplitted[0]]);
            }
        } else {
            if (variableValueSplitted.length == 2) {
                arrayOfVariables[variableNameSplitted[0]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]]);
            } else if (variableValueSplitted.length == 3) {
                arrayOfVariables[variableNameSplitted[0]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]]);
            } else if (variableValueSplitted.length == 4) {
                arrayOfVariables[variableNameSplitted[0]].push(msg[variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]]);
            } else if (variableValueSplitted.length == 5) {
                arrayOfVariables[variableNameSplitted[0]].push([variableValueSplitted[0]][variableValueSplitted[1]][variableValueSplitted[2]][variableValueSplitted[3]][variableValueSplitted[4]]);
            } else {
                arrayOfVariables[variableNameSplitted[0]].push(msg[variableValueSplitted[0]]);
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
        console.log("In der APP.js angekommen" + listOfChannels);
    });
}

function getUsers() {
    getFromSwaggerAPI("/slackGet/conversations", function (body) {
        var bodyParsed = JSON.parse(JSON.parse(body));
        for (var i = 0; i < bodyParsed.channels.length; i++) {
            listOfAllLDAPUsers = pushSpecificVariables(listOfAllLDAPUsers, bodyParsed.channels[i].name, "channels." + i + ".id", bodyParsed);
        }
        return listOfAllLDAPUsers;
        console.log("In der APP.js angekommen" + listOfChannels);
    });
}
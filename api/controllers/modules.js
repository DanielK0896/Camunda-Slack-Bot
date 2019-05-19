var maxChannels = 100;



module.exports = {
    postToSwaggerAPI: postToSwaggerAPI,
    preparePostMessage: preparePostMessage,
    createPDF: createPDF,
    getVariables: getVariables
};

function postToSwaggerAPI(msg, path){             //function to call Swagger API
    var http = require('http');
    var request = http.request({
    host:'localhost',
    port: 10010,
    method: 'POST',
    path: path,
        headers: {
            'Content-Type': 'application/json',
            'Transfer-Encoding': 'chunked'
        }
    }, function (response) {
            var body = '';
        response.setEncoding('utf8') 
        console.log("Code: " + response.statusCode);
        response.on('data', function (data) {
            body += data;
        });
        response.on('end', function () {
            console.log(body);
        });
    });
    request.write(msg);
    request.end();
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
function preparePostMessage(task) {

    var variablesToGet = task.variables.get("variablesToGet").split(',');
    console.log(variablesToGet);
    var variables = getVariables(task, variablesToGet);
    console.log("variablesToGet: " + variablesToGet);
    console.log("variables: " + variables);

    var channel_index = variablesToGet.indexOf("slack_channel");
    var text_index = variablesToGet.indexOf("text");
    var callbackId_index = variablesToGet.indexOf("callbackId");
    var user_index = variablesToGet.indexOf("user");
    var postAt_index = variablesToGet.indexOf("postAt");
    var ts_index = variablesToGet.indexOf("ts");
    var scheduledMessageId_index = variablesToGet.indexOf("scheduledMessageId");
    var messageTs_index = variablesToGet.indexOf("messageTs");
    var textButton1_index = variablesToGet.indexOf("textButton1");
    var textButton2_index = variablesToGet.indexOf("textButton2");
    var textConfirmation1_index = variablesToGet.indexOf("textConfirmation1");
    var textConfirmation2_index = variablesToGet.indexOf("textConfirmation2");
    var msg = {};
    var path;

    if (channel_index >= 0) {
        msg["channel"] = "";
        if (ts_index >= 0) {
            msg["ts"] = variables[ts_index];
            path = '/deleteMsg';
        }
        if (text_index >= 0) {
            msg["text"] = variables[text_index];
            path = '/sendMsg';
            if (ts_index >= 0) {
                msg["ts"] = variables[ts_index];
                path = '/updateMsg';
            }
        }
        if (user_index >= 0) {
            msg["user"] = variables[user_index];
            path += '/ephemeral';
        }
        if (postAt_index >= 0) {
            msg["postAt"] = variables[postAt_index];
            path = '/schedule';
        }
        if (scheduledMessageId_index >= 0) {
            msg["scheduledMessageId"] = variables[scheduledMessageId_index];
            path = '/deleteMsgScheduled';
        }
        if (messageTs_index >= 0) {
            msg["messageTs"] = variables[messageTs_index];
            path = '/getPermalink';
        }
        if (callbackId_index >= 0) {
            msg["callbackId"] = variables[callbackId_index];
            if (textButton2_index >= 0) {
                if (textButton1_index >= 0) {
                    msg["textButton1"] = variables[textButton1_index];
                }
                msg["textButton2"] = variables[textButton2_index];
                path += '/twoButtons';
                if (textConfirmation1_index >= 0) {
                    msg["textConfirmation1"] = variables[textConfirmation1_index];
                    path += '/Confirm';
                }
                if (textConfirmation2_index >= 0) {
                    msg["textConfirmation2"] = variables[textConfirmation2_index];
                }
            } else {
                if (textButton1_index >= 0) {
                   msg["textButton1"] = variables[textButton1_index];
                    path += '/oneButton';
                    if (textConfirmation1_index >= 0) {
                        msg["textConfirmation1"] = variables[textConfirmation1_index];
                        path += '/Confirm';
                    }
                }
            }
        }
    }
    var listOfChannels = variables[channel_index].split(',');
    console.log(path);
    for (var i = 0; i < listOfChannels.length; i++) {
        msg["channel"] = listOfChannels[i];
        console.log(msg);
        var payload = JSON.stringify(msg);
        postToSwaggerAPI(payload, 10010, path);
    }
    
}



function getVariables(task, variablesToGet) {    //function to get Variables from Camunda
    var arrayOfVariables = [];
    for (var i = 0; i < variablesToGet.length; i++) {
        if (variablesToGet[i] == 'slack_channel') {
            var stringWithChannels;
            for (var j = 1; j <= maxChannels; j++) {
                var slackChannel;
                try {
                    var channel = variablesToGet[i] + "_" + j;
                    slackChannel = task.variables.get(channel);
                    if (typeof slackChannel === "undefined") {
                        throw ("Slack Channel(s) erfolgreich empfangen");
                    }
                } catch (e) {
                    console.log(e);
                    arrayOfVariables.push(stringWithChannels);
                    break;
                }
                if (j == 1) {
                    stringWithChannels = slackChannel;
                } else {
                    stringWithChannels = stringWithChannels + "_" + slackChannel;
                }
            }
        } else {
            var variable = task.variables.get(variablesToGet[i])
            arrayOfVariables.push(variable);
        }
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
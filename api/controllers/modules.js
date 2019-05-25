var maxChannels = 100;
var numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixten", "seventeen", "eighteen", "nineteen", "twenty"];

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
    }, function () { }
    );

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
    var variables = getVariables(task, variablesToGet);

    var channel_index = variablesToGet.indexOf("slack_channel");
    var text_index = variablesToGet.indexOf("text");
    var callbackId_index = variablesToGet.indexOf("callbackId");
    var user_index = variablesToGet.indexOf("user");
    var postAt_index = variablesToGet.indexOf("postAt");
    var ts_index = variablesToGet.indexOf("ts");
    var scheduledMessageId_index = variablesToGet.indexOf("scheduledMessageId");
    var messageTs_index = variablesToGet.indexOf("messageTs");
    var textButtons_index = variablesToGet.indexOf("textButtons");
    var textConfirmation_index = variablesToGet.indexOf("textConfirmation");
    var boldHeadline_index = variablesToGet.indexOf("boldHeadline");
    
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
            if (textButtons_index >= 0) {
                msg["textButtons"] = variables[textButtons_index].split(",");
                path += '/Button';
                if (textConfirmation_index >= 0) {
                    msg["textConfirmation"] = variables[textConfirmation_index].split(",");
                }
        }
        if (boldHeadline_index >= 0) {
            path = "/sendOverflow/static"
            msg["boldHeadline"] = variables[boldHeadline_index];
            var fieldInformation = variables[callbackId_index].split(" ");
            var headlineLeftField = fieldInformation[1].split(",");
            var headlineRightField = fieldInformation[2].split(",");
            var textOptions = fieldInformation[3].split(",");
            var lengthOfFields;
            if (headlineLeftField.length > 4) {
                lengthOfFields = 4;
            } else {
                lengthOfFields = headlineLeftField.length;
            }
            if (headlineLeftField.length != headlineRightField.length) {
                console.log("Amount of given fields not equal")
            } else {
                var i;
                for (i = 1; i <= lengthOfFields; i++) {
                    var numberHeadlineLeftField = "headlineLeftField" + i;
                    var numberHeadlineRightField = "headlineRightField" + i;
                    msg[numberHeadlineLeftField] = headlineLeftField[i - 1];
                    msg[numberHeadlineRightField] = headlineRightField[i - 1];
                }
                path += numbers[textOptions.length] + "Option";
                if (textOptions.length > 1) {
                    path += "s";
                }
                path += numbers[lengthOfFields] + "Field";
                if (i > 2) {
                    path += "s";
                }
                headlineLeftField.splice(0, lengthOfFields);
                headlineRightField.splice(0, lengthOfFields);
            }
        }
    }
    var listOfChannels = variables[channel_index].split(',');
    for (var i = 0; i < listOfChannels.length; i++) {
        msg["channel"] = listOfChannels[i];
        var payload = JSON.stringify(msg);
        postToSwaggerAPI(payload, path);
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
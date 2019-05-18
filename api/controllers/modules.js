var maxChannels = 100;



module.exports = {
    postJsonToLocalhost: postJsonToLocalhost,
    preparePostMessage: preparePostMessage,
    createPDF: createPDF,
    getVariables: getVariables
};

function postJsonToLocalhost(msg, port, path){             //function to call Swagger API
    var http = require('http');
    var request = http.request({
    host:'localhost',
    port: 10010,
    method: port,
    path: path,
    headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    }
    }, function (error, res, body) {
	console.log(body);
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
    console.log(variables);
    var callbackId = `${process} processRegistration ${variables[0]} ${variables[4]}`;
    var listOfChannels = variables[3].split(',');

    for (var i = 0; i < listOfChannels.length; i++) {
        var msg = JSON.stringify({
            channel: listOfChannels[i], text: text, callbackId: callbackId,
            textButton1: "Anmelden", textButton2: "Abmelden"
        });
        var path = '/sendMsg/twoButtons';
        mod.postJsonToLocalhost(msg, 10010, path);
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
                    console.log(channel);
                    slackChannel = task.variables.get(channel);
                    console.log(slackChannel);
                    if (slackChannel == "undefined") {
                        throw ("Slack Channel(s) erfolgreich empfangen");
                    }
                } catch (e) {
                    console.log(e);
                    arrayOfVariables.push(stringWithChannels);
                    break;
                }
                stringWithChannels = stringWithChannels + "," + slackChannel;
            }
        }
        var variable = task.variables.get(variablesToGet[i])
        arrayOfVariables.push(variable);
        if(variablesToGet[i] == 'date') {
            arrayOfVariables.push(`${variable.getDate()}.${variable.getMonth()}.${variable.getFullYear()}`);
            arrayOfVariables.push(`${variable.getHours()}:${variable.getMinutes()}`);
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
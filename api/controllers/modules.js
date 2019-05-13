module.exports = {
    postToSlack: postToSlack,
    createPDF: createPDF,
    getVariables: getVariables
};

function postToSlack(msg, path){             //function to call Swagger API
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


function getVariables(task, variablesToGet) {    //function to get Variables from Camunda
    var arrayOfVariables = [];
    for(var i = 0; i < variablesToGet.length; i++) {
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
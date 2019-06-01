var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
var fs = require('fs');
pdfMake.vfs = pdfFonts.pdfMake.vfs;



client.subscribe("list", async function ({ task, taskService }) {
    var variables = mod.getVariables(task, );
    var listOfUsers = variables[2].split(','); 
    var channel = "CH513FYHY";
    var fileName = teilnehmerliste.pdf;

    var fonts = {
        Roboto: {
            normal: 'fonts/Roboto-Regular.ttf',
            bold: 'fonts/Roboto-Medium.ttf',
            italics: 'fonts/Roboto-Italic.ttf',
            bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
    };

    var PdfPrinter = require('../../../node_modules_pdfmake/src/printer');
    var printer = new PdfPrinter(fonts);

var dd = {
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
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
        listOfUsers
    ]

}
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(fileName));
    pdfDoc.end();

    var msg = JSON.stringify({
        channel: channel, fileName: fileName
    });
    var path = '/sendFile';
    mod.postToSwaggerAPI(msg, path);
});

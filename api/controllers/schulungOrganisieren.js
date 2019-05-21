var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
var fs = require('fs');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const { Client, logger } = require("camunda-external-task-client-js");
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
const client = new Client(config);
const { Variables } = require("camunda-external-task-client-js");
const mod = require('./modules');


module.exports = {
    getRoomNumber: getRoomNumber,
    startDialogToGetRoomNumber: startDialogToGetRoomNumber,
    confirmExecution: confirmExecution,
    startDialogToUpdateSubscriber: startDialogToUpdateSubscriber
};

function getRoomNumber(msg, taskid, res) {                      
    var pushedButton = msg.actions[0].value;      //evaluate pushed Button and react
    if(pushedButton == "two") {                    //Button not pushed so respond and complete task
        res.json({"response_type": "ephemeral", "replace_original": true,           
        "text": "Danke für dein Feedback! Ich erinnere dich morgen noch einmal."});  
        client.taskService.complete(taskid[2]);                                      
    } else if(pushedButton == "one") {                   //Button pushed so start dialog
        res.status(200).type('application/json').end();
        var callbackId = taskid[0] + " startDialogToGetRoomNumber " + taskid[2] + " " + msg.original_message.ts;
        var payload = JSON.stringify({triggerId: msg.trigger_id, callbackId: callbackId, 
        title: "Veranstaltungsort", label1: "Raum", name1: "raum", placeholder1: "z. B. EB222"});
        var path = '/startDialog/oneTextElement'; 
        mod.postToSwaggerAPI(msg, path);
    } else {console.log("ERROR (room)");} 
}

function startDialogToGetRoomNumber(msg,taskid, res) {
    if(msg.type == "dialog_submission") {      //if dialog not interrupted: get input value, set variable and complete task
        var room = msg.submission.raum;
        res.status(200).type('application/json').end();
        const pvariables = new Variables().set("room", room);
        client.taskService.complete(taskid[2], pvariables);   
        var text = "Raum " + room + " wurde erfolgreich hinterlegt."  
        payload = JSON.stringify({"channel": msg.channel.id, "text": text, "ts": taskid[3]});
        path = '/updateMsg'; 
        mod.postToSwaggerAPI(msg, path);  //update message with response Text
  } else {console.log("dialog interrupted");}   
}

function evaluatePushedButton(msg, taskid, res) {      
    var pushedButton = msg.actions[0].value;      //evaluate pushed Button and react
    var user = msg.user.id;
                           //when user is registered
        if(pushedButton == "two") {                                   //button pushed: "abmelden"
            listOfUsers.splice(userIndex);
            var teilnehmer = listOfUsers.join(",");
            const pvariables = new Variables().set("teilnehmer", teilnehmer);
            client.taskService.complete(taskid[2], pvariables);
            res.json({"response_type": "ephemeral", "replace_original": false,
            "text": "Erfolgreich abgemeldet!"});
        } else if(pushedButton == "one") {                           //button pushed: "anmelden"
            res.json({"response_type": "ephemeral", "replace_original": false,
            "text": "Du bist bereits angemeldet."});
        } else {console.log("Error (invite_defined)");}                                                        //when user is not registered
        if(pushedButton == "two") {                           //button pushed: "abmelden"
            res.json({"response_type": "ephemeral", "replace_original": false,
            "text": "Du bist bereits abgemeldet."}); 
        } else if(pushedButton == "one") {                       //button pushed: "anmelden"
            var teilnehmer;
      
            if(!taskid[3]) {                                         //if its the first sign in
                const pvariables = new Variables().set("ts", msg.message_ts);
                pvariables.set("teilnehmer", msg.user.name);
                client.taskService.complete(taskid[2], pvariables);
            } else {                                                  //2nd, 3rd, ... sign in
                teilnehmer = taskid[3] + "," + user;
                const pvariables = new Variables().set("teilnehmer", teilnehmer);
                client.taskService.complete(taskid[2], pvariables);
            } 
            res.json({"response_type": "ephemeral", "replace_original": false,
            "text": "Danke für deine Anmeldung!"});
        } else {console.log("Error (invite_undefined)");}    
}

function confirmExecution(msg, taskid, res) {                      
    res.status(200).type('application/json').end();      //Button pushed so start dialog
    var callbackId = `$taskid[0]} startDialogToUpdateSubscriber ${taskid[2]} ${msg.original_message.ts}`;
    var payload = JSON.stringify({triggerId: msg.trigger_id, callbackId: callbackId, 
    title: "Anpassung der Teilnehmer", label1: "Zusätzlich anwesend", name1: "add", placeholder1: "Name1,Name2,...", 
    label2: "Nicht anwesend trotz anmeldung", name2: "delete", placeholder2: "Name1,Name2,..."});
    var path = '/startDialog/twoTextElements'; 
    mod.postToSwaggerAPI(msg, path);
}

function startDialogToUpdateSubscriber(msg,taskid, res) {
    if(msg.type == "dialog_submission") {      //if dialog not interrupted: get input value, set variable and complete task
        var room = msg.submission.raum;
        res.status(200).type('application/json').end();
        const pvariables = new Variables().set("room", room);
        client.taskService.complete(taskid[2], pvariables);   
        var text = "Raum " + room + " wurde erfolgreich hinterlegt."
        var payload = JSON.stringify({"channel": msg.channel.id, "ts": taskid[3]});
        var path = '/deleteMsg'; 
        mod.postToSwaggerAPI(msg, path);            //update message with response Text
        payload = JSON.stringify({"channel": msg.channel.id, "text": text});
        path = '/sendMsg'; 
        mod.postToSwaggerAPI(msg, path);
    } else {console.log("dialog interrupted");}   
}





client.subscribe("room", async function({ task, taskService }) {
    var name = task.variables.get("name");
    var channel = "CH513FYHY";
    var text = `Wurde der Raum für die Schulung ${name} bereits gebucht?`;
    var callbackId = `${process} getRoomNumber ${task.id}`;
    var msg = JSON.stringify({channel: channel, text: text, callbackId: callbackId,
    textButton1: "Ja", textConfirmation1: "Wirklich gebucht?",
    textButton2: "Nein", textConfirmation2: "Nicht gebucht?"});
    var path = '/sendMsg/twoButtons/Confirm';
    mod.postToSwaggerAPI(msg, 10010, path);
});

client.subscribe("invite", async function ({ task, taskService }) {
    mod.preparePostMessage(task);
    await client.taskService.complete(task);
});

client.subscribe("update", async function({ task, taskService }) {
    var variables = mod.getVariables(task, ['name','room']);
    var text = `Der Raum für die Schulung ${variables[0]} steht fest: ${variables[1]}.`;
    var channel = "CH513FYHY";
    var msg = JSON.stringify({channel: channel, text: text});
    var path = '/sendMsg';
    mod.postToSwaggerAPI(msg, path);
    await client.taskService.complete(task);
});

client.subscribe("reminder", async function({ task, taskService }) {

    var variables = mod.getVariables(task, ['name', 'trainer', 'room', 'date']);
    var channel = "CH513FYHY";
    var text = `Reminder: Die Schulung ${variables[0]} findet am  ${variables[4]} um ${variables[5]} Uhr statt und wird von ${variables[1]} gehalten. Der Raum lautet ${variables[2]}.`;
    var msg = JSON.stringify({channel: channel, text: text});
    var path = '/sendMsg';
    mod.postToSwaggerAPI(msg, path);
    await client.taskService.complete(task);
});


client.subscribe("done", async function({ task, taskService }) {
    var channel = "CH513FYHY";
    var callbackId = `${process} confirmExecution ${task.id} ${teilnehmer}`;
    var text = `Wurde die Schulung ${task.variables.get("name")} erfolgreich durchgeführt?`;

    var msg = JSON.stringify({channel: channel, text: text, callbackId: callbackId, 
    ts: ts,textButton1: "Ja", textConfirmation1: "Bitte bestätigen"});
    var path = '/sendMsg/oneButtonConfirm';
    mod.postToSwaggerAPI(msg, path);
});

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

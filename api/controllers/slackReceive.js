var util = require('util');
var request = require('request');

module.exports = {
    slackReceive: slackReceive
};

function slackReceive(req, res) {                  //receive Slack POSTs after invoked action                                

    var msg = JSON.parse(req.swagger.params.payload.value); //get POST-Body and define Variables
    var taskid = msg.callback_id.split(' ');
    var process = taskid[0];
    var topic = taskid[1];


    if (process == "schulungOrganisieren") {            //call function depending on callback_id
        var callFunction = require('./schulungOrganisieren');
        if (topic == "getRoomNumber") { callFunction.getRoomNumber(msg, taskid, res); }
        else if (topic == "startDialogToGetRoomNumber") { callFunction.startDialogToGetRoomNumber(msg, taskid, res); }
        else if (topic == "processRegistration") { callFunction.processRegistration(msg, taskid, res); }
        else if (topic == "confirmExecution") { callFunction.confirmExecution(msg, taskid, res); }
        else if (topic == "startDialogToupdateParticipants") { callFunction.startDialogToupdateParticipants(msg, taskid, res); }
        else { console.log("ERROR (schulungOrganisieren)"); }
    }
    //else if(topic == "ProzessXY") {}  
    else { console.log("ERROR (process)"); }
}
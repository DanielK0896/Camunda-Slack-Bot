var util = require('util');
var request = require('request');
var FormData = require('form-data');
var fs = require('fs');
var secrets = require('../../secrets');
var headers = {'Authorization': secrets.Authorization, 'content-type': 'multipart/form-data'};



module.exports = {
    sendFile: sendFile
};


 
function sendFile(req, res) {

    msg = req.swagger.params.body.value;
    const formData = {
        
        channels: msg.channel,
        file: fs.createReadStream(__dirname + "/../../PDFs/" + msg.fileName),
    };
    request.post({url: 'https://slack.com/api/files.upload', headers: headers, formData: formData }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
    });



}

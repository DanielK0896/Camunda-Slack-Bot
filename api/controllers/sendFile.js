/* Pass channel and filename and send saved files (/.../.../PDFs/)*/

var request = require('request');
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
        if (error) throw new Error(error);
        res.json(body);
    });
}

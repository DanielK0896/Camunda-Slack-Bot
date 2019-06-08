/* Pass file (file id) to delete a message*/

var request = require('request');
var URL = "https://slack.com/api/files.delete";
var secrets = require('../../secrets');

module.exports = {
    fileDelete: fileDelete
};

function fileDelete(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "file": msg.file
    };
    var options = {
        method: 'POST',
        url: URL,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: secrets.Authorization,
            'Content-Type': 'application/json'
        },
        body: body,
        json: true
    };

    request(options, function (error, response, body) {
        if (!error) {
            var bodyStringified = JSON.stringify(body);
            res.json(bodyStringified);
            console.log(JSON.parse(bodyStringified))
        } else { console.log("ERROR deleteFile: " + error); }
    });
}



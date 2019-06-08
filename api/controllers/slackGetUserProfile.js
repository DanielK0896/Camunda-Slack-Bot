/* Pass channel and user to invite the user*/


var request = require('request');
var URL = "https://slack.com/api/users.profile.get";
var secrets = require('../../secrets');

module.exports = {
    slackGetUserProfile: slackGetUserProfile
};

function slackGetUserProfile(req, res) {
    var msg = req.swagger.params.body.value;
    var options = {
        method: 'GET',
        url: URL,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: secrets.Authorization,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: { "user": msg.user }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.json(body);
    });
}


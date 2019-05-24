
var request = require('request');
var URL = "https://slack.com/api/chat.postMessage";
var secrets = require('../../secrets');
var headers = { 'Authorization': secrets.Authorization, 'Content-Type': 'application/json' };

module.exports = {
    sendOverflowStaticOneField: sendOverflowStaticOneField,
    sendOverflowStaticTwoFields: sendOverflowStaticTwoFields,
    sendOverflowStaticThreeFields: sendOverflowStaticThreeFields,
    sendOverflowStaticFourFields: sendOverflowStaticFourFields,
    sendOverflowStaticFiveFields: sendOverflowStaticFiveFields
};

function sendOverflowStaticOneField(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": msg.boldHeadline
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField1
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField1
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption1,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption1,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            }
        ]
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}

function sendOverflowStaticTwoFields(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": msg.boldHeadline
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField1
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField1
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption1,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption1,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField2
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField2
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption2,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption2,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            }
        ]
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}

function sendOverflowStaticThreeFields(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": msg.boldHeadline
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField1
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField1
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption1,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption1,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField2
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField2
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption2,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption2,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField3
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField3
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption3,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption3,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            }
        ]
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}

function sendOverflowStaticFourFields(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": msg.boldHeadline
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField1
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField1
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption1,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption1,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField2
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField2
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption2,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption2,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField3
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField3
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption3,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption3,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField4
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField4
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption4,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption4,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            }
        ]
    };
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}

function sendOverflowStaticFiveFields(req, res) {
    var msg = req.swagger.params.body.value;
    var body = {
        "channel": msg.channel,
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": msg.boldHeadline
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField1
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField1
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption1,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption1,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField2
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField2
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption2,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption2,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField3
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField3
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption3,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption3,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField4
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField4
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption4,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.secondTextOption4,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": msg.headlineLeftField5
                    }, {
                        "type": "mrkdwn",
                        "text": msg.headlineRightField5
                    }],
                "accessory": {
                    "type": "static_select",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption5,
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": msg.firstTextOption5,
                                "emoji": true
                            },
                            "value": "value-1"
                        }
                    ]
                }
            }
        ]};
    request.post({ headers: headers, url: URL, body: body, json: true });
    res.status(200).type('application/json').end();
}


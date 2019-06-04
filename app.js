'use strict';

const { Client, logger } = require("camunda-external-task-client-js");
const configCamunda = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
const client = new Client(configCamunda);
const { Variables } = require("camunda-external-task-client-js");
const mod = require('./api/controllers/modules');
var listOfChannels = {};

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});

client.subscribe("invite", async function ({ task, taskService }) {
    mod.preparePostMessage(task);
    await client.taskService.complete(task);
});

client.subscribe("room", async function ({ task, taskService }) {
    mod.preparePostMessage(task);
    await client.taskService.complete(task);
});

client.subscribe("update", async function ({ task, taskService }) {
    mod.preparePostMessage(task);
    await client.taskService.complete(task);
});

client.subscribe("list", async function ({ task, taskService }) {
    await client.taskService.complete(task);
});

client.subscribe("reminder", async function ({ task, taskService }) {
    mod.preparePostMessage(task);
    await client.taskService.complete(task);
});

client.subscribe("done", async function ({ task, taskService }) {
    mod.preparePostMessage(task);
    await client.taskService.complete(task);
});

client.subscribe("sendParticipants", async function ({ task, taskService }) {
    mod.preparePostMessage(task);
    await client.taskService.complete(task);
});
setTimeout(function () {
    mod.getFromSwaggerAPI("/slackGet/channels", function (body) {
        var bodyParsed = JSON.parse(body);
        console.log(bodyParsed);
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        console.log(bodyParsed.channels);
        console.log(bodyParsed[channels]);
        console.log(bodyParsed.ok);
        console.log(bodyParsed[ok]);
        for (var prop in bodyParsed) {
            console.log(prop);
            listOfChannels = mod.pushSpecificVariables(listOfChannels, bodyParsed.channels[prop].id, "channels." + prop + ".name", bodyParsed);
            console.log(listOfChannels);
        }
    console.log("In der APP.js angekommen" + JSON.stringify(listOfChannels));
    });
    
}, 3000);

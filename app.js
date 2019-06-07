'use strict';

const { Client, logger } = require("camunda-external-task-client-js");
const configCamunda = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
const client = new Client(configCamunda);
const mod = require('./api/controllers/modules');

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
});

setTimeout(mod.getChannels, 1000);
setInterval(mod.getChannels, 300000);
//setTimeout(mod.getUsers, 500);
//setInterval(mod.getUsers, 300000);
setTimeout(function () {
    client.subscribe("invite", async function ({ task, taskService }) {
        var processVariables = mod.preparePostMessage(task);
        await client.taskService.complete(task, processVariables)
    });

    client.subscribe("room", async function ({ task, taskService }) {
        mod.preparePostMessage(task)
            .then((processVariables) => {
                await client.taskService.complete(task, processVariables)
            })
    });

    client.subscribe("update", async function ({ task, taskService }) {
        var processVariables = mod.preparePostMessage(task);
        await client.taskService.complete(task, processVariables)
    });

    client.subscribe("list", async function ({ task, taskService }) {
        //var processVariables = mod.preparePostMessage(task);
        await client.taskService.complete(task)
    });

    client.subscribe("reminder", async function ({ task, taskService }) {
        var processVariables = mod.preparePostMessage(task);
        await client.taskService.complete(task, processVariables)
    });

    client.subscribe("done", async function ({ task, taskService }) {
        var processVariables = mod.preparePostMessage(task);
        await client.taskService.complete(task, processVariables)
    });

    client.subscribe("sendParticipants", async function ({ task, taskService }) {
        var processVariables = mod.preparePostMessage(task);
        await client.taskService.complete(task, processVariables)
    });
    client.subscribe("delete", async function ({ task, taskService }) {
        var processVariables = mod.preparePostMessage(task);
        await client.taskService.complete(task, processVariables)
    });

}, 10000);


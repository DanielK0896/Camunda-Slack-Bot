'use strict';

const { Client, logger } = require("camunda-external-task-client-js");
const configCamunda = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
const client = new Client(configCamunda);
const { Variables } = require("camunda-external-task-client-js");
const mod = require('./api/controllers/modules');

module.exports = {
    exportVariables: exportVariables
};

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
    console.log(task);
    processVariables = mod.preparePostMessage(task);
    await client.taskService.complete(task, processVariables)
});

client.subscribe("room", async function ({ task, taskService }) {
    processVariables = mod.preparePostMessage(task);
    await client.taskService.complete(task, processVariables)
});

client.subscribe("update", async function ({ task, taskService }) {
    processVariables = mod.preparePostMessage(task);
    await client.taskService.complete(task, processVariables)
});

client.subscribe("list", async function ({ task, taskService }) {
    processVariables = mod.preparePostMessage(task);
    await client.taskService.complete(task, processVariables)
});

client.subscribe("reminder", async function ({ task, taskService }) {
    processVariables = mod.preparePostMessage(task);
    await client.taskService.complete(task, processVariables)
});

client.subscribe("done", async function ({ task, taskService }) {
    processVariables = mod.preparePostMessage(task);
    await client.taskService.complete(task, processVariables)
});

client.subscribe("sendParticipants", async function ({ task, taskService }) {
    processVariables = mod.preparePostMessage(task);
    await client.taskService.complete(task, processVariables)
    
});
var listOfAllChannels = setTimeout(mod.getChannels, 500);
var listOfAllLDAPUsers = setInterval(mod.getChannels, 300000);
//setTimeout(mod.getUsers, 500);
//setInterval(mod.getUsers, 300000);
function exportVariables() {
    return var array = [listOfAllLDAPUsers, listOfAllChannels];
};
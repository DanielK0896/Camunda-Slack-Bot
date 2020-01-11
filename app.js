'use strict';

const { Client, logger } = require("camunda-external-task-client-js");
const configCamunda = { baseUrl: "http://127.0.0.1:80/engine-rest", use: logger };
const client = new Client(configCamunda);
const mod = require('./api/controllers/modules');
const { Variables } = require("camunda-external-task-client-js");

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

setTimeout(mod.getChannels, 3000);
setInterval(mod.getChannels, 300000);
//setTimeout(mod.getUsers, 500);
//setInterval(mod.getUsers, 300000);
setTimeout(function () {

    client.subscribe("messageWithTSResponse", async function ({ task, taskService }) {
        var ts = await mod.preparePostMessage(task);
        const processVariables = new Variables();
        processVariables.set(task.activityId, ts);
        client.taskService.complete(task, processVariables);
    });
    client.subscribe("delete", async function ({ task, taskService }) {
        mod.preparePostMessage(task);
        await client.taskService.complete(task)
    });

}, 10000);


# Read also:

[Swagger API](https://github.com/swagger-api)

[Camunda external task client](https://github.com/camunda/camunda-external-task-client-js)

# Installing
```
npm install -s camunda-external-task-client-js 
```

and

```
npm install -g swagger
```

and

```
npm install --save form-data
```

and

```
npm install pdfmake
```

# Getting Started

1. Create a Slack-APP, set the Request URL (/Features/Interactive Components) and install the APP in workspace.
2. Get OAuth Tokens (/Features/OAuth & Permissions) and create a 'secret.json':

   ```
      {
         "Authorization": "Put your Bot User OAuth Access Token here",
         "AccessToken": Put your OAuth Access Token here"
      }
   ```

   
 # Call API
 
  
 Call the function and pass msg (JSON-String) and the path as a string.
 
 ```javascript
 function postToSlack(msg, path){
    var http = require('http');
    var request = http.request({
    host:'localhost',
    port: 10010,
    method: 'POST',
    path: path,
    headers: {
    'Content-Type': 'application/json',
    'Transfer-Encoding': 'chunked'
    }
}, function (response) {});
request.write(msg);
request.end();

}
 ```

## API

* #### [deleteMsg](docs/deleteMsg.MD)
* #### [deleteMsgScheduled](docs/deleteMsgScheduled.MD)
* #### [getPermalink](docs/getPermalink.MD)
* #### [/sendMsg](docs/sendMsg.MD)
  * #### [/sendMsg/oneButton](docs/sendMsg.MD#sendMsgoneButton)
  * #### [/sendMsg/oneButton/confirm](docs/sendMsg.MD#sendMsgoneButtonconfirm)
  * #### [/sendMsg/twoButtons](docs/sendMsg.MD#sendMsgtwoButtons)
  * #### [/sendMsg/twoButtons/confirm](docs/sendMsg.MD#sendMsgtwoButtonsconfirm)
* #### [/sendMsg/ephemeral](docs/sendMsgEphemeral.MD)
  * #### [/sendMsg/ephemeral/oneButton](docs/sendMsgEphemeral.MD#sendMsgephemeraloneButton)
  * #### [/sendMsg/ephemeral/oneButton/confirm](docs/sendMsgEphemeral.MD#sendMsgephemeraloneButtonconfirm)
  * #### [/sendMsg/ephemeral/twoButtons](docs/sendMsgEphemeral.MD#sendMsgephemeraltwoButtons)
  * #### [/sendMsg/ephemeral/twoButtons/confirm](docs/sendMsgEphemeral.MD#sendMsgephemeraltwoButtonsconfirm)
* #### [/sendMsg/schedule](docs/sendMsgSchedule.MD)
  * #### [/sendMsg/schedule/oneButton](docs/sendMsgSchedule.MD#sendMsgscheduleoneButton)
  * #### [/sendMsg/schedule/oneButton/confirm](docs/sendMsgSchedule.MD#sendMsgscheduleoneButtonconfirm)
  * #### [/sendMsg/schedule/twoButtons](docs/sendMsgSchedule.MD#sendMsgscheduletwoButtons)
  * #### [/sendMsg/schedule/twoButtons/confirm](docs/sendMsgSchedule.MD#sendMsgscheduletwoButtonsconfirm)
* #### [/startDialog](docs/startDialog.MD)
  * #### [/startDialog/oneTextElement](docs/startDialog.MD#startDialogoneTextElement)
  * #### [/startDialog/twoTextElements](docs/startDialog.MD#startDialogtwoTextElements)
* #### [/updateMsg](docs/updateMsg.MD)
  * #### [/updateMsg/oneButton](docs/updateMsg.MD#updateMsgoneButton)
  * #### [/updateMsg/oneButton/confirm](docs/updateMsg.MD#updateMsgoneButtonconfirm)
  * #### [/updateMsg/twoButtons](docs/updateMsg.MD#updateMsgtwoButtons)
  * #### [/updateMsg/twoButtons/confirm](docs/updateMsg.MD#updateMsgtwoButtonsconfirm)
# Authors
Daniel Köster - Initial work

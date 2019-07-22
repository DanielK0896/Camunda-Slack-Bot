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

# Getting Started

1. Create a Slack-APP, set the Request URL (/Features/Interactive Components) and install the APP in your workspace.
2. Set the slack request url to http://yourserver.de:10010/slackreceive.
3. Get OAuth Tokens (/Features/OAuth & Permissions) and create a 'secrets.json':

   ```
      {
         "Authorization": "Put your Bot User OAuth Access Token here"
      }
   ```
# Automatisation of processes:

## Starting process with slash commands

1. Go to Slash Commands and add new command
2. Request URL has to be: yourserver.de:10010/camunda/startProcess/{process}
3. {process} => enter your camunda process name here
4. optional: add start variables to your process by adding them to /api/controllers/processes.json
   ```
      [
         {
            "Schulung-Organisieren": {
               "name": {
                   "value": "",
                   "type": "String"
               }
            }
         }
      ]
   ```
5. Add the script to the sequence flow after the process start event. The script sets the correlationkeys startingUser (passed by the slack bot) and startMillis (current millies).

   ```
   var startingUser = execution.getVariable('startingUser');
   var startMillis= Date.now();
   correlationKey = "startingUser;startMillis;" + startingUser + ";" + startMillis;
   execution.setVariable("startMillis", startMillis.toString());
   execution.setVariable("correlationKey", correlationKey.toString());
   ```
   
## Interacting with users

### Basic messages with buttons

Add input variables to your camunda task (have a look at [/chat/post](docs/chatPost.MD)):
   1. variablesToGet **(Required)**-> list all your variables you want to pass, separatet by ";"
   2. channel **(Required)** -> channel **name** (!); you can add more than one by separating them using ";"
   3. text **(Required)** -> Basic text on top of the slack message
   4. [callbackId](docs/callbackId) -> if you add buttons
   5. textButtons -> visible button name, you can add more than one by separating them using ";"
   6. style -> adds a specific style to a button, you can add a style to every button using ";"
   7. textConfirmation -> visible confirmation headline, adds a confirmation dialog to a button, 
      you can add a confirmation to every button using ";"

**Mind:** You have to pass as many styles as you have textButtons. textConfirmation is optional, e. g. "Yes;;No" adds a confirmation to the first and third button with the headlines "Yes" and "No".

## Block messages

Add input variables to your camunda task (have a look at [/chat/post/block](docs/chatPostBlock.MD)):
   1. variablesToGet **(Required)**-> list all your variables you want to pass, separatet by ";"
   2. channel **(Required)** -> channel **name** (!); you can add more than one by separating them using ";"
   3. boldHeadline **(Required)** -> message headline
   4. leftField **(Required)** -> left field of a section text; amount of sections depends on length of leftFields; 
      you can add more than one by separating them using ";"
   5. rightField **(Required)** -> right field of a section text; can be empty, so you only have one text on the left; you can add more       than one by separating them using ";"
   6. actionId
   7. textOptions
   8. changes
   9. message
   10. buttonName
   11. buttonValue
   12. buttonActionId
   13. buttonMessage
   14. type
   15. confirm
   
   
   
   
//![Alt text](/pfad/zum/bild.jpg "Optionaler Titel")


## Swagger API (calling Slack API)
* #### [/channel/invite](docs/channelInvite.MD)
* #### [/channel/kick](docs//channel/kick.MD)
* #### [/chat/delete](docs/chatDelete.MD)
* #### [/chat/scheduled/delete](docs/chatScheduledDelete.MD)
* #### [/slackGet/permalink](docs/slackGetPermalink.MD)
* #### [/chat/post](docs/chatPost.MD)
* #### [/chat/post/ephemeral](docs/chatPostEphemeral.MD)
* #### [/chat/post/schedule](docs/chatPostSchedule.MD)
* #### [/chat/update](docs/chatUpdate.MD)
* #### [/chat/post/block](docs/chatPostBlock.MD)
* #### [/chat/update/block](docs/chatUpdateBlock.MD)
* #### [/dialog/open](docs/dialogOpen.MD)
* #### [/file/send](docs/fileSend.MD)
* #### [/file/delete](docs/fileDelete.MD)
* #### [/slackreceive](docs/slackReceive.MD)
* #### [/slackGet/conversations](docs/slackGetConversations.MD)
* #### [/slackGet/userProfile](docs/slackGetUserProfile.MD)

## Swagger API (calling Camunda API)

* #### [/camunda/startProcess/{process}](docs/camundaStartProcess.MD)
* #### [/camunda/sendMessage](docs/camundaSendMessage.MD)
* #### [/camunda/instance/getId](docs/camundaInstanceGetId.MD)
* #### [/camunda/instance/variable/delete](docs/camundaInstanceVariableDelete.MD)
* #### [/camunda/instance/variable/get](docs/camundaInstanceVariableGet.MD)



# Authors
Daniel Köster - Initial work June 2019

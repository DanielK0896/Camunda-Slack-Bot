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
2. Get OAuth Tokens (/Features/OAuth & Permissions) and create a 'secrets.json':

   ```
      {
         "Authorization": "Put your Bot User OAuth Access Token here"
      }
   ```

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

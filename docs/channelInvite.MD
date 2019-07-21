# /channelInvite

Invite a user into a slack channel

## Variables to pass

```
* channel (slack channel id -> string)
* user (slack user id -> string)
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, user: variable2});
```


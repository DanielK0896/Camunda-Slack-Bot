# /channel/kick

Kick a user out of a slack channel.

## Variables to pass

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `channel` | string  | slack channel id |
| `user` | string | slack user id |

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, user: variable2});
```


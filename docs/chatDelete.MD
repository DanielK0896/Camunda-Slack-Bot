# /chat/delete

Delete a specific message in a slack channel.
## Variables to pass

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `channel` | string  | slack channel id |
| `ts` | string | timestamp of the message |

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, ts: variable2});
```


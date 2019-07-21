# /chat/update/block

Update a specific block message in a slack channel. You have to pass a formatted message.


## Variables to pass

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `channel` | string  | slack channel id |
| `ts` | string  | timestamp of the message |
| `blocks` | string | formatted message|

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, ts: variable2, blocks: string});
```

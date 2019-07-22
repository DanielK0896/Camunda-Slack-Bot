# /camunda/instance/variable/delete

Delete a variable in an active instance.

## Variables to pass

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `instanceId` | string  | id of an active instance |
| `variable` | string | variable name|

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({instanceId: variable1, variabel: variable2});
```

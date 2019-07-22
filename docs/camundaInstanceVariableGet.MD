# /camunda/instance/variable/get

Get the value of a variable in an active instance.

## Variables to pass

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `instanceId` | string  | id of an active instance |
| `variableName` | string | name of a variable |

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({instanceId: variable1, variableName: variable2});
```

# /file/send

Send a file in a specific slack channel.

## Variables to pass

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `channel` | string  | slack channel id |
| `fileName` | string | name of the file, file has to be in a specific folder |



Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, fileName: variable2});
```

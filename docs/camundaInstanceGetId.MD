# /camunda/instance/getId

Get an instance Id.

## Variables to pass

**Mind:** The elements with the same index in several arrays belongs to each other!

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `correlationKey` | string  | key value pair to correlate message |


Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({correlationKey: variable1});
```

# /chat/post

Post a message into a slack channel. Message is created dynamically by the amount of passed array elements.

## Variables to pass

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `channel` | string  | slack channel id |
| `text` | string | slack user id |
| `callbackId` | string | id to identify message after interaction |
| `textButtons` | array with strings | every array element creates a textButton |
| `style` | array with strings | every array element adds a style to a textButton |
| `textConfirmation` | array with strings | optional textButton confirmation: every array element adds a headline |

**Remind:** The elements with the same index in several arrays belongs to each other!

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, callbackId: variable3, textButtons: array1, style: array2, textConfirmation: array3});
```

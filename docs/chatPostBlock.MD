# /chat/post/block

Post a block message into a slack channel. Message is created dynamically by the amount of passed array elements.

## Variables to pass

**Mind:** The elements with the same index in several arrays belongs to each other!

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `channel` | string  | slack channel id |
| `boldHeadline` | string  | block message headline (use * for a bold headline)|
| `leftField` | array with strings | block text |
| `rightField` | array with strings | optional: right text field |
| `actionId` | array with strings | action id to correlate user interactions|
| `textOptions` | array with strings | text options for a overflow or a select menu |
| `changes` | array with strings | optional: changes after user interactions |
| `message` | array with strings | informations to send a message back to camunda |
| `buttonName` | array with strings | optional: additional buttons placed at the end of the message|
| `buttonValue` | string | value of the button (similar to actionId) |
| `buttonActionId` | string | action id to correlate user interactions |
| `buttonMessage` | string | informations to send a message back to camunda |
| `type` | array with strings | type of action |
| `confirm` | array with strings | can be true or false for every button |

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, boldHeadline: variable2, leftField: array1, 
rightField: array2, actionId: array3, textOptions: array4, changes: array5, message: array6, 
buttonName: array7, buttonValue: variable3, buttonActionId: variable4, 
buttonMessage: variable5, type: array8, confirm: array9 });
```

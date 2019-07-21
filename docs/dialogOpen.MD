# /dialog/open

## Variables to pass

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `triggerId` | string  | id to correlate dialog window |
| `callbackId` | string | id to correlate user interaction |
| `title` | string  | title of the dialog |
| `label` | array with strings | label of the dialog elements |
| `name` | array with strings | name of the dialog element (not shown) |
| `placeholder` | array with strings | placeholder of the dialog element |
| `data_source` | array with strings | optional: type = select menu -> source for elements |
| `options` | array with strings | optional: options for a select menu |
| `maxLength` | array with strings | dialog element input maxLength |
| `minLength` | array with strings | dialog element input minLength |


Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({triggerId: variable1, callbackId: variable2, title: variable3, label: array1, 
name: array2, placeholder: array3, data_source: array4, options: array5, maxLength: array6, minLength: array7});
```

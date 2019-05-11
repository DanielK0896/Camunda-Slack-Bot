# /sendMsg

### Variables to pass

```
* channel
* text
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2});
```
  
## /sendMsg/oneButton

### Variables to pass

``` 
* channel
* text
* callbackId
* textButton1
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, callbackId: variable3, textButton1: variable4});
```
  
## /sendMsg/oneButton/confirm

### Variables to pass

``` 
* channel
* text
* callbackId
* textButton1
* textConfirmation1
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, callbackId: variable3, textButton1: variable4, 
textConfirmation1: variable5});
```

## /sendMsg/twoButtons

### Variables to pass

``` 
* channel
* text
* callbackId
* textButton1
* textButton2
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, callbackId: variable3, textButton1: variable4, 
textButton2: variable5});
```

## /sendMsg/twoButtons/confirm

### Variables to pass

``` 
* channel
* text
* callbackId
* textButton1
* textButton2
* textConfirmation1
* textConfirmation2
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, callbackId: variable3, textButton1: variable4, 
textButton2: variable5, textConfirmation1: variable6, textConfirmation2: variable7});
```

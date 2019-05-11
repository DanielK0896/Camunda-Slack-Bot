# /sendMessage/schedule/

## Variables to pass

```
* channel
* text
* postAt
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, postAt: variable3,});
```
  
## /sendMsg/schedule/oneButton

### Variables to pass

``` 
* channel
* text
* postAt
* callbackId
* textButton1
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, postAt: variable3, callbackId: variable4, 
textButton1: variable5});
```
  
## /sendMsg/schedule/oneButton/confirm

### Variables to pass

``` 
* channel
* text
* postAt
* callbackId
* textButton1
* textConfirmation1
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, postAt: variable3, callbackId: variable4, 
textButton1: variable5, textConfirmation1: variable6});
```

## /sendMsg/schedule/twoButtons

### Variables to pass

``` 
* channel
* text
* postAt
* callbackId
* textButton1
* textButton2
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, postAt: variable3, callbackId: variable4, 
textButton1: variable5, textButton2: variable6});
```

## /sendMsg/schedule/twoButtons/confirm

### Variables to pass

``` 
* channel
* text
* postAt
* callbackId
* textButton1
* textButton2
* textConfirmation1
* textConfirmation2
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, postAt: variable3, callbackId: variable4, 
textButton1: variable5, textButton2: variable6, textConfirmation1: variable7, textConfirmation2: variable8});
```

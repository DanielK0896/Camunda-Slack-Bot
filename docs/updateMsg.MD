# /updateMsg

## Variables to pass

```
* channel
* text
* ts
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, ts: variable3,});
```
  
## /updateMsg/oneButton

### Variables to pass

``` 
* channel
* text
* ts
* callbackId
* textButton1
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, ts: variable3, callbackId: variable4, 
textButton1: variable5});
```
  
## /updateMsg/oneButton/confirm

### Variables to pass

``` 
* channel
* text
* ts
* callbackId
* textButton1
* textConfirmation1
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, ts: variable3, callbackId: variable4, 
textButton1: variable5, textConfirmation1: variable6});
```

## /updateMsg/twoButtons

### Variables to pass

``` 
* channel
* text
* ts
* callbackId
* textButton1
* textButton2
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, ts: variable3, callbackId: variable4, 
textButton1: variable5, textButton2: variable6});
```

## /updateMsg/twoButtons/confirm

### Variables to pass

``` 
* channel
* text
* ts
* callbackId
* textButton1
* textButton2
* textConfirmation1
* textConfirmation2
```

Put your message in a JSON-String and pass it to Swagger API using a http request.

```javascript
var msg = JSON.stringifiy({channel: variable1, text: variable2, ts: variable3, callbackId: variable4, 
textButton1: variable5, textButton2: variable6, textConfirmation1: variable7, textConfirmation2: variable8});
```

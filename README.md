## eorzea.js

This is an open-source library for use in writing tools around Final Fantasy
XIV.

(Right now, it simply is a toolkit for dealing with in-game time.)


### Documentation

Like most nascent JavaScript projects, this code is sparsely documented.
As this library grows beyond a single object with three public methods, the
author promises to take documentation more seriously.

This library is written exclusively in ES5 (to avoid the need for transpiling),
but documentation will generally follow ES6 conventions.


### Installation

Install from npm:

```bash
$ npm install eorzea
```


### Eorzea Time

The `eorzea.Time` class provides a tool for calculating the current Eorzea
time, as well as representing Eorzea times:

```javascript
import eorzea from 'eorzea';

var t = new eorzea.Time(5, 30);
t.toString();  // '05:30:00'
```

The current Eorzea time can be requested with:

```javascript
import eorzea from 'eorzea';
var now = eorzea.Time.now();
```

A `strftime` method is provided on Eorzean timestamps:

```javascript
import eorzea from 'eorzea';

var t = new eorzea.Time(5, 30);
t.strftime('%I:%M %P');  // '05:30 AM'
```

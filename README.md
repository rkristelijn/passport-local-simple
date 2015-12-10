# passport-local-simple
A simple implementation of a LocalStrategy for passport.

## To Run This Example

```bash

npm install
npm start

```

## Explaination Of Code (Don't cut-paste this, use app.js)

Preliminary Stuff. Require your packages etc.

```javascript
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // a 'strategy' to use for passport
var bodyParser = require('body-parser'); // be able to parse form elements
var app = express();
```

## Our database

You can change this to pull from MySQL, Mongo, Etc.

```javascript
var users = [
    {id: 1, username: 'bob', password: 'secret', email: 'bob@example.com'}
    , {id: 2, username: 'scott', password: 'password', email: 'scott@example.com'}
];
```

## Our search function

Some examples you see this calling Mongo User.find, or something similar, essentially
this is just a way to invoke a callback, and search for users. You can also use this to
compare passwords if you want, but I'm not doing that here.

```javascript
function findByUsername(username, callback) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            // callback takes arguments (error,user)
            return callback(null, user);
        }
    }
    return callback(null, null);
}
```

## Set-up LocalStrategy

This tells passport to "use" a LocalStrategy and to map the username,password fields.

```javascript
passport.use(new LocalStrategy({
    // this maps the file names in the html file to the passport stuff
    usernameField: 'username',
    passwordField: 'password'
},
```

## Call the search function

This calls our db search function and invokes the callback 'done' with the arguments it's expecting. I'm also
performing my password comparison here.

```javascript
findByUsername(username, function (err, user) {
    if (err) {
        return done(err);
    }
    if (!user) {
        console.log('bad username');
        return done(null, false, {message: 'Incorrect username.'});
    } else {
        if (user.password === password) {
            console.log('good username and password');
            return done(null, user);
        } else {
            console.log('good username and bad password');
            return done(null, false, {message: 'Incorrect password.'});
        }
    }

});
```

## Configure Eexpress

This tells the app to use the public folder and to parse the body for form elements.

```javascript
// configure app
app.use('/', express.static('public')); // set to display index.html could also use sendFile
//app.use(bodyParser.json()); // use for JSON
app.use(bodyParser.urlencoded({extended: false})); // use for forms
```

## Create the custom callback

This is the custom callback for LocalStrategy that takes the arguments: error, user, and info.

```javascript
// custom callback
app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        console.log(err, user, info);
        if (user) {
            res.send({user: user});
        } else {
            res.send({error: err, info: info});
        }
    })(req, res, next);
});
```

## Start the app

Finally, tell the app to listen to a port.

```javascript
app.listen(3000);
```

Thanks!

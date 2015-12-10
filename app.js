var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // a 'strategy' to use for passport
var bodyParser = require('body-parser'); // be able to parse form elements
var app = express();

// this is our users database
// this can be used via mongo, mysql or any other thing, but no dependencies here!

var users = [
    {id: 1, username: 'bob', password: 'secret', email: 'bob@example.com'}
    , {id: 2, username: 'scott', password: 'password', email: 'scott@example.com'}
];

// this is our search function
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

// define what passport uses
passport.use(new LocalStrategy({
        // this maps the file names in the html file to the passport stuff
        usernameField: 'username',
        passwordField: 'password'
    },
    function (username, password, done) {
        // replace this with our search function, mysql/monogo/service/etc
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
    }
));

// configure app
app.use('/', express.static('public')); // set to display index.html could also use sendFile
//app.use(bodyParser.json()); // use for JSON
app.use(bodyParser.urlencoded({extended: false})); // use for forms

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

app.listen(3000);
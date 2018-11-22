const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const debug = false;
let app = express();

let users = [
  { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'scott', password: 'password', email: 'scott@example.com' }
];

let findByUsername = (username, callback) => {
  for (user of users) {
    if (user.username === username) return callback(null, user);
  }
  return callback(null, null);
}

passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
  (username, password, done) => {
    findByUsername(username, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      else {
        if (user.password === password) return done(null, user);
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  }
));

app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (user) res.send({ user: user });
    else res.send({ error: err, info: info });
  })(req, res, next);
});

module.exports = app;
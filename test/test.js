const request = require('request');
const assert = require('assert');
const app = require('../app');
const port = 3000;
const endpoint = `http://localhost:${port}`;

let user = { 'username': 'bob', 'password': 'wrongpw' };
let server;

describe('passport-local tests', function () {
    before(function (done) {
        server = app.listen(port, function () {
            done();
        });
    });
    after(function (done) {
        server.close();
        done();
    });
    describe('public routes', function () {
        it('GET / should return 200', function (done) {
            request.get(endpoint, function (err, res, body) {
                assert.equal(res.statusCode, 200, 'should return a normal page');
                done();
            });
        });
    });
    describe('authentication', function () {
        it('POST /login should return Missing credentials', function (done) {
            request({ url: `${endpoint}/login`, method: 'POST', json: { username: 'bob' } }, function (err, res, body) {
                assert.equal(body.info.message, 'Missing credentials', 'should return JSON with body.info.message to Missing credentials');
                done();
            });
        });
        it('POST /login should return Incorrect password', function (done) {
            request({ url: `${endpoint}/login`, method: 'POST', json: user }, function (err, res, body) {
                assert.equal(body.info.message, 'Incorrect password.');
                done();
            });
        });
        it('POST /login should return user', function (done) {
            user.password = 'secret';
            request({ url: `${endpoint}/login`, method: 'POST', json: user }, function (err, res, body) {
                assert.equal(body.user.username, 'bob');
                done();
            });
        });
        it('hello', function (done) {
            done();
        });
    });
});
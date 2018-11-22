const request = require('request');
const assert = require('assert');
const app = require('../app');
const port = 3000;
const endpoint = `http://localhost:${port}`;

let user = { 'username': 'bob', 'password': 'wrongpw' };
let server;

describe('passport-local tests', () => {
    before((done) => {
        server = app.listen(port, () => {
            done();
        });
    });
    after((done) => {
        server.close();
        done();
    });
    describe('public routes', () => {
        it('GET / should return 200', (done) => {
            request.get(endpoint, (err, res, body) =>  {
                assert.equal(res.statusCode, 200, 'should return a normal page');
                done();
            });
        });
    });
    describe('authentication', () => {
        it('POST /login should return Missing credentials', (done) => {
            request({ url: `${endpoint}/login`, method: 'POST', json: { username: 'bob' } }, (err, res, body) =>  {
                assert.equal(body.info.message, 'Missing credentials', 'should return JSON with body.info.message to Missing credentials');
                done();
            });
        });
        it('POST /login should return Incorrect password', (done) => {
            request({ url: `${endpoint}/login`, method: 'POST', json: user }, (err, res, body) =>  {
                assert.equal(body.info.message, 'Incorrect password.');
                done();
            });
        });
        it('POST /login should return user', (done) => {
            user.password = 'secret';
            request({ url: `${endpoint}/login`, method: 'POST', json: user }, (err, res, body) =>  {
                assert.equal(body.user.username, 'bob');
                done();
            });
        });
    });
});
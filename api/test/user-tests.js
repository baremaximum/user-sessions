'use strict'

const bootstrap = require('./test-bootstrap');

const User = require('../db/models/user-model');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

describe('Test user registration endpoint', () => {
    let CONN, app, server;
    before(async () => {
        // Set up a testing version of the application before running tests.
        ({CONN: CONN, app: app, server: server} = await bootstrap());

        // Add an existing user for tests where user already exists
        const existingUser = {
            username: 'existing_user',
            password: 'existing_password',
            email: 'existing@test.com'
        }

        const user = new User(existingUser)
        await user.save();
        
    })

    after(async () => {
        // Delete all users from DB after tests are done running.
        await CONN.connections[0].collections['users'].drop();
    })

    it('should respond with status 201 when valid registration request is sent', async () => {
        const userData = {
            username: 'test_user',
            password: 'test_password',
            email: 'test@test.com'
        }

        const response = await chai.request(app)
            .post('/users/register')
            .send(userData);

        expect(response).to.have.status(201);
    })

    it('should respond with 400 error code if invalid request is sent', async () => {
        const userData = {
            password: 'test_password',
            email: 'fudge@fudge.com'
        }

        const response = await chai.request(app)
            .post('/users/register')
            .send(userData);

        expect(response).to.have.status(400);
    })

    it('should respond with 400 error code if email validation fails', async () => {

        const userData = {
            username: 'test_user',
            password: 'test_password',
            email: 'abcdefg'
        }
        const response = await chai.request(app)
            .post('/users/register')
            .send(userData)

        expect(response).to.have.status(400);
    })

    it('should return with 400 error code if username is already being used', async () => {
        const userData = {
            username: 'test',
            password: 'existing_password',
            email: 'existing@test.com'
        }

        const response = await chai.request(app)
        .post('/users/register')
        .send(userData)
        expect(response).to.have.status(400);
    })
})
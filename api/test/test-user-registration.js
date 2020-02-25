/**
 * Integration tests for user registration endpoint.
 */
'use strict'

const bootstrap = require('./setup/test-bootstrap');

const User = require('../db/models/user-model');
const register = require('../services/user/register-user-service');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised)
chai.use(chaiHttp);

describe('Test user registration endpoint', () => {
    let CONN, app, server;
    before(async () => {
        // Set up a testing version of the application before running tests.
        ({CONN: CONN, app: app, server: server} = await bootstrap());

        const userData = {
            username: 'test',
            password: 'existing_password',
            email: 'existing@test.com'
        }

        register(userData);

    })

    after(async () => {
        // Delete all users from DB after tests are done running.
        await User.deleteMany({})
        await CONN.connections[0].close();
        // Close application
        await server.close();
        
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

    
    it('should raise validation error if email invalid', async () => {

        const userData = {
            username: "test_2",
            password: 'test_password',
            email: 'fffff'
        }
        
        // must return the expect for promise rejections to be properly picked up by mocha
        return expect(register(userData)).to.eventually.be.rejected
            .and.be.an.instanceOf(Error)
    })

    it('should raise validation error if username is already being used', async () => {
        const userData = {
            username: 'test',
            password: 'existing_password',
            email: 'existing@test.com'
        }

       // must return the expect for promise rejections to be properly picked up by mocha
       return expect(register(userData)).to.eventually.be.rejected
       .and.be.an.instanceOf(Error)
    })

    it('should save a valid activation token in the activation_token field on the user record', async () => {
        const userData = {
            username: 'test_user_2',
            password: 'test_password',
            email: 'test_2@test.com'
        }

        const user = await register(userData);

        //test that an activation_token string was indeed inserted into the record
        expect(user.activation_token).to.be.a('string')
        
    })


    it('should save password in encrypted format only', async () => {
        const userData = {
            username: 'test_user_3',
            password: 'test_password',
            email: 'test_3@test.com'
        }

        const user = await register(userData);
        //test that an activation_token string was indeed inserted into the record
        expect(user.password).to.not.equal("test_password")
    })

})
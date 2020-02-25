/**
 * Integration tests pertaining to user account activation.
 */
'use strict';

const bootstrap = require('./setup/test-bootstrap');
const User = require('../db/models/user-model');
const register = require('../services/user/register-user-service');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised)
chai.use(chaiHttp);


describe('Test user account activation endpoint and associated service layer', () => {
    let CONN, app, server, user, userData;

    before(async () => {
        // Set up a testing version of the application before running tests.
        ({CONN: CONN, app: app, server: server} = await bootstrap());

        userData = {
            username: 'test',
            password: 'test',
            email: "test@test.com"
        }

        user = await register(userData);

    })

    after(async () => {

        // Delete all users from DB after tests are done running.
        await User.deleteMany({})
        await CONN.connections[0].close();
        // Close application
        await server.close();
        
    })

    it('should respond with 201 status code when request is properly formatted', async () => {

        const response = await chai.request(app)
            .put(`/users/activate/${userData.email}/${user.activation_token}`)

        expect(response).to.have.status(201)
    })

    it('should respond with 404 status if email is missing', async () => {

        const response = await chai.request(app)
            .put(`/users/activate/${user.activation_token}`)

        expect(response).to.have.status(404)
    })

    it('should respond with 404 status if token is missing', async () => {

        const response = await chai.request(app)
            .put(`/users/activate/${userData.email}`)

        expect(response).to.have.status(404)
    })

    it('should respond with 404 status if token and email are incorrect', async () => {

        const response = await chai.request(app)
            .put(`/users/activate/fff/aaa`)

        expect(response).to.have.status(404)
    })
    
})
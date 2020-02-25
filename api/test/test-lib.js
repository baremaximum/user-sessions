/**
 * Unit tests for functions found in the lib directory.
 */
'use strict';

const chai = require('chai');
const { expect } = chai;

const genHash = require('../lib/hash')
const encrypt = require('../lib/encrypt');
const activationLink = require('../lib/activation-link');



describe('test hash generation function', () => {

    it('should return a valid base64 string', () => {
        const hash = genHash();
        // Testing against this regex guarantees that string encoding is valid base64. i.e. buffer > utf-8 fails this test.
        const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        
        expect(base64regex.test(hash)).to.be.true;
    })
})

describe('test string encryption function', () => {
    it('should return an encrypted version of the input string', async () => {
        const input = "hereisarandomstringfortesting"
        const hashed = await encrypt(input);
        
        // if the strings are different, then that shoudl be enough. We can assume that bcrypt works.
        expect(hashed).to.be.a('string');
        expect(hashed).to.not.equal(input);
    })
})

describe('test activation link generator', () => {
    it('should generate a link to host with email first, token second', () => {
        const host = process.env.HOST_URL;
        const expected = `${host}/fff/aaa`

        const email = "fff";
        const token = "aaa";

        const result = activationLink(email, token)

        expect(result).to.equal(expected);
    })
})
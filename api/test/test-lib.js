/**
 * Unit tests for functions found in the lib directory.
 */
'use strict';

const chai = require('chai');
const { expect } = chai;

const genHash = require('../lib/generate-hash')


describe('test hash generation function', () => {

    it('should return a valid base64 string', () => {
        const hash = genHash();
        // Testing against this regex guarantees that string encoding is valid base64. i.e. buffer > utf-8 fails this test.
        const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        
        expect(base64regex.test(hash)).to.be.true;
    })
})
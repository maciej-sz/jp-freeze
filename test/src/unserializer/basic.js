"use strict";
var assert = require('assert');
var expect = require('expect.js');
var fs = require('fs');
var JpFreeze = require('../../../src/lib/jp-freeze');
var TestHelper = require('../../helper');

describe("Basic unserialization", function(){

    describe("Scalar unserialization", function(){
        var freeze = new JpFreeze();
        var testData = [
            {expected: 1234, file: "scalar01.json"},
            {expected: 123.45, file: "scalar02.json"},
            {expected: "foo", file: "scalar03.json"},
            {expected: true, file: "scalar04.json"},
            {expected: false, file: "scalar05.json"},
            {expected: null, file: "scalar06.json"}
        ];
        for ( var i in testData ) {
            if ( !testData.hasOwnProperty(i) ) {
                continue;
            }
            var data = testData[i];
            var serialized = new TestHelper().getJson(data.file);
            var res = freeze.unserialize(serialized);
            var msg = "Unserialized "
                + testData[i].file
                + " should be equal to "
                + testData[i].expected
                ;
            it(msg, function(res, data, done){
                assert(res === data.expected);
                done();
            }.bind(this, res, data));
        }
    });

    describe("List of scalars unserialization", function(){
        it("Should be a valid unserialized array", function(){
            var freeze = new JpFreeze();
            var serialized = new TestHelper().getJson("listOfScalars.json");
            var expected = [
                1234,
                123.45,
                "foo",
                true,
                false,
                null
            ];

            expect(freeze.unserialize(serialized)).to.eql(expected);
        })
    });

});
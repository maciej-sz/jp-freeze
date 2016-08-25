"use strict";
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var fs = require('fs');
var JpFreeze = require('../../../src/lib/jp-freeze');
var TestHelper = require('../../helper');
var UnserializationError = require('../../../src/lib/util/jp-unserializer').UnserializationError;

chai.should();

describe("Basic unserialization", function(){
    var freeze = new JpFreeze();
    
    describe("Scalar unserialization", function(){

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

    describe("Invalid JSON unserialization", function(){

        it("Should throw an error", function(){
            expect(function () {
                freeze.unserialize(123);
            }).to.throw(UnserializationError)
        });

    });

    describe("JSON without root unserialization", function(){

        it("Should throw an error", function(){
            expect(function () {
                freeze.unserialize({});
            }).to.throw(UnserializationError);
        });

    });

    describe("Class unserialization", function(){
        it("Should evaluate to simple object", function(){

            var serialized = new TestHelper().getJson("user.json");
            var expected = {
                "name": "John",
                "email": "john@example.com",
                "joined": "2016-01-01 11:12:32",
                "entries": []
            };
            expect(freeze.unserialize(serialized)).to.eql(expected);
        })
    });

    describe("Direct circular recursion", function(){

        var serialized = new TestHelper().getJson("directCircularRecursion.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should be of type object", function(){
            assert("object" === typeof unserialized);
        });

        it("Should contain itself", function(){
            assert(unserialized.std === unserialized);
        });
    });


    describe("Level 1 array recursion", function(){

        var serialized = new TestHelper().getJson("level1ArrayRecursion.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should have a valid root", function(){
            expect(unserialized.title).to.eql("Thread title");
            expect(unserialized.contents).to.eql("Thread contents");
        });

        it("Should have valid aggregates", function(){
            var post1 = unserialized.posts[0];
            var post2 = unserialized.posts[1];

            expect(post1.Author).to.eql(null);
            expect(post1.title).to.eql("Post #1");
            expect(post1.contents).to.eql("foo");

            expect(post2.Author).to.eql(null);
            expect(post2.title).to.eql("Post #2");
            expect(post2.contents).to.eql("bar");
        });

        it("Should reference valid root", function(){
            assert(unserialized === unserialized.posts[0].Thread);
            assert(unserialized === unserialized.posts[1].Thread);
        });
    });

    describe("Simple array with empty object", function(){
        
        var serialized = new TestHelper().getJson("simpleArrayWithEmptyObject.json");
        var unserialized = freeze.unserialize(serialized);

        assert(unserialized instanceof Array);
        assert(unserialized[0] === 123);
        assert(unserialized[1] === "foo");
        expect(unserialized[2]).to.eql({});
    });

    describe("Nested arrays", function(){
        var serialized = new TestHelper().getJson("nestedArrays.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should contain valid data and structure", function(){
            assert(unserialized instanceof Array);
            expect(unserialized[0]).to.eql(123);
            assert(unserialized[1] instanceof Array);
            expect(unserialized[1][0]).to.eql("foo");
            expect(unserialized[1][1]).to.eql("bar");
        });
    });

    describe("Nested arrays with objects", function(){

        var serialized = new TestHelper().getJson("nestedArraysWithObjects.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should contain valid data and structure", function(){
            assert(unserialized instanceof Array);
            assert(unserialized[0].data === "foo");
            assert(unserialized[1].title === "post");
            assert(unserialized[2] instanceof Array);
            assert(unserialized[0] === unserialized[2][0]);
            assert(unserialized[1] === unserialized[2][1]);
        });

    });

    describe("Nested arrays with objects and data", function(){

        var serialized = new TestHelper().getJson("nestedArraysWithObjectsAndData.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should contain valid data and structure", function(){
            assert(unserialized instanceof Array);
            assert(123 === unserialized[0]);
            assert(unserialized[1] instanceof Array);
            assert("foo" === unserialized[1][0].data);
            assert("post" === unserialized[1][2].title);
            assert(unserialized[1][0] === unserialized[1][1]);
            assert(unserialized[1][2] === unserialized[1][3]);
        });

    });

});
"use strict";
var assert = require('assert');
var expect = require('expect.js');
var JpFreeze = require('../../../src/lib/jp-freeze');
var TestHelper = require('../../helper');

describe("Advanced circular recursion", function(){

    var freeze = new JpFreeze();
    
    describe("Basic structure", function(){

        var serialized = new TestHelper().getJson("deepCircularRecursion_01.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should have a valid root", function(){
            expect(unserialized.title).to.eql("Thread title");
        });

        it("Should have valid aggregates", function(){
            expect(unserialized.posts[0].title).to.eql("Post #1");
            expect(unserialized.posts[1].title).to.eql("Post #2");
        });

        it("Should reference valid root", function(){
            assert(unserialized.posts[0].Thread === unserialized);
            assert(unserialized.posts[1].Thread === unserialized);
        });

        it("Should reference valid authors", function(){
            expect(unserialized.posts[0].Author.name).to.eql("John");
            expect(unserialized.posts[1].Author.name).to.eql("Kelly");
        });

    });

    describe("Basic structure from inside", function(){

        var serialized = new TestHelper().getJson("deepCircularRecursion_01a.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should have a valid root", function(){
            expect(unserialized.title).to.eql("Post #1");
        });

        it("Should reference valid 1st level objects", function(){
            expect(unserialized.Thread.title).to.eql("Thread title");
            expect(unserialized.Author.name).to.eql("John");
        });

        it("Should reference valid 2nd level objects", function(){
            assert(unserialized.Thread.posts[0] === unserialized);
            expect(unserialized.Thread.posts[1].title).to.eql("Post #2");
        });

    });

    describe("Multiple circular references", function(){

        var serialized = new TestHelper().getJson("deepCircularRecursion_02.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should reference same object twice", function(){
            expect(unserialized.Author.name).to.eql("Kelly");
            assert(unserialized.Author === unserialized.posts[1].Author);
        });

    });

    describe("Even more circular recursions", function(){

        var serialized = new TestHelper().getJson("deepCircularRecursion_03.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should have right basic structure", function(){
            expect(unserialized.title).to.eql("Thread title");

            expect(unserialized.Author.name).to.eql("Kelly");
            expect(unserialized.posts[0].title).to.eql("Post #1");
            expect(unserialized.posts[1].title).to.eql("Post #2");

            expect(unserialized.posts[0].Author.name).to.eql("John");
        });

        it("Should be valid multiple reference", function(){
            assert(unserialized.posts[0].Thread === unserialized);
            assert(unserialized.posts[1].Thread === unserialized);

            assert(unserialized.Author.entries[0] === unserialized);
            assert(unserialized.Author.entries[1] === unserialized.posts[1]);

            assert(unserialized.posts[0].Author.entries[0] === unserialized.posts[0]);
        });

    });

    describe("More circular recursions form inside", function(){

        var serialized = new TestHelper().getJson("deepCircularRecursion_03a.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should have right basic structure", function(){
            expect(unserialized.name).to.eql("Kelly");

            expect(unserialized.entries[0].title).to.eql("Thread title");
            expect(unserialized.entries[1].title).to.eql("Post #2");

            expect(unserialized.entries[0].posts[0].title).to.eql("Post #1");
            expect(unserialized.entries[0].posts[0].Author.name).to.eql("John");
        });

        it("Should be valid multiple reference", function(){
            assert(unserialized.entries[0].Author === unserialized);
            assert(unserialized.entries[0].posts[1].Author === unserialized);
            assert(unserialized.entries[1].Author === unserialized);
            assert(unserialized.entries[1].Thread === unserialized.entries[0]);
            assert(
                unserialized.entries[1].Thread.posts[0].Author.entries[0]
                === unserialized.entries[1].Thread.posts[0]
            );
        });

    });


    describe("Recursive container", function(){

        var serialized = new TestHelper().getJson("recursiveContainer.json");
        var unserialized = freeze.unserialize(serialized);

        it("Should contain valid data", function(){
            assert(unserialized.Data1.a === "a");
            assert(unserialized.Data1.b === "b");
        });

        it("Should reference valid objects", function(){
            assert(unserialized.Data1 === unserialized.Data2);
            assert(unserialized.Data1.Container === unserialized);
        });

    });

});
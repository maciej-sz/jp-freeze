/// <reference path="../typings/index.d.ts" />

import fs = require("fs");

class TestHelper {
    private dir:string;

    constructor(dir:string = null) {
        if ( null === dir ) {
            dir = __dirname + "/data";
        }
        this.dir = dir;
    }

    public getContents(file:string):string {
        return fs.readFileSync(this.dir + "/" + file).toString();
    }

    public getJson(file:string):{}|Array<any> {
        let contents:string = this.getContents(file);
        return JSON.parse(contents);
    }
}

export = TestHelper;
/// <reference path="../typings/index.d.ts" />
var fs = require("fs");
var TestHelper = (function () {
    function TestHelper(dir) {
        if (dir === void 0) { dir = null; }
        if (null === dir) {
            dir = __dirname + "/data";
        }
        this.dir = dir;
    }
    TestHelper.prototype.getContents = function (file) {
        return fs.readFileSync(this.dir + "/" + file).toString();
    };
    TestHelper.prototype.getJson = function (file) {
        var contents = this.getContents(file);
        return JSON.parse(contents);
    };
    return TestHelper;
}());
module.exports = TestHelper;
//# sourceMappingURL=helper.js.map
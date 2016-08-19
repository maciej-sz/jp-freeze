var util_1 = require("./util");
var JpUnserializeProcess = (function () {
    function JpUnserializeProcess(original) {
        this._original = original;
        this.unserializedReferences = {};
    }
    Object.defineProperty(JpUnserializeProcess.prototype, "original", {
        get: function () {
            return this._original;
        },
        enumerable: true,
        configurable: true
    });
    JpUnserializeProcess.prototype.putObject = function (pos, obj) {
        this.unserializedReferences[pos] = obj;
    };
    JpUnserializeProcess.prototype.tryGetObject = function (idx) {
        if (!this.unserializedReferences.hasOwnProperty(idx)) {
            return null;
        }
        return this.unserializedReferences[idx];
    };
    return JpUnserializeProcess;
}());
exports.JpUnserializeProcess = JpUnserializeProcess;
var JpUnserializer = (function () {
    function JpUnserializer() {
    }
    JpUnserializer.prototype.unserialize = function (mValue, process) {
        if (null === mValue) {
            return null;
        }
        else if (null !== util_1.Util.tryExtractIdx(mValue)) {
            return this.unserializeObject(mValue, process);
        }
        else if (mValue instanceof Array) {
            return this.unserializeArray(mValue, process);
        }
        return mValue;
        // throw new Error("Don't know how to unserialize");
    };
    JpUnserializer.prototype.unserializeObject = function (mValue, process) {
        var idx = util_1.Util.tryExtractIdx(mValue);
        var instance = process.tryGetObject(idx);
        if (null !== instance) {
            return instance;
        }
        instance = {};
        process.putObject(idx, instance);
        var obj = process.original.objects[idx];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                instance[prop] = this.unserialize(obj[prop], process);
            }
        }
        return instance;
    };
    JpUnserializer.prototype.unserializeArray = function (arr, process) {
        var res = [];
        for (var key in arr) {
            if (arr.hasOwnProperty(key)) {
                res[key] = this.unserialize(arr[key], process);
            }
        }
        return res;
    };
    return JpUnserializer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JpUnserializer;
//# sourceMappingURL=jp-unserializer.js.map
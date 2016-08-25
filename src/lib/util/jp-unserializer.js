var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var util_1 = require("./util");
var UnserializationError = (function (_super) {
    __extends(UnserializationError, _super);
    function UnserializationError() {
        _super.apply(this, arguments);
    }
    return UnserializationError;
}(Error));
exports.UnserializationError = UnserializationError;
var SerializedObjectValidator = (function () {
    function SerializedObjectValidator() {
    }
    SerializedObjectValidator.prototype.validateThrow = function (mSerialized) {
        if (!util_1.Util.isObject(mSerialized)) {
            throw new UnserializationError("Serialized value must be an object");
        }
        if (undefined === mSerialized.root) {
            throw new UnserializationError("Serialized value must have a root");
        }
    };
    return SerializedObjectValidator;
}());
var JpUnserializeProcess = (function () {
    function JpUnserializeProcess(original) {
        new SerializedObjectValidator().validateThrow(original);
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
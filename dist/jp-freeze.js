(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JpFreeze = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var jp_unserializer_1 = require("./util/jp-unserializer");
var jp_unserializer_2 = require("./util/jp-unserializer");
var JpFreeze = (function () {
    function JpFreeze() {
    }
    JpFreeze.prototype.unserialize = function (mValue) {
        var process = new jp_unserializer_2.JpUnserializeProcess(mValue);
        return new jp_unserializer_1.default().unserialize(mValue.root, process);
    };
    return JpFreeze;
}());
module.exports = JpFreeze;

},{"./util/jp-unserializer":2}],2:[function(require,module,exports){
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

},{"./util":3}],3:[function(require,module,exports){
var REFERENCE_PREFIX = "##ref##";
var IDX_PREFIX = "0x";
var Util = (function () {
    function Util() {
    }
    Util.tryExtractIdx = function (mValue) {
        if (!Util.isString(mValue)) {
            return null;
        }
        var str = mValue;
        if (REFERENCE_PREFIX !== str.substr(0, REFERENCE_PREFIX.length)) {
            return null;
        }
        return str.substr(REFERENCE_PREFIX.length);
    };
    Util.tryExtractSeenPos = function (mValue) {
        var idx = Util.tryExtractIdx(mValue);
        if (null === idx) {
            return null;
        }
        if (!Util.isString(mValue)) {
            return null;
        }
        var val = mValue;
        if (IDX_PREFIX !== val.substr(0, IDX_PREFIX.length)) {
            return null;
        }
        var pos = val.substr(IDX_PREFIX.length);
        return parseInt(pos);
    };
    Util.buildIdx = function (pos) {
        return IDX_PREFIX + pos;
    };
    Util.buildReference = function (pos) {
        return REFERENCE_PREFIX + Util.buildIdx(pos);
    };
    Util.isScalar = function (mValue) {
        if (null === mValue) {
            return true;
        }
        else if ("number" === typeof mValue) {
            return true;
        }
        else if ("string" === typeof mValue) {
            return true;
        }
        else if ("boolean" === typeof mValue) {
            return true;
        }
        return false;
    };
    Util.isString = function (mValue) {
        return "string" === typeof mValue;
    };
    Util.isObject = function (mValue) {
        return "object" === typeof mValue;
    };
    Util.isArray = function (mValue) {
        return mValue instanceof Array;
    };
    return Util;
}());
exports.Util = Util;

},{}]},{},[1])(1)
});
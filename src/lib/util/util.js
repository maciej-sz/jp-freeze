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
//# sourceMappingURL=util.js.map
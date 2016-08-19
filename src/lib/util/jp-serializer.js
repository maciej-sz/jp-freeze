var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var util_1 = require("./util");
var JpSerializationProcess = (function () {
    function JpSerializationProcess(meta) {
        if (meta === void 0) { meta = null; }
        // private pathReferences:{ [key: string] : string };
        this.meta = null;
        if (null === meta) {
            meta = {
                "classes": [],
                "versions": []
            };
        }
        this.meta = meta;
        this.seen = [];
    }
    JpSerializationProcess.prototype.hasSeen = function (obj) {
        if (!util_1.Util.isObject(obj)) {
            return false;
        }
        return this.seen.indexOf(obj) > -1;
    };
    JpSerializationProcess.prototype.putSeen = function (obj) {
        var pos = this.seen.length;
        // let idx:string = "0x" + pos;
        this.seen[pos] = obj;
        return pos;
    };
    JpSerializationProcess.prototype.getSeenPos = function (obj) {
        if (!util_1.Util.isObject(obj)) {
            return -1;
        }
        return this.seen.indexOf(obj);
    };
    JpSerializationProcess.prototype.putObjectRepresentation = function (pos, serialized) {
        this.serializedObjects[pos] = serialized;
    };
    JpSerializationProcess.prototype.makeResult = function (original, serialized) {
        var seenPos = this.getSeenPos(original);
        if (seenPos > -1) {
            serialized = util_1.Util.buildReference(seenPos);
        }
        return new JpSerializationResult(serialized, this.serializedObjects, this.meta);
    };
    return JpSerializationProcess;
}());
exports.JpSerializationProcess = JpSerializationProcess;
var JpSerializationResult = (function () {
    function JpSerializationResult(root, objects, meta) {
        this._root = root;
        this.objects = objects;
        this.meta = meta;
    }
    Object.defineProperty(JpSerializationResult.prototype, "rawRoot", {
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JpSerializationResult.prototype, "root", {
        get: function () {
            var seenPos = util_1.Util.tryExtractSeenPos(this._root);
            if (null !== seenPos) {
                return this.objects[seenPos];
            }
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JpSerializationResult.prototype, "serialized", {
        get: function () {
            var objects = {};
            for (var i in this.objects) {
                if (!this.objects.hasOwnProperty(i)) {
                    continue;
                }
                var idx = util_1.Util.buildIdx(parseInt(i));
                objects[idx] = this.objects[i];
            }
            return {
                "root": this._root,
                "objects": objects,
                "meta": this.meta
            };
        },
        enumerable: true,
        configurable: true
    });
    return JpSerializationResult;
}());
exports.JpSerializationResult = JpSerializationResult;
var ASerializeWorkUnit = (function () {
    function ASerializeWorkUnit(serializer, process) {
        this.serializer = serializer;
        this.process = process;
    }
    return ASerializeWorkUnit;
}());
var SerializeTraversable = (function (_super) {
    __extends(SerializeTraversable, _super);
    function SerializeTraversable() {
        _super.apply(this, arguments);
    }
    SerializeTraversable.prototype.serialize = function (obj) {
        var items = {};
        if (util_1.Util.isArray(obj)) {
            items = [];
        }
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) {
                continue;
            }
            var mVal = obj[i];
            var seenPos = this.process.getSeenPos(mVal);
            if (seenPos > -1) {
                items[i] = util_1.Util.buildReference(seenPos);
            }
            else {
                var subRes = this.serializer.serialize(mVal, this.process);
                items[i] = subRes.rawRoot;
            }
        }
        return items;
    };
    return SerializeTraversable;
}(ASerializeWorkUnit));
var JpSerializer = (function () {
    function JpSerializer() {
    }
    JpSerializer.prototype.serialize = function (mValue, process) {
        if (util_1.Util.isScalar(mValue)) {
            return process.makeResult(mValue, mValue);
        }
        else if (util_1.Util.isObject(mValue)) {
            return this.serializeTraversable(mValue, process);
        }
        throw new Error("Don't know how to serialize");
    };
    JpSerializer.prototype.serializeTraversable = function (obj, process) {
        var seenPos = process.getSeenPos(obj);
        if (seenPos > -1) {
            var key = util_1.Util.buildReference(seenPos);
            return process.makeResult(key, key);
        }
        seenPos = process.putSeen(obj);
        var workUnit = new SerializeTraversable(this, process);
        var items = workUnit.serialize(obj);
        process.putObjectRepresentation(seenPos, items);
        return process.makeResult(obj, items);
    };
    return JpSerializer;
}());
exports.JpSerializer = JpSerializer;
//# sourceMappingURL=jp-serializer.js.map
var jp_unserializer_1 = require("./util/jp-unserializer");
var jp_unserializer_2 = require("./util/jp-unserializer");
var jp_serializer_1 = require("./util/jp-serializer");
var JpFreeze = (function () {
    function JpFreeze() {
    }
    JpFreeze.prototype.serialize = function (mValue) {
        var process = new jp_serializer_1.JpSerializationProcess();
        return new jp_serializer_1.JpSerializer().serialize(mValue, process);
    };
    JpFreeze.prototype.unserialize = function (mValue) {
        var process = new jp_unserializer_2.JpUnserializeProcess(mValue);
        return new jp_unserializer_1.default().unserialize(mValue.root, process);
    };
    return JpFreeze;
}());
module.exports = JpFreeze;
//# sourceMappingURL=jp-freeze.js.map
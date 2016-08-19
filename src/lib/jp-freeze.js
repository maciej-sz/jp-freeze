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
//# sourceMappingURL=jp-freeze.js.map
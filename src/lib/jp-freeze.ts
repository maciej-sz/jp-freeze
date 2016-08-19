import JpUnserializer from "./util/jp-unserializer";
import {JpUnserializeProcess} from "./util/jp-unserializer";
import {
    JpSerializationResult,
    JpSerializationProcess, JpSerializer
} from "./util/jp-serializer";


class JpFreeze {
    
    public unserialize(mValue:any):any {
        var process = new JpUnserializeProcess(mValue);
        return new JpUnserializer().unserialize(mValue.root, process);
    }
}

export = JpFreeze;
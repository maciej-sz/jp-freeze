import JpUnserializer from "./util/jp-unserializer";
import {JpUnserializeProcess} from "./util/jp-unserializer";

class JpFreeze {
    
    public unserialize(mValue:any):any {
        var process = new JpUnserializeProcess(mValue);
        return new JpUnserializer().unserialize(mValue.root, process);
    }
}

export = JpFreeze;
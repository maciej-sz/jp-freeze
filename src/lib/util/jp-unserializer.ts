import {Util} from "./util";

export class UnserializationError extends Error {}

class SerializedObjectValidator {
    public validateThrow(mSerialized:any) {
        if ( !Util.isObject(mSerialized) ) {
            throw new UnserializationError("Serialized value must be an object");
        }
        if ( undefined === mSerialized.root ) {
            throw new UnserializationError("Serialized value must have a root");
        }
    }
}

export class JpUnserializeProcess {

    private _original:any;
    private unserializedReferences:{ [key: string] : {[key: string] : any} };

    constructor(original:any) {
        new SerializedObjectValidator().validateThrow(original);
        this._original = original;
        this.unserializedReferences = {};
    }

    get original():any {
        return this._original;
    }

    public putObject(pos:string, obj:Object) {
        this.unserializedReferences[pos] = obj;
    }
    
    public tryGetObject(idx):AnObject {
        if ( !this.unserializedReferences.hasOwnProperty(idx) ) {
            return null;
        }
        return this.unserializedReferences[idx];
    }
}

export default class JpUnserializer {

    public unserialize(mValue:any, process:JpUnserializeProcess):any {
        if ( null === mValue ) {
            return null;
        }
        else if ( null !== Util.tryExtractIdx(mValue) ) {
            return this.unserializeObject(mValue, process);
        }
        else if ( mValue instanceof Array ) {
            return this.unserializeArray(mValue, process);
        }
        return mValue;
        // throw new Error("Don't know how to unserialize");
    }

    protected unserializeObject(mValue:any, process:JpUnserializeProcess):AnObject {
        let idx = Util.tryExtractIdx(mValue);
        let instance = process.tryGetObject(idx);
        if ( null !== instance ) {
            return instance;
        }
        instance = {};
        process.putObject(idx, instance);
        let obj = process.original.objects[idx];
        for (let prop in obj) {
            if ( obj.hasOwnProperty(prop) ) {
                instance[prop] = this.unserialize(obj[prop], process);
            }
        }
        return instance;
    }

    protected unserializeArray(arr:Array<any>, process:JpUnserializeProcess):Array<any> {
        let res:Array<any> = [];
        for (let key in arr) {
            if ( arr.hasOwnProperty(key) ) {
                res[key] = this.unserialize(arr[key], process);
            }
        }
        return res;
    }
}



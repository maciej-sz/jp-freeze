import {Util} from "./util";

export class JpSerializationProcess {
    private seen:Array<any>;
    private serializedObjects:Array<any>;
    // private pathReferences:{ [key: string] : string };
    private meta:{ [key: string] : any } = null;

    constructor(meta:{} = null) {
        if ( null === meta ) {
            meta = {
                "classes": [],
                "versions": []
            };
        }
        this.meta = meta;
        this.seen = [];
    }

    public hasSeen(obj:any):boolean {
        if ( ! Util.isObject(obj) ) {
            return false;
        }
        return this.seen.indexOf(obj) > -1;
    }

    public putSeen(obj:any):number {
        let pos = this.seen.length;
        // let idx:string = "0x" + pos;
        this.seen[pos] = obj;
        return pos;
    }

    public getSeenPos(obj:any):number {
        if ( ! Util.isObject(obj) ) {
            return -1;
        }
        return this.seen.indexOf(obj);
    }

    public putObjectRepresentation(pos:number, serialized:any)
    {
        this.serializedObjects[pos] = serialized;
    }

    public makeResult(original:any, serialized:any):JpSerializationResult {
        let seenPos:number = this.getSeenPos(original);
        if ( seenPos > -1 ) {
            serialized = Util.buildReference(seenPos);
        }
        return new JpSerializationResult(
            serialized,
            this.serializedObjects,
            this.meta
        );
    }
}

export class JpSerializationResult {
    private _root:any;
    private objects:Array<any>;
    private meta:{ [key: string] : any };


    constructor(root:any, objects:Array<any>, meta:{}) {
        this._root = root;
        this.objects = objects;
        this.meta = meta;
    }

    get rawRoot():any {
        return this._root;
    }
    
    get root():any {
        let seenPos:number = Util.tryExtractSeenPos(this._root);
        if ( null !== seenPos ) {
            return this.objects[seenPos];
        }
        return this._root;
    }

    get serialized():{} {
        let objects = {};
        for (let i in this.objects) {
            if ( !this.objects.hasOwnProperty(i) ) {
                continue;
            }

            let idx = Util.buildIdx(parseInt(i));
            objects[idx] = this.objects[i];
        }
        return {
            "root": this._root,
            "objects": objects,
            "meta": this.meta
        };
    }
}

abstract class ASerializeWorkUnit {
    protected serializer:JpSerializer;
    protected process:JpSerializationProcess;

    constructor(serializer:JpSerializer, process:JpSerializationProcess) {
        this.serializer = serializer;
        this.process = process;
    }
}

class SerializeTraversable extends ASerializeWorkUnit {
    public serialize(obj:any):any {
        let items = {};
        if ( Util.isArray(obj) ) {
            items = [];
        }
        for ( let i in obj ) {
            if ( !obj.hasOwnProperty(i) ) {
                continue;
            }
            let mVal = obj[i];
            let seenPos = this.process.getSeenPos(mVal);
            if ( seenPos > -1 ) {
                items[i] = Util.buildReference(seenPos);
            }
            else {
                let subRes = this.serializer.serialize(mVal, this.process);
                items[i] = subRes.rawRoot;
            }
        }
        return items;
    }
}

export class JpSerializer {

    public serialize(mValue:any, process:JpSerializationProcess):JpSerializationResult {
        if ( Util.isScalar(mValue)  ) {
            return process.makeResult(mValue, mValue);
        }
        else if (  Util.isObject(mValue) ) {
            return this.serializeTraversable(mValue, process);
        }
        throw new Error("Don't know how to serialize");
    }

    protected serializeTraversable(obj:any, process:JpSerializationProcess) {
        let seenPos:number = process.getSeenPos(obj);
        if ( seenPos > -1 ) {
            let key:string = Util.buildReference(seenPos);
            return process.makeResult(key, key);
        }
        seenPos = process.putSeen(obj);

        let workUnit = new SerializeTraversable(this, process);
        let items = workUnit.serialize(obj);
        process.putObjectRepresentation(seenPos, items);
        return process.makeResult(obj, items);
    }
}
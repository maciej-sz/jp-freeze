const REFERENCE_PREFIX = "##ref##";
const IDX_PREFIX = "0x";

export class Util {

    public static tryExtractIdx(mValue:any):string {
        if ( !Util.isString(mValue) ) {
            return null;
        }
        let str = <string>mValue;
        if ( REFERENCE_PREFIX !== str.substr(0, REFERENCE_PREFIX.length) ) {
            return null;
        }
        return str.substr(REFERENCE_PREFIX.length);
    }

    public static tryExtractSeenPos(mValue:any):number {

        let idx:string = Util.tryExtractIdx(mValue);
        if ( null === idx ) {
            return null;
        }
        if ( !Util.isString(mValue) ) {
            return null;
        }
        let val = <string>mValue;
        if ( IDX_PREFIX !== val.substr(0, IDX_PREFIX.length) ) {
            return null;
        }
        let pos = val.substr(IDX_PREFIX.length);
        return parseInt(pos);
    }

    public static buildIdx(pos:number):string {
        return IDX_PREFIX + pos;
    }

    public static buildReference(pos:number):string {
        return REFERENCE_PREFIX + Util.buildIdx(pos);
    }

    public static isScalar(mValue:any):boolean {
        if ( null === mValue ) {
            return true;
        }
        else if ( "number" === typeof mValue ) {
            return true;
        }
        else if ( "string" === typeof mValue ) {
            return true;
        }
        else if ( "boolean" === typeof mValue ) {
            return true;
        }
        return false;
    }

    public static isString(mValue:any):boolean {
        return "string" === typeof mValue;
    }

    public static isObject(mValue:any):boolean {
        return "object" === typeof mValue;
    }
    
    public static isArray(mValue:any):boolean {
        return mValue instanceof Array;
    }
}

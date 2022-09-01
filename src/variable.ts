
export class Variable<V> {

    protected _value: V;

    public get value(): V {
        return this._value;
    }
    public set value(value: V) {
        this._value = value;
    }
    
    constructor(value?: V) {
        if (value) this._value = value;
    }
}
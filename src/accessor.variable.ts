import { Variable } from "./variable";

export class AccessorVariable<V> extends Variable<V>{

    public get value(): V {
        let val: V = this.getter();
        super.value = val;
        return val;
    }
    public set value(value: V) {
        if (this.setter) {
            this.setter(value);
            super._value = value;
        };
    }
    
    constructor(public readonly getter: () => V, 
        public readonly setter?: (value: V) => void) {
        super();
        this.getter = getter;
        this.setter = setter;
    }
}
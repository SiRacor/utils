import { NullSafe, Stream } from './utils';
const { wth, nsc, nsce, nvl } = NullSafe;
const { forEach } = Stream;

export class Variable<V> {

    protected _value: V | null;

    public get value(): V | null {
        return this._value;
    }
    public set value(value: V | null) {
        this._value = value;
    }

    constructor(value?: V) {
        if (value) this._value = value;
        else this._value = null;
    }

    public isSet(): boolean {
      	return nsc(this._value)
    }
}

export namespace Variable {
  export class Bool extends Variable<boolean> {
    public is() : boolean {
      return wth(this.value, false, (v) => v);
    }
    public isNot() : boolean {
      return !this.is();
    }
  };
  export class Num extends Variable<number> {
    public inc(): void {
      this.add(1);
    }
    public add(inc?: number): void {
      this.value = nvl(this.value, 0) + nvl(inc, 0);
    }
  };
  export class Str extends Variable<string> {

    public concat(...strings: string[]): void {

      let val: string = nvl(this._value, "");
      forEach(strings, (s) => val = val.concat(s));

      this.value = val;
    }

    public override isSet(): boolean {
      	return nsce(this._value)
    }
  };
}

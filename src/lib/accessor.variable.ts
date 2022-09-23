import { Variable } from './variable';

/**
 * Holds a reference to a getter and optionally a setter to be invoked
 * when accessing the property @see value
 */
export class AccessorVariable<V> extends Variable<V>{

  public override get value(): V | null {
    const val: V | null = this.getter();
    super.value = val;
    return val;
  }

  public override set value(value: V | null) {
    if (this.setter) {
      this.setter(value);
      super._value = value;
    }
  }

  /**
     *
     * @param getter
     * @param setter
     * @returns
     */
  constructor(public readonly getter: () => V | null,
        public readonly setter?: (value: V | null) => void) {
    super();
    this.getter = getter;
    this.setter = setter;
  }
}

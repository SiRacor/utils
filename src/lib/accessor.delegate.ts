import { AccessorVariable } from './accessor.variable';

export class AccessorDelegate<T, V, L> {

  public constructor(
            public readonly get: (instance: T) => V | null,
            public readonly set?: (instance: T, value: V | null) => void,
            public readonly label?: (instance: T) => L) {
    this.get = get;
    this.set = set;
    this.label = label;
  }

  public var(instance : T) : AccessorVariable<V> {
    return new AccessorVariable(
      () => this.get(instance),
      (value: V | null) => { if (this.set) this.set(instance, value); }
    );
  }
}

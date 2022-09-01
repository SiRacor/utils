import { AccessorVariable } from './accessor.variable';

export class AccessorDelegate<T, V, L> {

    public constructor(
            public readonly get: (instance: T) => V, 
            public readonly set?: (instance: T, value: V) => void, 
            public readonly label?: (instance: T) => L) {
        this.get = get;
        this.set = set;
        this.label = label;
    }

    public var(instance : T) : AccessorVariable<V> {
        return new AccessorVariable(
            () => this.get(instance),
            (value: V) => this.set(instance, value)
        );
    }
} 
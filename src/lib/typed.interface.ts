/* eslint-disable @typescript-eslint/no-namespace */
import { NullSafe, Stream, Equality } from './utils';

const { nsc, wth, nvl } = NullSafe;
const { tryGet, findFirst, forEach } = Stream;
const { eq } = Equality;


export interface TypedInterface  {
  clasz: Interface<TypedInterface>;
}

export namespace TypedInterface {

  export function isA(obj: unknown, type: GlobalType<unknown>): boolean {

    if (obj === null || typeof obj !== 'object') {
      return false;
    }

    const recObj: Record<string, unknown> = obj as Record<string, unknown>;

    if (typeof (recObj['clasz']) !== 'object' || !((recObj['clasz']) instanceof GlobalType<unknown>)) {
      return false;
    }

    let clasz: GlobalType<unknown> | undefined = (<GlobalType<unknown>> recObj['clasz']);

    while (nsc(clasz)) {
      if (eq(clasz?.uid, type.uid)) {
        return true;
      }
      clasz = clasz?.superType;
    }
    return false;
  }

  export const map: Map<GlobalType<unknown>, () => unknown> = new Map();

  export function TypedConstructor<T>(clasz: GlobalType<T>, creator?: () => T) {
    return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
      const orig = descriptor.value;

      descriptor.value = (...vals: unknown[]) => {
        const ret: Record<string, unknown> = orig.apply({}, vals);
        ret['clasz'] = clasz;
        if (!map.has(clasz)) map.set(clasz, () => ret);
        return ret;
      };

      if (creator && !map.has(clasz)) map.set(clasz, creator);
    };
  }

  export function TypedConstructor2<T>(clasz: GlobalType<T>, creator?: () => T) {
    return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
      const orig = descriptor.value;

      descriptor.value = (...vals: unknown[]) => {
        const ret: Record<string, unknown> = orig.apply({}, vals);
        ret['clasz'] = clasz;
        if (!map.has(clasz)) map.set(clasz, () => ret);
        return ret;
      };

      if (creator && !map.has(clasz)) map.set(clasz, creator);
    };
  }
}

class GlobalType<T> {

  constructor(public readonly uid: unknown, public readonly type: Class.Type, public superType?: GlobalType<unknown>) {
    this.uid = uid;
    this.type = type;
    this.superType = superType;
  }

  public cast(obj: unknown) : T | null {
    return TypedInterface.isA(obj, this) ? <T> obj : null;
  }

  public isA(obj: unknown): boolean {
    return TypedInterface.isA(obj, this);
  }

  public wth(t: T | null, func : (t : T) => void): boolean;
  public wth<R>(t: T | null, alt: R | null, func: (t: T) => R): R | null;
  public wth<T, R>(t: T | null, a: ((t : T) => void) | R | null, b?: (t: T ) => R | null): boolean | R | null {
    return nsc(b) ? wth(t, <R> a, <(t: T ) => R | null> b): wth(t, <(t : T) => void>a);
  }

  public getName(): string {
    return nvl(tryGet((this.uid + '').split('@'), 0), 'TypedInterface');
  }

  public toJSON() {
    return this.uid;
  }

  public parseJSON(input: string): T | null {
    return this.cast(GlobalType.parseJSON(input));
  }

  public static fromJSON(input: string): GlobalType<unknown> | null {
    input = wth(input, '', (inp) => JSON.parse(inp));
    return findFirst(TypedInterface.map.keys(), (k) => eq(k.uid, input));
  }

  public static parseJSON(input: string): unknown | null {
    return JSON.parse(input, (key: string, value: unknown) => GlobalType.reviver(key, value));
  }

  public static toJSON(input: unknown): string {
    return JSON.stringify(input, (key: string, value: unknown) => GlobalType.replacer(key, value));
  }

  private static inArray = false;

  private static replacer<T>(key: string, value: T): T | {dataType: string, value: (Array<unknown> | string)} {

    let ret: T | {dataType: string, value: (Array<unknown> | string)} = value;

    if (value instanceof Map) {
      GlobalType.inArray = true;
      ret = {
        dataType: 'Map',
        value: Array.from([...value.entries()])
      };
    } else if (value instanceof Set) {
      GlobalType.inArray = true;
      ret = {
        dataType: 'Set',
        value: Array.from(Array.from([...value]))
      };
    } else if (value instanceof Array) {
      if (!GlobalType.inArray) {
        GlobalType.inArray = true;
        ret = {
          dataType: 'Array',
          value: Array.from([...value])
        };
      } else {
        GlobalType.inArray = false;
      }
    }
    return ret;
  }

  private static reviver<T>(key: string, value: T): T | Map<unknown, unknown> | Set<unknown> | Array<unknown> | GlobalType<unknown> {

    if (typeof value == 'string' && key == 'clasz') {

      return nvl(GlobalType.fromJSON(JSON.stringify(value)), value);

    } else if (typeof value == 'object') {

      const record = value as Record<string, unknown>;

      if (record['value'] && record['dataType']) {
        const dataType = record['dataType'];

        switch (dataType) {

        case 'Map': {
          return new Map(<Iterable<[unknown, unknown]>>record['value']);

        } case 'Set': {
          return new Set(Array.from(<Iterable<unknown>>record['value']));

        } case 'Array': {
          return Array.from(<Iterable<unknown>>record['value']);
        }
        }
      }
    }
    return value;
  }
}

export class Interface<T> extends GlobalType<T> {
  constructor(uid: unknown, superInterface?: Interface<unknown>) {
    super(uid, Class.Type.INTERFACE, superInterface);
  }
}

export class Class<T> extends GlobalType<T> {
  constructor(uid: unknown, superClass?: Class<unknown>) {
    super(uid, Class.Type.CLASS, superClass);
  }
}

export namespace Class {
  export enum Type {
    CLASS = 'Class',
    INTERFACE = 'Interface'
  }
}

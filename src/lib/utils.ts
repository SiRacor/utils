/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/**
 *
*/
export class Equality {

  public static eqs(a : String | string | null, b : String | string | null, ignorecase : boolean) : boolean {
    const s1 = nsc(a) ? (ignorecase ? a?.toLowerCase().trim() : a?.trim()) : a;
    const s2 = nsc(b) ? (ignorecase ? b?.toLowerCase().trim() : b?.trim()) : b;

    return eq(s1, s2);
  }

  /**
   * desf
   * @param a
   * @param b
   * @param c
   * @returns
   */
  public static eq<T>(a : T, b : T, ...c : T[]) : boolean {

    let ret = true;

    if (!nsc(a)) {
      ret = !nsc(b);
    } else if (!nsc(b)) {
      ret = false;
    } else {

      ret = a === b
        || a == b
        || (Object.getPrototypeOf(a) === Object.getPrototypeOf(b)
            && JSON.stringify(a) == JSON.stringify(b));
    }

    if (ret) {
      ret = NullSafe.iteratePredicate(c, (v : T) => eq(b, v));
    }

    return ret;
  }

  public static neq<T>(a : T, b : T, ...c : T[]) : boolean {
    return !eq(a, b, ...c);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Class<T> {
  new: (...args: unknown[]) => T;
}

const { eq } = Equality;

export class NullSafe {

  public static nsc<T, U>(a : T, ...b : U[]) : boolean {
    return a != undefined && a !== undefined
      && NullSafe.iteratePredicate(b, (v : U) => nsc(v));
  }

  public static nsce<T, U>(a : T, ...b : U[]) : boolean {
    return nsc(a) && !emp(a)
      && NullSafe.iteratePredicate(b, (v : U) => nsce(v));
  }

  public static emp<T, U>(a : T | any, ...b : U[]) : boolean {

    let ret = !nsc(a, b);

    if (!ret) {
      if (typeof a === 'string' || a instanceof String) {
        ret = a.trim().length === 0;
      } else if (typeof a === 'boolean') {
        ret = !(new Boolean(a)).valueOf();
      } else if (a instanceof Boolean) {
        ret = !a.valueOf();
      } else if (a instanceof Date) {
        ret = isNaN(new Number(a).valueOf());
      } else if (Array.isArray(a)) {
        ret = a.length === 0;
      } else if (a.size) {
        ret = NullSafe.rsl(a.size) <= 0;
      } else if (a.length) {
        ret = NullSafe.rsl(a.length) <= 0 ;
      } else if (typeof a === 'object' && Object.keys(<Object>a).length === 0) {
        ret = true;
      } else if (typeof a === 'function') {
        ret = false;
      }
    }

    if (!ret && b != undefined) {
      ret = NullSafe.iteratePredicate(b, (v : U) => emp(v) != true) != true;
    }

    return ret;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static nvl<T>(a? : T | null, ...b : T[] | any) : T {
    if (nsc(a) && a != undefined) return a;
    return NullSafe.iterateFunction(b, (v) => nvl(v));
  }

  public static nvle<T>(a? : T, ...b : T[]) : T {
    if (nsce(a) && a != undefined) return a;
    return NullSafe.iterateFunction(b, (v) => nvle(v));
  }

  public static nvls<T>(a : (() => T) | T | null, ...b : (T | any)[] | (() => T)[]) : T {

    a = NullSafe.rsl(a);
    if (nsc(a)) return nvl(a);

    return NullSafe.iterateFunction(b, (v) => nvls(v));
  }

  public static rsl<T>(a : (() => T)) : T;
  public static rsl<T>(a : (() => T) | T) : T
  public static rsl<T>(a : (() => T) | T | any) : T {
    return typeof a == 'function' ? a() : a;
  }

  public static wth<T>(t : T | null, func : (t : T) => any) : boolean;
  public static wth<T, R>(t : T | null | undefined, alt : R, func : (t : T) => any) : R;
  public static wth<T, R>(t : T | null | undefined, a : (t : T) => R | R, b? : (t : T ) => R) : boolean | R {

    const alt : R | any = nsc(b) ? a : null;
    const func : ((t : T) => R) | any = nsc(b) ? b : a;

    let ret : boolean | R = false;

    if (alt != undefined) {
      ret = (t != null) ? func(t) : alt;
    } else if (t != null) {
      func(t);
      ret = true;
    }

    return ret;
  }


  public static iteratePredicate(array : any[], func : (a : any) => boolean) : boolean {

    let ret = true;

    for(let i = 0; array != undefined && ret && i < array.length; i++) {

      if (!func(array[i])) {
        ret = false;
        break;
      }
    }

    return ret;
  }

  public static iterateFunction<T>(array : any[], func : (a : any) => T) : T | any {

    for(let i = 0; nsc(array) && i < array.length; i++) {

      const ret = func(array[i]);
      if (nsc(ret)) {
        return ret;
      }
    }

    return null;
  }

}

/**
 * xcs
 */
const { nsc, nsce, emp, nvl, nvle, nvls } = NullSafe;

export class Stream {

  public static filter<T>(list: T[], filter : (arg: T) => boolean): T[];
  public static filter<T>(list: Iterable<T>, filter : (arg: T) => boolean): Set<T>;
  public static filter<T>(list: T[] | Iterable<T>, filter : (arg: T) => boolean): T[] | Set<T> | null {

    if (!nsc(list)) {
      return null;
    }

    const ret : T[]  = [];
    const buffer : T[] = (Array.isArray(list)) ? list : Array.from(list);

    buffer?.forEach((item) => {
      if (nsc(item) && (!filter || filter(item))) {
        ret.push(item);
      }
    });

    return Array.isArray(list) ? ret : new Set(ret);
  }

  public static anyMatch<T>(list: T[], filter : (arg: T) => boolean): boolean;
  public static anyMatch<T>(list: Iterable<T>, filter : (arg: T) => boolean): boolean;
  public static anyMatch<T>(list: T[] | Iterable<T>, filter : (arg: T) => boolean): boolean {
    return Stream.count(list, filter) > 0;
  }

  public static findFirst<T>(list: T[], filter : (arg: T) => boolean): T | null;
  public static findFirst<T>(list: Iterable<T>, filter : (arg: T) => boolean): T | null;
  public static findFirst<T>(list: T[] | Iterable<T>, filter : (arg: T) => boolean): T | null {
    return Stream.tryGet(Stream.filter(list, filter), 0);
  }

  public static tryGet<T>(list: T[] | Iterable<T>) : T | null;
  public static tryGet<T>(list: T[] | Iterable<T>, index?: number) : T | null;
  public static tryGet<T>(list: T[] | Iterable<T>, index?: number) : T | null {

    if (!nsce(list) || (index && index < 0)) {
      return null;
    }

    index = index && index >= 0 ? index : 0;
    const arr = Array.isArray(list) ? list : Array.from(list);

    return arr.length > index ? arr[index] : null;
  }

  public static count<T>(list: T[] | Iterable<T>) : number;
  public static count<T>(list: T[] | Iterable<T>, filter : (arg: T) => boolean) : number;
  public static count<T>(list: T[] | Iterable<T>, filter? : (arg: T) => boolean): number {

    if (filter != undefined) {
      list = Stream.filter(list, filter);
    }

    return Array.isArray(list) ? list.length : isIterable(list) ? new Set(list).size : 0;
  }

  public static forEach<T>(list: T[] | Iterable<T>, consumer : (arg: T) => void) : void;
  public static forEach<T>(list: T[] | Iterable<T>, preFilter : (arg: T) => boolean, consumer : (arg: T) => void) : void;
  public static forEach<T>(list: T[] | Iterable<T>, a : ((arg: T) => boolean) | ((arg: T) => void), b? : (arg: T) => void) : void {

    const preFilter : ((arg: T) => boolean) | any = nsc(b) ? a : null;
    const consumer : ((arg: T) => void) | any = nsc(b) ? b : a;

    if (!nsc(list, consumer)) {
      return;
    }

    const buffer : T[] = (Array.isArray(list)) ? list : Array.from(list);

    buffer.forEach((item) => {
      if (nsc(item) && (!preFilter || preFilter(item))) {
        consumer(item);
      }
    });
  }

  public static toSet<T, R>(list: T[] | Iterable<T>, func : (arg: T) => R) : Set<R>;
  public static toSet<T, R>(list: T[] | Iterable<T>, preFilter : (arg: T) => boolean, func : (arg: T) => R) : Set<R>;
  public static toSet<T, R>(list: T[] | Iterable<T>, a : ((arg: T) => boolean) | ((arg: T) => R), b? : (arg: T) => R) : Set<R> | null {

    const preFilter : ((arg: T) => boolean) | any = nsc(b) ? a : null;
    const func : ((arg: T) => R) | any = nsc(b) ? b : a;

    const buffer : R[] | null = Stream.toArray(list, preFilter, func);
    return buffer ? new Set(buffer) : null;
  }

  public static toArray<T, R>(list: T[] | Iterable<T>, func : (arg: T) => R) : R[] | null;
  public static toArray<T, R>(list: T[] | Iterable<T>, preFilter : (arg: T) => boolean, func : (arg: T) => R) : R[] | null;
  public static toArray<T, R>(list: T[] | Iterable<T>, a : ((arg: T) => boolean) | ((arg: T) => R), b? : (arg: T) => R) : R[] | null {

    const preFilter : ((arg: T) => boolean) | unknown = nsc(b) ? a : null;
    const func : ((arg: T) => R) | unknown = nsc(b) ? b : a;

    if (!nsc(list, func)) {
      return null;
    }

    const ret : R[] = [];
    const buffer : T[] = (Array.isArray(list)) ? list : Array.from(list);

    buffer.forEach((item) => {
      if (nsc(item) && (!preFilter || (<Function>preFilter)(item))) {

        const r : R = (<Function>func)(item);

        if (nsc(r)) {
          ret.push(r);
        }
      }
    });

    return ret;
  }

  public static toMap<T, K, V>(list: T[] | Iterable<T>, func : (arg: T) => Entry<K, V>): Map<K, V>;
  public static toMap<T, K, V>(list: T[] | Iterable<T>, preFilter : (arg: T) => boolean, func : (arg: T) => Entry<K, V>): Map<K, V>;
  public static toMap<T, K, V>(list: T[] | Iterable<T>, preFilter : ((arg: T) => boolean) | null, func : (arg: T) => Entry<K, V>, conflict : (stored: Entry<K, V>, candidate: Entry<K, V>) => Entry<K, V>): Map<K, V>;
  public static toMap<T, K, V>(list: T[] | Iterable<T>, a : ((arg: T) => Entry<K, V>) | ((arg: T) => boolean) | null, b? : (arg: T) => Entry<K, V>, c? : (stored: Entry<K, V>, candidate: Entry<K, V>) => Entry<K, V>): Map<K, V> | null {

    const preFilter : ((arg: T) => boolean) | unknown = nsc(b) ? a : null;
    const func : ((arg: T) => Entry<K, V>) = nvl(b, a);
    const altConflict = (stored: Entry<K, V>, candidate: Entry<K, V>) => nvl(candidate, stored);
    const conflict: (stored: Entry<K, V>, candidate: Entry<K, V>) => Entry<K, V> = nvl(c, altConflict);

    if (!nsc(list, func)) {
      return null;
    }

    const buffer : T[] = (Array.isArray(list)) ? list : Array.from(list);
    const ret : Map<K, V> = new Map();

    buffer.forEach((item) => {
      if (nsc(item) && (!preFilter || (<Function>preFilter)(item))) {

        let r : Entry<K, V> = func(item);

        if (nsc(r) && ret.has(r.key) && ret.get(r.key) !== r.value && ret.get(r.key)) {
          const v = <V> ret.get(r.key);
          r = conflict(r, toEntry(r.key, v));
        }

        if (nsc(r)) ret.set(r.key, r.value);
      }
    });

    return ret;
  }

  public static toEntry<K, V>(key : K, value : V) : Entry<K, V> {
    const entry : { key : K, value : V } = { key : key, value : value};
    return entry;
  }

  public static isIterable(obj : unknown) {
    return nsc(obj) && typeof (<Iterable<never>>obj)[Symbol.iterator] === 'function';
  }
}

interface Entry<K, V> {
  key: K;
  value: V;
}


/**
 * xcs
 */
const { isIterable, toEntry} = Stream;

/* eslint-disable @typescript-eslint/ban-types */
import { NullSafe } from './utils';
const { nsc, nvl } = NullSafe;

export class Assert {

  public static getMatcher<T>(actual: T, msg? : String | string): jasmine.Matchers<T> {
    const msi : string | undefined = msg instanceof String ? msg.valueOf() : msg;
    return (nsc(msi)) ? expect(actual).withContext(nvl(msi, '')) : expect(actual);
  }

  public static getBool(test : boolean | Boolean | (() => boolean | Boolean) | null): boolean {
    return test instanceof Boolean
      ? test.valueOf()
      : typeof test == 'function'
        ? getBool(test())
        : test != undefined && test;
  }


  public static assertTrue(test : boolean | Boolean | (() => boolean | Boolean) | null) : void;
  public static assertTrue(test : boolean | Boolean | (() => boolean | Boolean) | null, msg? : String | string) : void;
  public static assertTrue(test : boolean | Boolean | (() => boolean | Boolean) | null, msg? : String | string) : void {
    Assert.getMatcher(Assert.getBool(test), msg).toBeTrue();
  }

  public static assertFalse(test : boolean | Boolean | (() => boolean | Boolean) | null) : void;
  public static assertFalse(test : boolean | Boolean | (() => boolean | Boolean) | null, msg? : String | string) : void;
  public static assertFalse(test : boolean | Boolean | (() => boolean | Boolean) | null, msg? : String | string) : void {
    Assert.getMatcher(Assert.getBool(test), msg).toBeFalse();
  }

  public static assertEq<T>(a : T, b : T) : void;
  public static assertEq<T>(a : T, b : T, msg? : String | string) : void;
  public static assertEq<T>(a : T, b : T, msg? : String | string) : void {
    Assert.getMatcher(a, msg).toEqual(b);
  }

  public static assertNeq<T>(a : T, b : T) : void;
  public static assertNeq<T>(a : T, b : T, msg? : String | string) : void;
  public static assertNeq<T>(a : T, b : T, msg? : String | string) : void {
    Assert.getMatcher(a, msg).not.toEqual(b);
  }

  public static assertCount<T>(list: T[] | Iterable<T>, count: number) : void;
  public static assertCount<T>(list: T[] | Iterable<T>, count: number, msg? : String | string) : void;
  public static assertCount<T>(list: T[] | Iterable<T>, count: number, msg? : String | string) : void {

    const comp: number = Array.isArray(list) ? list.length
      : nsc(list) && typeof list[Symbol.iterator] === 'function'? new Set(list).size : 0;

    Assert.getMatcher(comp, msg).toEqual(count);
  }

  public static assertEmpty<T>(list: T[] | Iterable<T>) : void;
  public static assertEmpty<T>(list: T[] | Iterable<T>, msg? : String | string) : void;
  public static assertEmpty<T>(list: T[] | Iterable<T>, msg? : String | string) : void {

    Assert.assertCount(list, 0, msg);
  }

}

const { getBool } = Assert;

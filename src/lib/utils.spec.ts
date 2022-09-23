/* eslint-disable @typescript-eslint/no-explicit-any */
import { Variable } from './variable';
import { Equality, NullSafe, Stream } from './utils';
import { Assert } from './assert';
const { eqs, eq, neq } = Equality;
const { nsc, nsce, emp, nvl, nvle, nvls, rsl, wth, iterateFunction, iteratePredicate } = NullSafe;
const { getMatcher, getBool, assertTrue, assertFalse, assertEq, assertNeq } = Assert;
const { count, filter, anyMatch, findFirst, tryGet, forEach, toSet, toArray, toMap, toEntry, isIterable} = Stream;


describe('Equality', () => {

  it('eqs', () => {

    let b1: string | null = null;
    const b2 = 'b';

    assertFalse(eqs(b1, b2, false));
    assertTrue(eqs(b1, new Variable.Str().value, true));

    b1 = 'a';
    const b3 = 'A';

    assertFalse(eqs(b1, b2, false));
    assertFalse(eqs(b1, b3, false));
    assertTrue(eqs(b1, b3, true));
  });

  it('eq with Boolean', () => {

    const b1 = true;
    const b2 = null;
    const b3 = false;

    assertFalse(eq(b1, b2, b3));
    assertFalse(eq(b1, !b3, b2));
    assertTrue(eq(b1, !b3));

    const bo1 = new Boolean(true);
    const bo2 = new Boolean(false);

    assertFalse(eq(bo1, bo2));
    assertTrue(eq(bo1, new Boolean(!(bo2.valueOf()))));
  });

  it('eq with null, undefined', () => {

    const b1 = undefined;
    const b2 = null;

    assertTrue(eq(b1, b2));
  });

  it('neq', () => {

    const b1 = undefined;
    const b2 = null;
    const b3 = null;

    assertFalse(neq(b1, b2, b3));
    assertTrue(neq(b1, b2, false));
  });

  it('arrays', () => {

    const a = new Array([1, 1]);
    const b = new Array([1, 1]);

    const oa : unknown = a;
    const oc : unknown = 1;

    assertTrue(eq(a, b));
    assertFalse(eq(oc, oa));
  });
});

describe('NullSafe', () => {

  it('nsc with boolean', () => {

    const a = new Boolean(true);
    const b = false;

    assertTrue(nsc(a, b));
    assertFalse(nsc(a, b, null));
  });

  it('nsc with arrays', () => {

    const a = new Array([1, 1]);
    const b = new Array([1, 1]);

    const oa : unknown = a;
    const oc : unknown = 1;

    assertTrue(nsc(a, b));
    assertTrue(nsc(oc, oa));
  });

  it('nsce with boolean', () => {

    const a = new Boolean(true);
    const b = false;

    assertTrue(nsce(a));
    assertFalse(nsce(a, b));
    assertFalse(nsce(a, b, null));
  });

  it('nsce with string', () => {

    let a = new String('');
    const b = 'd';

    assertFalse(nsce(a, b));
    assertFalse(nsce(a, b, null));

    a = a.concat('f');

    assertTrue(nsce(a, b));
  });

  it('nsce with array', () => {

    const a = new Array(0);
    // eslint-disable-next-line @typescript-eslint/ban-types
    const b : String[] = [];

    assertFalse(nsce(a));
    assertFalse(nsce(a, b));

    a.push(1);
    b.push('1');

    assertTrue(nsce(a));
    assertTrue(nsce(b));
  });

  it('nvl with String', () => {

    let a = null;
    const b = 'f';

    assertTrue(nvl(a, b) == b);
    assertTrue(nvl(b, a) == b);

    a = 'd';

    assertTrue(nvl(a, b) == a);
  });

  it('nvle with String', () => {

    let a = '';
    const b = 'f';

    assertEq(nvle(a, b), b);
    assertEq(nvle(b, a), b);

    a = 'd';

    assertEq(nvl(a, b),a);
  });

  it('nvls with String', () => {

    let a = null;
    const b = () => 'f';

    assertEq(nvls(a, b), b());

    a = 'f';

    assertEq(nvls(a, b), b());

    a = '1';

    assertEq(nvls(a, null), '1');
  });

  it('nvls with call-check', () => {

    let i  = 0;
    const a = () : string => {
      i++;
      return 'f';
    };

    const b = () : string => {
      i++;
      return 'g';
    };

    assertEq(nvls(a, b), 'f');
    assertEq(i, 1);
  });

  it('emp with string', () => {

    const a : string | null = null;
    let b = new String('');
    let c  = '';

    assertTrue(emp(a));
    assertTrue(emp(b));
    assertTrue(emp(c));

    b = 'f';
    c = 'f';

    assertFalse(emp(b));
    assertFalse(emp(c));
  });

  it('emp with boolean', () => {

    const a : boolean | null = null;
    let b = new Boolean();
    let c = false;

    assertTrue(emp(a));
    assertTrue(emp(b));
    assertTrue(emp(c));

    b = true;
    c = true;

    assertFalse(emp(b));
    assertFalse(emp(c));
  });

  it('emp with map', () => {

    const a : Map<string, number> | null = null;
    const b = new Map<string, number>();

    assertTrue(emp(a));
    assertTrue(emp(b));

    b.set('ff', 2);
    assertFalse(emp(b));
  });

  it('emp with set', () => {

    const a : Set<string> | null = null;
    const b = new Set<string>();

    assertTrue(emp(a));
    assertTrue(emp(b));

    b.add('ff');
    assertFalse(emp(b));
  });

  it('emp with function', () => {

    const a : (() => number) | null = null;
    const b : () => number = () => 0;

    assertTrue(emp(a));
    assertFalse(emp(b));
  });

  it('emp with Array', () => {

    const a : [] | null = null;
    const b = new Array(1);

    assertTrue(emp(a));
    assertFalse(emp(b));
  });

  it('emp with length', () => {

    const a : ({ length: number }) | null = null;
    const b = { length: 2 };

    assertTrue(emp(a));
    assertFalse(emp(b));
  });

  it('emp with length()', () => {

    const a : ({ length: () => number }) | null = null;
    const b = { length: (() => 2) };

    assertTrue(emp(a));
    assertFalse(emp(b));
  });

  it('emp with size()', () => {

    const a : ({ length: number }) | null = null;
    const b = { length: 2 };

    assertTrue(emp(a));
    assertFalse(emp(b));
  });

  it('emp with multiple', () => {

    const a : ({ length: number }) | null = null;
    const b = { length: 2 };

    assertTrue(emp(a, a));
    assertTrue(emp(a, a, b));
    assertTrue(emp(b, a, b));
    assertTrue(emp(b, b, a));
    assertFalse(emp(b, b, b));
  });

  it('rsl', () => {

    const a : number | null = null;
    const b = 2;
    const c = () => 2;

    assertEq(rsl(a), null);
    assertEq(rsl(b), 2);
    assertEq(rsl(c), 2);
  });

  it('wth', () => {

    const a : number | null = null;
    const b = 2;
    const func = (x: number) => x;

    assertFalse(wth(a, func));
    assertTrue(wth(b, func));
    assertEq(wth(b, 0, func), 2);
  });

  it('iteratePredicate', () => {

    const func = (x: number) => x > 3;

    assertFalse(iteratePredicate([1, 2, 3], func));
    assertFalse(iteratePredicate([4, 5, 2, 1], func));
    assertTrue(iteratePredicate([4, 5], func));
    assertTrue(iteratePredicate([5], func));

  });

  it('iterateFunction', () => {

    const func = (x: number) => x;

    assertEq(iterateFunction([null, 2, 3], func), 2);
    assertEq(iterateFunction([null, null, 3], func), 3);
    assertEq(iterateFunction([null], func), null);

  });
});

describe('Assert', () => {

  it('getBool', () => {

    const a = true;
    const b = new Boolean(false);
    const c = () => true;
    const d = () => new Boolean(false);

    assertTrue(getBool(a));
    assertFalse(getBool(b));
    assertTrue(getBool(c));
    assertFalse(getBool(d));
  });

  it('getMatcher', () => {

    const a = true;
    assertTrue(eq(getMatcher(a), expect(a)));
  });
});

describe('Stream', () => {

  it('filter', () => {

    assertEq(filter(<any> null, <any> null), null);

    const n : string[] = filter(['a', 'b', 'c'], <any> null);
    assertEq(count(n), 3);

    const a : string[] = filter(['a', 'b', 'c'], (s) => s > 'a');
    assertEq(a.length, 2);

    const b : Set<string> = filter(new Set(['a', 'b', 'c']), (s) => s > 'a');
    assertEq(b.size, 2);
  });

  it('anyMatch', () => {

    assertFalse(anyMatch(<any> null, <any> null));
    assertTrue(anyMatch(['a', 'b', 'c'], <any> null));
    assertFalse(anyMatch(['a', 'b', 'c'], (s) => s === 'd'));
    assertTrue(anyMatch(['a', 'b', 'c'], (s) => s === 'a'));
    assertTrue(anyMatch(new Set(['a', 'b', 'c']), (s) => s === 'b'));
  });

  it('findFirst', () => {

    assertEq(findFirst(<any> null, <any> null), null);
    assertEq(findFirst(['a', 'b', 'c'], <any> null), 'a');
    assertEq(findFirst(['a', 'b', 'c'], (s) => s === 'd'), null);
    assertEq(findFirst(['a', 'b', 'c'], (s) => s === 'a'), 'a');
    assertEq(findFirst(new Set(['a', 'b', 'c']), (s) => s === 'b'), 'b');
  });

  it('tryGet', () => {

    assertEq(tryGet(<any> null), null);
    assertEq(tryGet(['a', 'b', 'c'], -1), null);
    assertEq(tryGet(['a', 'b', 'c']), 'a');
    assertEq(tryGet(['a', 'b', 'c'], 1), 'b');
    assertEq(tryGet(['a', 'b', 'c'], 3), null);
    assertEq(tryGet(new Set(['a', 'b', 'c']), 2), 'c');
  });

  it('assertCount', () => {
    assertEq(count(<any> null), 0);
    assertEq(count(['a', 'b', 'c']), 3);
    assertEq(count(new Array(0)), 0);
    assertEq(count(new Set(['a', 'b'])), 2);
    assertEq(count(new Set(['a', 'b']), (x) => x >= 'a'), 2);
    assertEq(count(toMap(['a', 'b', 'c'], (d) => toEntry(d, d.charCodeAt(0)))), 3);
  });

  it('forEach', () => {


    forEach(['a', 'b', 'c'], <any> null);

    let i  = 0;
    forEach(['a', 'b', 'c'], () => i++);

    assertEq(i, 3);

    i = 0;
    forEach(new Set(['a', 'b', 'c']), () => i++);

    assertEq(i, 3);

    i = 0;
    forEach(['a', 'b', 'c'], (s) => s > 'a', () => i++);

    assertEq(i, 2);
  });

  it('toArray', () => {

    const a : string[] = toArray(['a', 'b', 'c'], (s) => s > 'a', (s) => s);

    assertEq(a.length, 2);
  });

  it('toSet', () => {

    let a : Set<string> = toSet(['a', 'b', 'c'], (s) => s);
    const b : Set<string> = new Set(['a', 'b', 'c']);

    assertEq(a.size, b.size);

    a = toSet(['a', 'b', 'c'], (s) => neq(s, 'b'), (s) => s);
    assertNeq(a.size, b.size);

    a = toSet(['a', 'b', 'c'], <any> null);
    assertEq(a, null);
  });

  it('toArray', () => {

    let a : string[] = toArray(new Set(['a', 'b', 'c']), (s) => s);
    const b : string[] = ['a', 'b', 'c'];

    assertEq(a.length, b.length);

    a = toArray(['a', 'b', 'c'], (s) => neq(s, 'b'), (s) => s);
    assertNeq(a.length, b.length);

    a = toArray(['a', 'b', 'c'], <any> null);
    assertEq(a, null);
  });

  it('toMap', () => {

    let a : Map<number, string> = toMap(new Set(['a1', 'b22', 'c333', 'b1']),
      (s) => toEntry(s.length, s)
    );

    assertEq(a.size, 3);

    let b : Map<number, string> = toMap(['a1', 'b22', 'c333', 'b1'], null,
      (s) => toEntry(s.length, s),
      (stored, candidate) => toEntry(stored.key + 10, candidate.value)
    );

    assertEq(b.size, 4);

    b = toMap(['a1', 'b22', 'c333', 'b1'], (x) => x === 'a1',
      (s) => toEntry(s.length, s)
    );

    assertEq(b.size, 1);

    a = toMap(['a', 'b', 'c'], <any> null);
    assertEq(a, null);
  });

  it('isIterable', () => {

    assertTrue(isIterable(['a', 'b', 'c']));
    assertTrue(isIterable(new Set(['a', 'b', 'c'])));
    assertTrue(isIterable(new Map([['a', 'b']])));
    assertFalse(isIterable({ a: 1 }));

  });

  it('toEntry', () => {

    assertTrue(eq(toEntry('a', 'b'), { key: 'a', value: 'b'}));
    assertFalse(eq(toEntry('a', 'b'), { key: 'a', value: 'c'}));

  });
});

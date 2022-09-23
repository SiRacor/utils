import { Equality } from './utils';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Assert } from './assert';
import { Stream } from './utils';

const { getMatcher, getBool, assertEq, assertNeq, assertTrue, assertFalse, assertCount, assertEmpty } = Assert;
const { toMap, toEntry, count } = Stream;
const { eq } = Equality;

describe('Assert', () => {

  it('getMatcher', () => {
    getMatcher(<any> null).toBe(null);
    getMatcher(<any> null, 'ee').toBe(null);
    getMatcher(<any> null, new String('ee')).toBe(null);
  });

  it('getBool', () => {
    getMatcher(getBool(null)).toBe(false);
    getMatcher(getBool(false)).toBe(false);
    getMatcher(getBool(true)).toBe(true);
    getMatcher(getBool(() => true)).toBe(true);
    getMatcher(getBool(new Boolean())).toBe(false);
  });

  it('assertTrue', () => {

    assertTrue(eq(count(<any> null), 0));
    assertTrue(eq(count(['a', 'b', 'c']), 3));
    assertTrue(eq(count(new Array(0)), 0));
    assertTrue(eq(count(new Set(['a', 'b'])), 2));
    assertTrue(eq(count(toMap(['a', 'b', 'c'], (d) => toEntry(d, d.charCodeAt(0)))), 3));
  });

  it('assertFalse', () => {

    assertFalse(eq(count(<any> null), 1));
    assertFalse(eq(count(['a', 'b', 'c']), 4));
    assertFalse(eq(count(new Array(0)), 1));
    assertFalse(eq(count(new Set(['a', 'b'])), 3));
    assertFalse(eq(count(toMap(['a', 'b', 'c'], (d) => toEntry(d, d.charCodeAt(0)))), 4));
  });

  it('assertEq', () => {

    assertEq(count(<any> null), 0);
    assertEq(count(['a', 'b', 'c']), 3);
    assertEq(count(new Array(0)), 0);
    assertEq(count(new Set(['a', 'b'])), 2);
    assertEq(count(toMap(['a', 'b', 'c'], (d) => toEntry(d, d.charCodeAt(0)))), 3);
  });

  it('assertNeq', () => {

    assertNeq(count(<any> null), 1);
    assertNeq(count(['a', 'b', 'c']), 4);
    assertNeq(count(new Array(0)), 1);
    assertNeq(count(new Set(['a', 'b'])), 3);
    assertNeq(count(toMap(['a', 'b', 'c'], (d) => toEntry(d, d.charCodeAt(0)))), 4);
  });

  it('assertCount', () => {

    assertCount(<any> null, 0);
    assertCount(['a', 'b', 'c'], 3);
    assertCount(new Array(0), 0);
    assertCount(new Set(['a', 'b']), 2);
    assertCount(toMap(['a', 'b', 'c'], (d) => toEntry(d, d.charCodeAt(0))), 3);
  });

  it('assertEmpty', () => {

    assertEmpty(<any> null);
    assertEmpty(new Array(0));
    assertEmpty(new Set());
  });
});

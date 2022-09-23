import { Variable } from './variable';
import { Assert } from './assert';

const { assertEq, assertNeq, assertTrue, assertFalse } = Assert;

describe('Variable', () => {

  it('<boolean>', () => {
    let test: Variable<boolean> = new Variable(true);
    assertTrue(test.value);
    test.value = false;
    assertFalse(test.value);
    assertTrue(test.isSet());
    test = new Variable<boolean>();
    assertFalse(test.value);
    assertFalse(test.isSet());
  });

  it('Bool', () => {
    let test: Variable.Bool = new Variable.Bool(true);
    assertTrue(test.value);
    assertTrue(test.is());
    test.value = false;
    assertFalse(test.value);
    assertTrue(test.isSet());
    test = new Variable.Bool();
    assertFalse(test.value);
    assertFalse(test.isSet());
    assertTrue(test.isNot());
  });

  it('Num', () => {
    const test: Variable.Num = new Variable.Num(10);
    assertEq(test.value, 10);
    assertTrue(test.isSet());
    test.value = 5;
    assertNeq(test.value, 10);
    test.inc();
    assertNeq(test.value, 10);
    test.add(4);
    assertEq(test.value, 10);
    test.value = null;
    assertFalse(test.isSet());
  });

  it('Str', () => {
    const test: Variable.Str = new Variable.Str('A');
    assertEq(test.value, 'A');
    assertTrue(test.isSet());
    test.value = 'a';
    assertNeq(test.value, 'abc');
    test.concat('b', 'c');
    assertEq(test.value, 'abc');
    test.value = '';
    assertFalse(test.isSet());
  });
});

import { Variable } from './variable';
import { AccessorDelegate } from './accessor.delegate';
import { Assert } from './assert';
import { NullSafe } from './utils';

const { nvl} = NullSafe;

const { assertEq, assertNeq, assertTrue, assertFalse } = Assert;

describe('AccessorDelegate', () => {

  let map = new Map<string, number>();

  it('Delegate with string', () => {

    let del = new AccessorDelegate<string, number, number>(
      (id) => map.get(id) || null,
      (id, val) => { if (val) map.set(id, val) }
    );

    expect(del).toBeTruthy();

    let variable = del.var("pre");
    assertEq(variable.value, null);

    variable.value = 31;
    assertEq(variable.value, 31);
  });
});

import { AccessorVariable } from './accessor.variable';
import { Assert } from './assert';

const { assertEq } = Assert;

describe('AccessorVariable', () => {

  let map = new Map<string, number>();

  it('AccessorVariable with string', () => {

    let acc = new AccessorVariable<number>(
      () => map.get("stu") || null,
      (val) => { if (val) map.set("stu", val) }
    );

    expect(acc).toBeTruthy();
    assertEq(acc.value, null);

    acc.value = 31;
    assertEq(acc.value, 31);
  });
});

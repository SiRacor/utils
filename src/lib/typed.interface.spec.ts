/* eslint-disable @typescript-eslint/no-namespace */
import { TypedInterface } from './typed.interface';
import { Equality, NullSafe, Stream } from './utils';
import { Assert } from './assert';

const {isA} = TypedInterface;
const { getMatcher, getBool, assertTrue, assertFalse, assertEq, assertNeq } = Assert;

interface Animal extends TypedInterface {
  name: string, age: number
}

namespace Animal {

  export const uid = 'Animal@utils';

  export function create(name: string, age: number) : Animal {
    return {name: name, age: age, uids: uid};
  }
}
interface Bird extends Animal {
  wingspan: number
}

namespace Bird {

  export const uid = 'Bird@utils;' + Animal.uid;

  export function create(name: string, age: number, wingspan: number) : Bird {
    return {name: name, age: age, wingspan: wingspan, uids: uid};
  }
}

describe('TypedInterface', () => {
  it('isA', () => {

    const animal1 = {name: 'dove', age: 10};
    const animal2 = Animal.create('dove', 10);
    const animal3 = Bird.create('dove', 10, 2.5);

    assertFalse(isA(animal1, Animal.uid));
    assertFalse(isA(null, Animal.uid));
    assertTrue(isA(animal2, Animal.uid));
    assertTrue(isA(animal3, Animal.uid));
    assertTrue(isA(animal3, Bird.uid));
  });
});

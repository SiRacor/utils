import { NullSafe } from './utils';
/* eslint-disable @typescript-eslint/no-namespace */
import { TypedInterface, Interface } from './typed.interface';
import { Assert } from './assert';

const { isA, TypedConstructor } = TypedInterface;
const { assertTrue, assertFalse, assertEq } = Assert;
const { nvl } = NullSafe;

export interface Animal extends TypedInterface {
  name: string, age: number
}

export abstract class Animal {

  static clasz = new Interface<Animal>('Animal@utils');

  @TypedConstructor(Animal.clasz)
  static create(name: string, age: number): Animal {
    return <Animal> {name: name, age: age};
  }
}

Animal.create('', 0);

export interface Bird extends Animal {
  wingspan: number
}

export abstract class Bird {

  public static clasz = new Interface<Bird>('Bird@utils', Animal.clasz);

  @TypedConstructor(new Interface<Animal>('Bird@utils', Animal.clasz), () => Bird.create('', 0, 0))
  public static create(name: string, age: number, wingspan: number): Bird {
    return <Bird> {name: name, age: age, wingspan: wingspan};
  }
}

export interface Flock extends TypedInterface {
  amount: number;
  members: Bird[];
}

export abstract class Flock {

  public static clasz = new Interface<Flock>('Flock@utils');

  @TypedConstructor(Flock.clasz, () => Flock.create(0))
  public static create(amount: number, ...members: Bird[]): Flock {
    return <Flock> {amount: amount, members: nvl(members, [0])};
  }
}

export interface Zoo extends TypedInterface {
  map: Map<string, Animal[]>;
  caged: Set<Animal>;
}

export abstract class Zoo {

  public static clasz = new Interface<Zoo>('Zoo@utils');

  @TypedConstructor(Zoo.clasz, () => Zoo.create())
  public static create(): Zoo {
    return <Zoo> {map: new Map(), caged: new Set()};
  }
}

describe('TypedInterface', () => {
  it('isA', () => {
    const animal3 = Bird.create('dove', 10, 2.5);

    assertTrue(isA(animal3, Bird.clasz));
    assertTrue(isA(animal3, Animal.clasz));

    const animal1 = {name: 'dove', age: 10};
    const animal2 = Animal.create('dove', 10);

    assertFalse(Animal.clasz.isA(animal1));
    assertFalse(isA(null, Animal.clasz));
    assertTrue(isA(animal2, Animal.clasz));

    const a = JSON.stringify(animal3);
    const b = Interface.parseJSON(a);

    assertEq(b, animal3);

    const flock = Flock.create(2, animal3, Bird.create('raven', 19, 3));

    const c = Interface.toJSON(flock);
    const d = Interface.parseJSON(c);

    assertEq(d, flock);

    const zoo = Zoo.create();
    zoo.caged.add(animal2);
    zoo.caged.add(animal3);
    zoo.map.set('water', [animal2, animal3]);
    zoo.map.set('land', [animal2]);

    const e = Interface.toJSON(zoo);
    const f = Interface.parseJSON(e);

    assertEq(f, zoo);
  });
});

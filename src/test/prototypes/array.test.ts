import assert from "node:assert";
import test, { describe } from "node:test";
import { SArray } from "../../prototypes/array";

new SArray();

describe("Testing Array#random", () => {
  const array = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  test("random", () => {
    const actual = array.random();

    assert.strictEqual(array.includes(actual), true);
  });

  test("random(number)", () => {
    const actual = array.random(array.length);

    assert.strictEqual(actual.every(v => array.includes(v)), true);
    assert.deepStrictEqual(actual.map(v => actual.lastIndexOf(v)).sort(), Array.from(Array(array.length).keys()));
  });

  test("reandom(NaN)", () => {
    assert.deepStrictEqual(array.random(NaN), []);
    assert.deepStrictEqual(array.random(0), []);
    assert.deepStrictEqual(array.random(-1), []);
  });
});

describe("Testing Array#shuffle", () => {
  const array = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  test("shuffle", () => {
    const actual = Array.from(array).shuffle();

    assert.notDeepStrictEqual(actual, array);
    assert.strictEqual(actual.every(v => array.includes(v)), true);
    assert.strictEqual(actual.length, array.length);
    assert.deepStrictEqual(actual, actual.shuffle());
    assert.strictEqual(actual, actual.shuffle());
  });
});

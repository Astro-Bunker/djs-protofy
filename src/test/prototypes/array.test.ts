import assert from "node:assert";
import test, { describe } from "node:test";
import ArrayExtension from "../../prototypes/Array";

new ArrayExtension();

describe("Testing Array#random", () => {
  const array = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  test("random", () => {
    const actual = array.random();

    assert(array.includes(actual));
    assert([].random() === undefined);
  });

  test("random(number)", () => {
    const actual = array.random(array.length);

    assert(actual.every(v => array.includes(v)));
    assert.deepStrictEqual(actual.map(v => actual.lastIndexOf(v)).sort(), Array.from(Array(array.length).keys()));
  });

  test("random(NaN)", () => {
    assert.deepStrictEqual(array.random(NaN), []);
    assert.deepStrictEqual(array.random(0), []);
    assert.deepStrictEqual(array.random(-1), []);
  });
});

describe("Testing Array#shuffle", () => {
  const array = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  test("shuffle", () => {
    const actual = Array.from(array);

    let i = 0;
    const max = 3;
    do {
      try {
        assert.notDeepStrictEqual(actual.shuffle(), array);
        break;
      } catch (error) {
        if (++i === max) throw error;
      }
    } while (i < max);

    assert(actual.every(v => array.includes(v)));
    assert.strictEqual(actual.length, array.length);
    assert.deepStrictEqual(actual, actual.shuffle());
    assert.strictEqual(actual, actual.shuffle());
  });
});

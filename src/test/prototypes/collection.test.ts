import assert from "assert";
import { Collection } from "discord.js";
import test, { describe } from "node:test";
import CollectionExtension from "../../prototypes/Collection";

new CollectionExtension();

describe("Testing Collection prototypes", () => {
  const collection = new Collection(Array.from({ length: 10 }).map((_, i) => ([`key${i}`, `value${i}`])));

  test("keysToArray", () => {
    assert.strictEqual(typeof collection.keysToArray, "function");
    assert.deepStrictEqual(collection.keysToArray?.(), Array.from(collection.keys()));
  });

  test("valuesToArray", () => {
    assert.strictEqual(typeof collection.valuesToArray, "function");
    assert.deepStrictEqual(collection.valuesToArray?.(), Array.from(collection.values()));
  });
});

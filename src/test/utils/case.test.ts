import assert from "assert";
import { describe, test } from "node:test";
import { camelify, snakify } from "../../utils/case";

describe("Testing camelify", () => {
  test("camelify(string)", () => {
    assert.strictEqual(camelify("to_camel_case", "_"), "toCamelCase");
  });

  test("camelify(object)", () => {
    const actual = {
      name: "name",
      server_id: "serverId",
      user_id: "userId",
    };

    const expected = {
      name: "name",
      serverId: "serverId",
      userId: "userId",
    };

    assert.deepStrictEqual(camelify(actual), expected);
  });

  test("snakify(array)", () => {
    const actual = [{
      name: "name",
      server_id: "serverId",
      user_id: "userId",
    }, "this_is_a_test"];

    const expected = [{
      name: "name",
      serverId: "serverId",
      userId: "userId",
    }, "this_is_a_test"];

    assert.deepStrictEqual(camelify(actual), expected);
  });
});

describe("Testing snakify", () => {
  test("snakify(string)", () => {
    assert.strictEqual(snakify("ToSnakeCase"), "to_snake_case");
  });

  test("snakify(object)", () => {
    const actual = {
      name: "name",
      serverId: "serverId",
      UserId: "UserId",
    };

    const expected = {
      name: "name",
      server_id: "serverId",
      user_id: "UserId",
    };

    assert.deepStrictEqual(snakify(actual), expected);
  });

  test("snakify(array)", () => {
    const actual = [{
      name: "name",
      serverId: "serverId",
      UserId: "UserId",
    }, "thisIsATest"];

    const expected = [{
      name: "name",
      server_id: "serverId",
      user_id: "UserId",
    }, "thisIsATest"];

    assert.deepStrictEqual(snakify(actual), expected);
  });
});

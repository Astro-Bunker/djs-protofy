import assert from "assert";
import { describe, test } from "node:test";
import { snakify } from "../../utils/case";

describe("Testing snakify", () => {
  test("snakify(string)", () => {
    assert(snakify("ToSnakeCase") === "to_snake_case");
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

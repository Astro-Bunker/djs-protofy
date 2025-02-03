import assert from "assert";
import { describe, test } from "node:test";
import { to_snake_case } from "../../utils/case";

describe("Testing to_snake_case", () => {
  test("to_snake_case(string)", () => {
    assert.strictEqual(to_snake_case("ToSnakeCase"), "to_snake_case");
  });

  test("to_snake_case(object)", () => {
    const actual = to_snake_case({
      name: "name",
      serverId: "server_id",
      UserId: "user_id",
    });

    const expected = {
      name: "name",
      server_id: "server_id",
      user_id: "user_id",
    };

    assert.deepStrictEqual(to_snake_case(actual), expected);
  });

  test("to_snake_case(array)", () => {
    const actual = to_snake_case([{
      name: "name",
      serverId: "server_id",
      UserId: "user_id",
    }]);

    const expected = [{
      name: "name",
      server_id: "server_id",
      user_id: "user_id",
    }];

    assert.deepStrictEqual(to_snake_case(actual), expected);
  });
});

import assert from "assert";
import test, { describe } from "node:test";
import { replaceMentionCharacters, to_snake_case } from "../../utils";

describe("Testing replaceMentionCharacters", () => {
  test("replaceMentionCharacters(number)", () => {
    assert.strictEqual(replaceMentionCharacters("12345678901234567"), "12345678901234567");
    assert.strictEqual(
      replaceMentionCharacters("12345678901234567 12345678901234567"),
      "12345678901234567 12345678901234567",
    );
  });

  test("replaceMentionCharacters(channel_id)", () => {
    assert.strictEqual(replaceMentionCharacters("<#12345678901234567>"), "12345678901234567");
    assert.strictEqual(
      replaceMentionCharacters("<#12345678901234567> <#12345678901234567>"),
      "12345678901234567 12345678901234567",
    );
  });

  test("replaceMentionCharacters(command_id)", () => {
    assert.strictEqual(replaceMentionCharacters("</name:12345678901234567>"), "12345678901234567");
    assert.strictEqual(
      replaceMentionCharacters("</name:12345678901234567> </name:12345678901234567>"),
      "12345678901234567 12345678901234567",
    );
  });

  test("replaceMentionCharacters(emoji_id)", () => {
    assert.strictEqual(replaceMentionCharacters("<:name:12345678901234567>"), "12345678901234567");
    assert.strictEqual(replaceMentionCharacters("<a:name:12345678901234567>"), "12345678901234567");
    assert.strictEqual(
      replaceMentionCharacters("<:name:12345678901234567> <:name:12345678901234567>"),
      "12345678901234567 12345678901234567",
    );
  });

  test("replaceMentionCharacters(member_id)", () => {
    assert.strictEqual(replaceMentionCharacters("<@!12345678901234567>"), "12345678901234567");
    assert.strictEqual(
      replaceMentionCharacters("<@!12345678901234567> <@!12345678901234567>"),
      "12345678901234567 12345678901234567",
    );
  });

  test("replaceMentionCharacters(role_id)", () => {
    assert.strictEqual(replaceMentionCharacters("<@&12345678901234567>"), "12345678901234567");
    assert.strictEqual(
      replaceMentionCharacters("<@&12345678901234567> <@&12345678901234567>"),
      "12345678901234567 12345678901234567",
    );
  });

  test("replaceMentionCharacters(user_id)", () => {
    assert.strictEqual(replaceMentionCharacters("<@12345678901234567>"), "12345678901234567");
    assert.strictEqual(
      replaceMentionCharacters("<@12345678901234567> <@12345678901234567>"),
      "12345678901234567 12345678901234567",
    );
  });
});

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

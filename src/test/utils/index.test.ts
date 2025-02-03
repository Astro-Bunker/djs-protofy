import assert from "assert";
import test, { describe } from "node:test";
import { replaceMentionCharacters } from "../../utils";

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


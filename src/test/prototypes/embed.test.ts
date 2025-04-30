import assert from "assert";
import { type APIEmbed, Embed } from "discord.js";
import test, { describe } from "node:test";
import EmbedExtension from "../../prototypes/Embed";
import StringExtension from "../../prototypes/String";

new StringExtension();
new EmbedExtension();

describe("Testing Embed#getFieldIndexByName", () => {
  const apiEmbed: APIEmbed = {
    fields: [
      { name: "field-0-name", value: "field-0-value" },
      { name: "field-1-name", value: "field-1-value" },
      { name: "field-2-name", value: "field-2-value" },
    ],
  };

  // @ts-expect-error ts(2673)
  const embed = new Embed(apiEmbed) as Embed;

  test("Embed existing field", () => {
    assert.equal(embed.getFieldIndexByName("field-0-name"), 0);
    assert.equal(embed.getFieldIndexByName("field-1-name"), 1);
    assert.equal(embed.getFieldIndexByName("field-2-name"), 2);
  });

  test("Embed missing field", () => {
    assert.equal(embed.getFieldIndexByName("field-3-name"), -1);
  });
});

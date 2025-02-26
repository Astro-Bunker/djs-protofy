import assert from "assert";
import { codeBlock, EmbedBuilder } from "discord.js";
import test, { describe } from "node:test";
import { EmbedBuilderExtension } from "../../prototypes/embedBuilder";
import { StringExtension } from "../../prototypes/string";

new StringExtension();
new EmbedBuilderExtension();

describe("Testing EmbedBuilder#setCodeBlockedDescription", () => {
  const embed = new EmbedBuilder();

  test("EmbedBuilder#setCodeBlockedDescription(description)", () => {
    const description = "description";

    embed.setCodeBlockedDescription(description);

    assert(embed.data.description === codeBlock(description));
  });

  test("EmbedBuilder#setCodeBlockedDescription(language, description)", () => {
    const description = "description";
    const language = "language";

    embed.setCodeBlockedDescription(language, description);

    assert(embed.data.description === codeBlock(language, description));
  });
});

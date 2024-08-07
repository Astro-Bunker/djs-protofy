import assert from "assert";
import { codeBlock, EmbedBuilder } from "discord.js";
import test, { describe } from "node:test";
import { SEmbedBuilder } from "../../prototypes/embedBuilder";
import { SString } from "../../prototypes/string";

new SEmbedBuilder();
new SString();

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

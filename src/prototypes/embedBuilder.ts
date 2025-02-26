import { codeBlock, EmbedBuilder } from "discord.js";
import { DiscordStringLimits } from "../@enum";

export class EmbedBuilderExtension {
  declare setDescription: EmbedBuilder["setDescription"];

  constructor() {
    Object.defineProperties(EmbedBuilder.prototype, {
      setCodeBlockedDescription: { value: this.setCodeBlockedDescription },
    });
  }

  /** @DJSProtofy */
  setCodeBlockedDescription(description: string): EmbedBuilder;
  setCodeBlockedDescription(language: string, description: string): EmbedBuilder;
  setCodeBlockedDescription(language: string, description?: string) {
    if (typeof description === "string") {
      const limit = DiscordStringLimits.EmbedDescription - codeBlock(language, "").length;
      return this.setDescription(codeBlock(language, description.limit(limit)));
    }

    const limit = DiscordStringLimits.EmbedDescription - codeBlock("").length;
    return this.setDescription(codeBlock(language.limit(limit)));
  }
}

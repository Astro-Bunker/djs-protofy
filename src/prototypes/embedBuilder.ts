import { codeBlock, EmbedBuilder } from "discord.js";

export class SEmbedBuilder {
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
    this.setDescription(codeBlock(language, description!));
    return this as any;
  }
}

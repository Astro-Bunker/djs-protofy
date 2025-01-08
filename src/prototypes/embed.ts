import { Embed } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings } from "../utils";

export class SEmbed {
  declare fields: Embed["fields"];

  constructor() {
    Object.defineProperties(Embed.prototype, {
      getFieldByName: { value: this.getFieldByName },
      getFieldValueByName: { value: this.getFieldValueByName },
    });
  }

  /** @DJSProtofy */
  getFieldByName(name: string | RegExp) {
    if (typeof name === "string") return this.fields.find(field => compareStrings(field.name, name));

    if (isRegExp(name)) return this.fields.find(field => name.test(field.name));
  }

  /** @DJSProtofy */
  getFieldValueByName(name: string | RegExp) {
    return this.getFieldByName(name)?.value;
  }
}

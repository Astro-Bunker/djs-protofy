import { Embed } from "discord.js";
import { isRegExp } from "util/types";

export class SEmbed {
  declare fields: Embed["fields"];

  constructor() {
    Object.defineProperties(Embed.prototype, {
      getFieldByName: { value: this.getFieldByName },
      getFieldIndexByName: { value: this.getFieldIndexByName },
      getFieldValueByName: { value: this.getFieldValueByName },
    });
  }

  /** @DJSProtofy */
  getFieldByName(name: string | RegExp) {
    if (typeof name === "string") return this.fields.find(field => name.equals(field.name, true));

    if (isRegExp(name)) return this.fields.find(field => name.test(field.name));
  }

  /** @DJSProtofy */
  getFieldIndexByName(name: string | RegExp) {
    if (typeof name === "string") return this.fields.findIndex(field => name.equals(field.name, true));

    if (isRegExp(name)) return this.fields.findIndex(field => name.test(field.name));

    return -1;
  }

  /** @DJSProtofy */
  getFieldValueByName(name: string | RegExp) {
    return this.getFieldByName(name)?.value;
  }
}

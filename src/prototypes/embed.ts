import { Embed } from "discord.js";
import { isRegExp } from "util/types";

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
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.fields.find(field => {
      if (typeof name === "string") return field.name === name;

      return name.test(field.name);
    });
  }

  /** @DJSProtofy */
  getFieldValueByName(name: string | RegExp) {
    return this.getFieldByName(name)?.value;
  }
}

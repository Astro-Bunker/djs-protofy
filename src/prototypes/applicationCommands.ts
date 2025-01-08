import { ApplicationCommandManager, type ApplicationCommand, type GuildResolvable } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings } from "../utils";

export class ApplicationCommands<
  ApplicationCommandScope extends ApplicationCommand = ApplicationCommand<{ guild: GuildResolvable; }>,
  PermissionsOptionsExtras = { guild: GuildResolvable; },
  PermissionsGuildType = null
> {
  declare cache: ApplicationCommandManager<ApplicationCommandScope, PermissionsOptionsExtras, PermissionsGuildType>["cache"];
  declare fetch: ApplicationCommandManager<ApplicationCommandScope, PermissionsOptionsExtras, PermissionsGuildType>["fetch"];

  constructor() {
    Object.defineProperties(ApplicationCommandManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      fetchByName: { value: this.fetchByName },
    });
  }

  /** @DJSProtofy */
  getById(id: string) {
    return this.cache.get(id);
  }

  /** @DJSProtofy */
  getByName(name: string | RegExp) {
    if (typeof name === "string") return this.cache.find(cached => compareStrings(cached.name, name));

    if (isRegExp(name)) return this.cache.find(cached => name.test(cached.name));
  }

  /** @DJSProtofy */
  async fetchByName(name: string | RegExp) {
    const exists = this.getByName(name);
    if (exists) return exists;
    await this.fetch();
    return this.getByName(name);
  }
}

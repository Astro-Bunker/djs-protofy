import { ApplicationCommandManager, type ApplicationCommand, type GuildResolvable } from "discord.js";
import { isRegExp } from "util/types";

export class ApplicationCommandManagerExtension<
  ApplicationCommandScope extends ApplicationCommand = ApplicationCommand<{ guild: GuildResolvable }>,
  PermissionsOptionsExtras = { guild: GuildResolvable },
  PermissionsGuildType = null,
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
  getByName(name: string | RegExp): ApplicationCommandScope | undefined
  getByName(name: string | RegExp) {
    if (typeof name === "string") return this.cache.find(cached => name.equals(cached.name, true));

    if (isRegExp(name)) return this.cache.find(cached => name.test(cached.name));
  }

  /** @DJSProtofy */
  fetchByName(name: string | RegExp): Promise<ApplicationCommandScope | undefined>
  async fetchByName(name: string | RegExp) {
    const exists = this.getByName(name);
    if (exists) return exists;
    await this.fetch();
    return this.getByName(name);
  }
}

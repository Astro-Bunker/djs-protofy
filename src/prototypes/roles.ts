import { Client, Collection, PermissionResolvable, Role, RoleManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings } from "../utils";

export class Roles {
  declare cache: Collection<string, Role>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(RoleManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getByPosition: { value: this.getByPosition },
      getByUnicodeEmoji: { value: this.getByUnicodeEmoji },
      getByRawPosition: { value: this.getByRawPosition },
      filterByUnicodeEmoji: { value: this.filterByUnicodeEmoji },
      filterByMembers: { value: this.filterByMembers },
      filterByPermissions: { value: this.filterByPermissions },
      filterEditables: { value: this.filterEditables },
      filterUneditables: { value: this.filterUneditables },
      filterHoists: { value: this.filterHoists },
      filterNonHoists: { value: this.filterNonHoists },
      filterManageds: { value: this.filterManageds },
      filterUnmanageds: { value: this.filterUnmanageds },
      filterMentionables: { value: this.filterMentionables },
      filterUnmentionables: { value: this.filterUnmentionables },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(role => {
      if (typeof name === "string") {
        return compareStrings(role.name, name);
      }

      return name.test(role.name);
    });
  }

  getByPosition(position: number) {
    return this.cache.find(role => role.position === position);
  }

  getByRawPosition(position: number) {
    return this.cache.find(role => role.rawPosition === position);
  }
  getByUnicodeEmoji(emoji: string) {
    return this.cache.find(role => role.unicodeEmoji === emoji);
  }

  filterByMembers(memberId: string | string[]) {
    if (!Array.isArray(memberId)) memberId = [memberId];
    return this.cache.filter(role => role.members.hasAll(...memberId));
  }

  filterByPermissions(...permissions: PermissionResolvable[]) {
    return this.cache.filter(role => role.permissions.has(permissions));
  }

  filterByUnicodeEmoji(emoji: string) {
    return this.cache.filter(role => role.unicodeEmoji === emoji);
  }

  filterEditables() {
    return this.cache.filter(role => role.editable);
  }

  filterUneditables() {
    return this.cache.filter(role => !role.editable);
  }

  filterHoists() {
    return this.cache.filter(role => role.hoist);
  }

  filterNonHoists() {
    return this.cache.filter(role => !role.hoist);
  }

  filterManageds() {
    return this.cache.filter(role => role.managed);
  }

  filterUnmanageds() {
    return this.cache.filter(role => !role.managed);
  }

  filterMentionables() {
    return this.cache.filter(role => role.mentionable);
  }

  filterUnmentionables() {
    return this.cache.filter(role => !role.mentionable);
  }
}

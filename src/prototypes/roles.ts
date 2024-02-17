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
      filterByEditables: { value: this.filterByEditables },
      filterByUneditables: { value: this.filterByUneditables },
      filterByHoists: { value: this.filterByHoists },
      filterByNonHoists: { value: this.filterByNonHoists },
      filterByManageds: { value: this.filterByManageds },
      filterByUnmanageds: { value: this.filterByUnmanageds },
      filterByMentionables: { value: this.filterByMentionables },
      filterByUnmentionables: { value: this.filterByUnmentionables },
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

  filterByEditables() {
    return this.cache.filter(role => role.editable);
  }

  filterByUneditables() {
    return this.cache.filter(role => !role.editable);
  }

  filterByHoists() {
    return this.cache.filter(role => role.hoist);
  }

  filterByNonHoists() {
    return this.cache.filter(role => !role.hoist);
  }

  filterByManageds() {
    return this.cache.filter(role => role.managed);
  }

  filterByUnmanageds() {
    return this.cache.filter(role => !role.managed);
  }

  filterByMentionables() {
    return this.cache.filter(role => role.mentionable);
  }

  filterByUnmentionables() {
    return this.cache.filter(role => !role.mentionable);
  }
}

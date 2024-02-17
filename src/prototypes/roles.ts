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
      getByMembers: { value: this.getByMembers },
      getByPermissions: { value: this.getByPermissions },
      getByPosition: { value: this.getByPosition },
      getByRawPosition: { value: this.getByRawPosition },
      getByUnicodeEmoji: { value: this.getByUnicodeEmoji },
      getEditable: { value: this.getEditables },
      getUneditable: { value: this.getUneditables },
      getHoist: { value: this.getHoists },
      getNonHoist: { value: this.getNonHoists },
      getManaged: { value: this.getManageds },
      getUnmanaged: { value: this.getUnmanageds },
      getMentionable: { value: this.getMentionables },
      getUnmentionable: { value: this.getUnmentionables },
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

  getByMembers(memberId: string | string[]) {
    if (!Array.isArray(memberId)) memberId = [memberId];
    return this.cache.filter(role => role.members.hasAll(...memberId));
  }

  getByPermissions(...permissions: PermissionResolvable[]) {
    return this.cache.filter(role => role.permissions.has(permissions));
  }

  getByPosition(position: number) {
    return this.cache.find(role => role.position === position);
  }

  getByRawPosition(position: number) {
    return this.cache.find(role => role.rawPosition === position);
  }

  getByUnicodeEmoji(emoji: string) {
    return this.cache.filter(role => role.unicodeEmoji === emoji);
  }

  getEditables() {
    return this.cache.filter(role => role.editable);
  }

  getUneditables() {
    return this.cache.filter(role => !role.editable);
  }

  getHoists() {
    return this.cache.filter(role => role.hoist);
  }

  getNonHoists() {
    return this.cache.filter(role => !role.hoist);
  }

  getManageds() {
    return this.cache.filter(role => role.managed);
  }

  getUnmanageds() {
    return this.cache.filter(role => !role.managed);
  }

  getMentionables() {
    return this.cache.filter(role => role.mentionable);
  }

  getUnmentionables() {
    return this.cache.filter(role => !role.mentionable);
  }
}

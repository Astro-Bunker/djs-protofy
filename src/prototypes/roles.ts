import { Client, Collection, RoleManager, Role, PermissionsBitField } from "discord.js";
import { isRegExp } from "util/types";

export class Roles {
  declare cache: Collection<string, Role>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(RoleManager.prototype, {
      getById: { value: this.getById },
      getAllEditable: { value: this.getAllEditable },
      getAllUneditable: { value: this.getAllUneditable },
      getAllHoist: { value: this.getAllHoist },
      getAllNonHoist: { value: this.getAllNonHoist },
      getAllManaged: { value: this.getAllManaged },
      getAllUnmanaged: { value: this.getAllUnmanaged },
      getAllMentionable: { value: this.getAllMentionable },
      getAllUnmentionable: { value: this.getAllUnmentionable },
      getByName: { value: this.getByName },
      getByPosition: { value: this.getByPosition },
      getByRawPosition: { value: this.getByRawPosition },
      getByUnicodeEmoji: { value: this.getByUnicodeEmoji },
      getByPermissions: { value: this.getByPermissions },
      getByMember: { value: this.getByMember },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getAllEditable() {
    return this.cache.filter(role => role.editable);
  }

  getAllUneditable() {
    return this.cache.filter(role => !role.editable);
  }

  getAllHoist() {
    return this.cache.filter(role => role.hoist);
  }

  getAllNonHoist() {
    return this.cache.filter(role => !role.hoist);
  }

  getAllManaged() {
    return this.cache.filter(role => role.managed);
  }

  getAllUnmanaged() {
    return this.cache.filter(role => !role.managed);
  }

  getAllMentionable() {
    return this.cache.filter(role => role.mentionable);
  }

  getAllUnmentionable() {
    return this.cache.filter(role => !role.mentionable);
  }

  getByName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(role => {
      if (typeof name === "string") {
        return role.name === name;
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
    return this.cache.filter(role => role.unicodeEmoji === emoji);
  }

  getByPermissions(permissions: PermissionsBitField) {
    return this.cache.filter(role => role.permissions.any(permissions));
  }

  getByMember(memberId: string) {
    return this.cache.filter(role => role.members.has(memberId));
  }
}

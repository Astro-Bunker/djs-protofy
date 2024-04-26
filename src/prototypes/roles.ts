import { Collection, PermissionResolvable, Role, RoleManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings, replaceMentionCharacters } from "../utils";

export class Roles {
  declare cache: RoleManager["cache"];

  constructor() {
    Object.defineProperties(RoleManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getByPosition: { value: this.getByPosition },
      getByRawPosition: { value: this.getByRawPosition },
      getByUnicodeEmoji: { value: this.getByUnicodeEmoji },
      filterByMembersId: { value: this.filterByMembersId },
      filterByPermissions: { value: this.filterByPermissions },
      filterByUnicodeEmoji: { value: this.filterByUnicodeEmoji },
      filterEditables: { value: this.filterEditables },
      filterUneditables: { value: this.filterUneditables },
      filterHoists: { value: this.filterHoists },
      filterNonHoists: { value: this.filterNonHoists },
      filterManageds: { value: this.filterManageds },
      filterUnmanageds: { value: this.filterUnmanageds },
      filterMentionables: { value: this.filterMentionables },
      filterUnmentionables: { value: this.filterUnmentionables },
      searchBy: { value: this.searchBy },
      _searchByMany: { value: this._searchByMany },
      _searchByRegExp: { value: this._searchByRegExp },
      _searchByString: { value: this._searchByString },
    });
  }

  /** @DJSProtofy */
  getById(id: string) {
    return this.cache.get(id);
  }

  /** @DJSProtofy */
  getByName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(role => {
      if (typeof name === "string") {
        return compareStrings(role.name, name);
      }

      return name.test(role.name);
    });
  }

  /** @DJSProtofy */
  getByPosition(position: number) {
    return this.cache.find(role => role.position === position);
  }

  /** @DJSProtofy */
  getByRawPosition(position: number) {
    return this.cache.find(role => role.rawPosition === position);
  }

  /** @DJSProtofy */
  getByUnicodeEmoji(emoji: string) {
    return this.cache.find(role => role.unicodeEmoji === emoji);
  }

  /** @DJSProtofy */
  filterByMembersId(memberId: string | string[]) {
    if (!Array.isArray(memberId)) memberId = [memberId];
    return this.cache.filter(role => role.members.hasAll(...memberId));
  }

  /** @DJSProtofy */
  filterByPermissions(...permissions: PermissionResolvable[]) {
    return this.cache.filter(role => role.permissions.has(permissions));
  }

  /** @DJSProtofy */
  filterByUnicodeEmoji(emoji: string) {
    return this.cache.filter(role => role.unicodeEmoji === emoji);
  }

  /** @DJSProtofy */
  filterEditables() {
    return this.cache.filter(role => role.editable);
  }

  /** @DJSProtofy */
  filterUneditables() {
    return this.cache.filter(role => !role.editable);
  }

  /** @DJSProtofy */
  filterHoists() {
    return this.cache.filter(role => role.hoist);
  }

  /** @DJSProtofy */
  filterNonHoists() {
    return this.cache.filter(role => !role.hoist);
  }

  /** @DJSProtofy */
  filterManageds() {
    return this.cache.filter(role => role.managed);
  }

  /** @DJSProtofy */
  filterUnmanageds() {
    return this.cache.filter(role => !role.managed);
  }

  /** @DJSProtofy */
  filterMentionables() {
    return this.cache.filter(role => role.mentionable);
  }

  /** @DJSProtofy */
  filterUnmentionables() {
    return this.cache.filter(role => !role.mentionable);
  }

  /** @DJSProtofy */
  searchBy<T extends string>(query: T): Role | undefined;
  searchBy<T extends RegExp>(query: T): Role | undefined;
  searchBy<T extends Search>(query: T): Role | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): Role | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, Role>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return typeof query.id === "string" && this.cache.get(query.id) ||
      this.cache.find(role => (
        typeof query.name === "string" && compareStrings(query.name, role.name) ||
        isRegExp(query.name) && query.name.test(role.name)
      ));
  }

  /** @DJSProtofy */
  protected _searchByMany(queries: (string | RegExp | Search)[]) {
    const cache: this["cache"] = new Collection();
    for (const query of queries) {
      const result = this.searchBy(query);
      if (result) cache.set(result.id, result);
    }
    return cache;
  }

  /** @DJSProtofy */
  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((role) => query.test(role.name));
  }

  /** @DJSProtofy */
  protected _searchByString(query: string) {
    query = replaceMentionCharacters(query);
    return this.cache.get(query) ??
      this.cache.find((role) => [
        role.name.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string
  name?: string | RegExp
}

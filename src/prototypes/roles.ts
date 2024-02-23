import { Collection, PermissionResolvable, Role, RoleManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings } from "../utils";

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

  filterByMembersId(memberId: string | string[]) {
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

  searchBy<T extends string>(query: T): Role | undefined;
  searchBy<T extends RegExp>(query: T): Role | undefined;
  searchBy<T extends Search>(query: T): Role | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): Role | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, Role>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return this.cache.find(role =>
      (
        query.id && (
          typeof query.id === "string" ?
            compareStrings(query.id, role.id) :
            query.id.test(role.id)
        )
      ) || (
        query.name && (
          typeof query.name === "string" ?
            compareStrings(query.name, role.name) :
            query.name.test(role.name)
        )
      ));
  }

  protected _searchByMany(queries: (string | RegExp | Search)[]) {
    const cache: this["cache"] = new Collection();
    for (const query of queries) {
      const result = this.searchBy(query);
      if (result) cache.set(result.id, result);
    }
    return cache;
  }

  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((role) =>
      query.test(role.id) ||
      query.test(role.name));
  }

  protected _searchByString(query: string) {
    return this.cache.get(query) ??
      this.cache.find((role) => [
        role.name.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string | RegExp
  name?: string | RegExp
}

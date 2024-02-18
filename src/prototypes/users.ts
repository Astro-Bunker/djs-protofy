import { APIUser, Client, UserManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings, serializeRegExp } from "../utils";

export class Users {
  declare cache: UserManager["cache"];
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(UserManager.prototype, {
      getById: { value: this.getById },
      getByGlobalName: { value: this.getByGlobalName },
      getByUsername: { value: this.getByUsername },
      getByDisplayName: { value: this.getByDisplayName },
      getInShardsById: { value: this.getInShardsById },
      getInShardsByDisplayName: { value: this.getInShardsByDisplayName },
      getInShardsByGlobalName: { value: this.getInShardsByGlobalName },
      getInShardsByUsername: { value: this.getInShardsByUsername },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByDisplayName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(user => {
      if (typeof name === "string") {
        return compareStrings(user.displayName, name);
      }

      return name.test(user.displayName);
    });
  }

  getByGlobalName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(user => {
      if (user.globalName === null) return false;

      if (typeof name === "string") {
        return compareStrings(user.globalName, name);
      }

      return name.test(user.globalName);
    });
  }

  getByUsername(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(user => {
      if (typeof name === "string") {
        return compareStrings(user.username, name);
      }

      return name.test(user.username);
    });
  }

  async getInShardsById(id: string) {
    if (typeof id !== "string" || !this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.users.getById(id), { context: id })
      .then(res => res.find(Boolean) as APIUser ?? null)
      .catch(() => null);
  }

  async getInShardsByDisplayName(name: string | RegExp) {
    if ((typeof name !== "string" && !isRegExp(name)) || !this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.users.getByDisplayName(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as APIUser ?? null)
      .catch(() => null);
  }

  async getInShardsByGlobalName(name: string | RegExp) {
    if ((typeof name !== "string" && !isRegExp(name)) || !this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.users.getByGlobalName(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as APIUser ?? null)
      .catch(() => null);
  }

  async getInShardsByUsername(name: string | RegExp) {
    if ((typeof name !== "string" && !isRegExp(name)) || !this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.users.getByUsername(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as APIUser ?? null)
      .catch(() => null);
  }

  searchBy(query: string | RegExp | Search) {
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return this.cache.find((user) =>
      (
        query.id && (
          typeof query.id === "string" ?
            compareStrings(query.id, user.id) :
            query.id.test(user.id)
        )
      ) || (
        query.displayName && (
          typeof query.displayName === "string" ?
            compareStrings(query.displayName, user.displayName) :
            query.displayName.test(user.displayName)
        )
      ) || (
        query.globalName && user.globalName && (
          typeof query.globalName === "string" ?
            compareStrings(query.globalName, user.globalName) :
            query.globalName.test(user.globalName)
        )
      ) || (
        query.username && (
          typeof query.username === "string" ?
            compareStrings(query.username, user.username) :
            query.username.test(user.username)
        )
      ));
  }

  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((user) => query.test(user.id) ||
      query.test(user.displayName) ||
      query.test(user.username) ||
      (user.globalName && query.test(user.globalName)));
  }

  protected _searchByString(query: string) {
    return this.cache.find((user) => [
      user.id,
      user.displayName.toLowerCase(),
      user.globalName?.toLowerCase(),
      user.username.toLowerCase(),
    ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string | RegExp
  displayName?: string | RegExp
  globalName?: string | RegExp
  username?: string | RegExp
}

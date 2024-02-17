import { APIUser, Client, Collection, User, UserManager } from "discord.js";
import { isRegExp } from "util/types";
import { serializeRegExp } from "../utils";

export class Users {
  declare cache: Collection<string, User>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(UserManager.prototype, {
      getById: { value: this.getById },
      getInShardsById: { value: this.getInShardsById },
      getByGlobalName: { value: this.getByGlobalName },
      getByUsername: { value: this.getByUsername },
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
        return user.displayName === name;
      }

      return name.test(user.displayName);
    });
  }

  getByGlobalName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(user => {
      if (user.globalName === null) return false;

      if (typeof name === "string") {
        return user.globalName === name;
      }

      return name.test(user.globalName);
    });
  }

  getByUsername(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(user => {
      if (typeof name === "string") {
        return user.username === name;
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

  async getInShardsByUsername(name: string | RegExp) {
    if ((typeof name !== "string" && !isRegExp(name)) || !this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.users.getByUsername(isRegExp ? RegExp(source, flags) : source), { context })
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
}

import { APIUser, Client, UserManager } from "discord.js";

export class Users {
  declare cache: UserManager["cache"];
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(UserManager.prototype, {
      getById: { value: this.getById },
      getByUsername: { value: this.getByUsername },
      getByGlobalName: { value: this.getByGlobalName },
      getInShardsById: { value: this.getInShardsById },
      getInShardsByUsername: { value: this.getInShardsByUsername },
      getInShardsByGlobalName: { value: this.getInShardsByGlobalName },
      getInShardsByDisplayName: { value: this.getInShardsByDisplayName },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByUsername(name: string | RegExp) {
    if (!name) return;

    return this.cache.find(user => {
      if (typeof name === "string") {
        return user.username === "name";
      }

      return name.test(user.username);
    });
  }

  getByGlobalName(name: string | RegExp) {
    if (!name) return;

    return this.cache.find(user => {
      if (typeof name === "string") {
        return user.globalName === "name";
      }

      if (user.globalName)
        return name.test(user.globalName);
    });
  }

  getByDisplayName(name: string | RegExp) {
    if (!name) return;

    return this.cache.find(user => {
      if (typeof name === "string") {
        return user.displayName === "name";
      }

      return name.test(user.displayName);
    });
  }

  async getInShardsById(id: string) {
    if (!id) return null;

    return await this.client.shard?.broadcastEval((shard, id) => shard.users.getById(id), { context: id })
      .then(res => res.find(Boolean) as APIUser | undefined)
      .catch(() => null);
  }

  async getInShardsByGlobalName(name: string | RegExp) {
    if (!name || !this.client.shard) return null;

    const isRegExp = name instanceof RegExp;
    let flags: string | undefined;

    if (name instanceof RegExp) {
      flags = name.flags;
      name = name.source;
    }

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, name }) =>
      shard.users.getByGlobalName(isRegExp ? RegExp(name, flags) : name), { context: { name, isRegExp, flags } })
      .then(res => res.find(Boolean) as APIUser | null)
      .catch(() => null);
  }

  async getInShardsByDisplayName(name: string | RegExp) {
    if (!name || !this.client.shard) return null;

    const isRegExp = name instanceof RegExp;
    let flags: string | undefined;

    if (name instanceof RegExp) {
      flags = name.flags;
      name = name.source;
    }

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, name }) =>
      shard.users.getByDisplayName(isRegExp ? RegExp(name, flags) : name), { context: { name, isRegExp, flags } })
      .then(res => res.find(Boolean) as APIUser | null)
      .catch(() => null);
  }

  async getInShardsByUsername(name: string | RegExp) {
    if (!name || !this.client.shard) return null;

    const isRegExp = name instanceof RegExp;
    let flags: string | undefined;

    if (name instanceof RegExp) {
      flags = name.flags;
      name = name.source;
    }

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, name }) =>
      shard.users.getByUsername(isRegExp ? RegExp(name, flags) : name), { context: { name, isRegExp, flags } })
      .then(res => res.find(Boolean) as APIUser | null)
      .catch(() => null);
  }
}

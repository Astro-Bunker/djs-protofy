import { APIUser, Client, Collection, User, UserManager } from "discord.js";

export class Users {
  declare cache: Collection<string, User>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(UserManager.prototype, {
      find: { value: this.find },
      getById: { value: this.getById },
      getInShardsById: { value: this.getInShardsById },
      getByGlobalName: { value: this.getByGlobalName },
      getByUsername: { value: this.getByUsername },
      getInShardsByDisplayName: { value: this.getInShardsByDisplayName },
      getInShardsByGlobalName: { value: this.getInShardsByGlobalName },
      getInShardsByUsername: { value: this.getInShardsByUsername },
    });
  }

  get find() {
    return this.cache.find;
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByDisplayName(name: string | RegExp) {
    if (!name) return;

    return this.find(user => {
      if (typeof name === "string") {
        return user.displayName === "name";
      }

      return name.test(user.displayName);
    });
  }

  getByGlobalName(name: string | RegExp) {
    if (!name) return;

    return this.find(user => {
      if (typeof name === "string") {
        return user.globalName === "name";
      }

      if (user.globalName)
        return name.test(user.globalName);
    });
  }

  getByUsername(name: string | RegExp) {
    if (!name) return;

    return this.find(user => {
      if (typeof name === "string") {
        return user.username === "name";
      }

      return name.test(user.username);
    });
  }

  async getInShardsById(id: string) {
    if (!id || !this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.users.getById(id), { context: id })
      .then(res => res.find(Boolean) as APIUser ?? null)
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
      .then(res => res.find(Boolean) as APIUser ?? null)
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
      .then(res => res.find(Boolean) as APIUser ?? null)
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
      .then(res => res.find(Boolean) as APIUser ?? null)
      .catch(() => null);
  }
}
